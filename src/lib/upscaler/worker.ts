import {
  BlobSource,
  BufferTarget,
  CanvasSource,
  EncodedAudioPacketSource,
  EncodedPacket,
  EncodedPacketSink,
  Input,
  MP4,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  ReadableStreamSource,
  StreamTarget,
  VideoSample,
  VideoSampleSink,
} from 'mediabunny';

import WebSR from '@websr/websr';
import { detectHardware, type HardwareProfile } from './hardware-detector';
import { initTypedArrayPool, getTypedArrayPool } from './utils/object-pool';

import type {
  WorkerRequestMessage,
  WorkerResponseMessage,
  InitData,
  NetworkData,
  Resolution
} from './types/worker-messages';

// Worker state
let gpu: any | false;
let websr: WebSR;
let upscaled_canvas: OffscreenCanvas;
let original_canvas: OffscreenCanvas;
let internalAICanvas: OffscreenCanvas; // Internal canvas for WebSR (not connected to UI)
let resolution: Resolution;
let finalDimensions: { width: number; height: number };
let finalScale: number = 1;
let ctx: ImageBitmapRenderingContext | null;

// Performance optimization state
let hardwareProfile: HardwareProfile | null = null;

// Default weights - Large model for best quality
const weights = require('./weights/cnn-2x-l-rl.json');

/**
 * Calculate final output dimensions with minimum 1080p enforcement
 * Returns dimensions for: input (adjusted), AI output (2x), and final output
 */
function calculateFinalDimensions(inputWidth: number, inputHeight: number) {
  const AI_SCALE = 2;
  const MIN_WIDTH = 1920;
  const MIN_HEIGHT = 1080;

  // Adjust to WebGPU alignment (divisible by 8)
  // Use ceiling to avoid losing pixels
  const adjustedInput = {
    width: Math.ceil(inputWidth / 8) * 8,
    height: Math.ceil(inputHeight / 8) * 8
  };

  // After AI upscaling (2x)
  const aiOutput = {
    width: adjustedInput.width * AI_SCALE,
    height: adjustedInput.height * AI_SCALE
  };

  // Enforce minimum dimensions while preserving aspect ratio
  let finalWidth = aiOutput.width;
  let finalHeight = aiOutput.height;

  // Calculate scale needed to meet minimums (if any)
  const scaleForWidth = finalWidth < MIN_WIDTH ? MIN_WIDTH / finalWidth : 1;
  const scaleForHeight = finalHeight < MIN_HEIGHT ? MIN_HEIGHT / finalHeight : 1;
  const requiredScale = Math.max(scaleForWidth, scaleForHeight);

  // Apply proportional scaling if needed
  if (requiredScale > 1) {
    finalWidth = Math.round(finalWidth * requiredScale);
    finalHeight = Math.round(finalHeight * requiredScale);
  }

  // Ensure final dimensions are even (required for video encoding)
  if (finalWidth % 2 !== 0) finalWidth++;
  if (finalHeight % 2 !== 0) finalHeight++;

  // Calculate scale factor for reference
  const scaleX = finalWidth / aiOutput.width;
  const scaleY = finalHeight / aiOutput.height;
  const additionalScale = Math.max(scaleX, scaleY);

  return {
    input: adjustedInput,
    aiOutput: aiOutput,
    final: {
      width: finalWidth,
      height: finalHeight
    },
    additionalScale: additionalScale
  };
}

/**
 * Check if WebGPU is supported in this environment
 */
async function isSupported(): Promise<void> {
  gpu = await WebSR.initWebGPU();

  // Detect hardware capabilities for performance optimization
  if (gpu !== false) {
    try {
      hardwareProfile = await detectHardware();
      console.log('Hardware profile detected:', hardwareProfile);
      console.log('Recommended settings:', hardwareProfile.recommended);
    } catch (e) {
      console.warn('Hardware detection failed:', e);
    }
  }

  postMessage({
    cmd: 'isSupported',
    data: gpu !== false
  } satisfies WorkerResponseMessage);
}

/**
 * Initialize the worker with canvases and create WebSR instance
 */
async function init(config: InitData): Promise<void> {
  if (!gpu) {
    gpu = await WebSR.initWebGPU();
  }

  // Calculate all dimensions (input, AI output, final with 1080p minimum)
  const dims = calculateFinalDimensions(config.resolution.width, config.resolution.height);

  console.log(`Input: ${config.resolution.width}x${config.resolution.height}`);
  console.log(`Adjusted Input: ${dims.input.width}x${dims.input.height}`);
  console.log(`AI Output (2x): ${dims.aiOutput.width}x${dims.aiOutput.height}`);
  console.log(`Final Output: ${dims.final.width}x${dims.final.height} (scale: ${dims.additionalScale.toFixed(2)}x)`);

  resolution = dims.input;
  finalDimensions = dims.final;
  finalScale = dims.additionalScale;

  // Initialize object pool for typed arrays (used in CPU sharpening)
  if (hardwareProfile?.recommended.useObjectPools) {
    const arraySize = dims.final.width * dims.final.height * 4;
    initTypedArrayPool(arraySize);
    console.log('Object pools initialized');
  }

  // Create INTERNAL canvas for WebSR processing (not connected to UI)
  // This prevents laggy preview updates during video processing
  internalAICanvas = new OffscreenCanvas(dims.aiOutput.width, dims.aiOutput.height);

  websr = new WebSR({
    network_name: "anime4k/cnn-2x-l",
    weights,
    resolution: resolution,
    gpu: gpu,
    canvas: internalAICanvas as any // Use internal canvas, not the UI-connected one
  });

  // Store references (upscaled_canvas only used for initial preview, not during processing)
  upscaled_canvas = config.upscaled;
  original_canvas = config.original;

  // Resize upscaled_canvas to AI output (2x) - for initial preview only
  upscaled_canvas.width = dims.aiOutput.width;
  upscaled_canvas.height = dims.aiOutput.height;

  // Resize original_canvas to FINAL output (min 1080p)
  original_canvas.width = dims.final.width;
  original_canvas.height = dims.final.height;

  ctx = original_canvas.getContext('bitmaprenderer');

  // Create bitmap with adjusted dimensions for AI
  const adjustedBitmap = await createImageBitmap(config.bitmap, {
    resizeWidth: dims.input.width,
    resizeHeight: dims.input.height,
  });

  // Render through AI to INTERNAL canvas (not visible on UI)
  await websr.render(adjustedBitmap as any);

  // Copy result to visible upscaled_canvas ONLY for initial preview
  const upscaledCtx = upscaled_canvas.getContext('2d');
  if (upscaledCtx) {
    upscaledCtx.drawImage(internalAICanvas, 0, 0);
  }

  // Create final preview bitmap (scaled to final dimensions)
  const finalBitmap = await createImageBitmap(adjustedBitmap, {
    resizeWidth: dims.final.width,
    resizeHeight: dims.final.height,
  });

  if (ctx) {
    ctx.transferFromImageBitmap(finalBitmap);
  }
}

/**
 * Switch to a different AI upscaling network
 */
async function switchNetwork(name: string, weights: any, bitmap: ImageBitmap): Promise<void> {
  websr.switchNetwork(name as any, weights);

  await websr.render(bitmap as any);
}

/**
 * Apply sharpening with object pooling for better performance
 * @param ctx Canvas 2D context
 * @param canvas Canvas to sharpen  
 * @param amount Sharpening strength (0.0 - 1.0), default 0.4
 */
function applySharpen(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  amount: number = 0.4
): void {
  const width = canvas.width;
  const height = canvas.height;

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Try to use pooled array, fallback to new allocation
  const pool = getTypedArrayPool();
  let tempData: Uint8ClampedArray;
  let usePool = false;

  if (pool && hardwareProfile?.recommended.useObjectPools) {
    try {
      tempData = pool.acquire();
      tempData.set(pixels);
      usePool = true;
    } catch (e) {
      tempData = new Uint8ClampedArray(pixels);
    }
  } else {
    tempData = new Uint8ClampedArray(pixels);
  }

  // Pre-calculate kernel values for performance
  const center = 1 + 4 * amount;
  const edge = -amount;

  // Apply convolution (skip edges to avoid boundary issues)
  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width * 4;
    const prevRowOffset = (y - 1) * width * 4;
    const nextRowOffset = (y + 1) * width * 4;

    for (let x = 1; x < width - 1; x++) {
      const colOffset = x * 4;
      const prevCol = (x - 1) * 4;
      const nextCol = (x + 1) * 4;

      // Process RGB channels (skip alpha at index 3)
      for (let c = 0; c < 3; c++) {
        // Apply 3x3 kernel with pre-calculated indices
        const sum =
          tempData[prevRowOffset + colOffset + c] * edge +  // top
          tempData[rowOffset + prevCol + c] * edge +        // left
          tempData[rowOffset + colOffset + c] * center +    // center
          tempData[rowOffset + nextCol + c] * edge +        // right
          tempData[nextRowOffset + colOffset + c] * edge;   // bottom

        pixels[rowOffset + colOffset + c] = Math.max(0, Math.min(255, sum));
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Release array back to pool
  if (usePool && pool) {
    pool.release(tempData);
  }
}





/**
 * Main video processing function using MediaBunny
 */
async function initRecording(
  file: Blob,
  outputHandle: any | null,
  width: number,
  height: number,
  keepAudio: boolean = true
): Promise<void> {

  // Network weights mapping for bulk processing
  const weightMap = {
    'large': {
      'rl': require('./weights/cnn-2x-l-rl.json'),
      'an': require('./weights/cnn-2x-l-an.json'),
      '3d': require('./weights/cnn-2x-l-3d.json'),
    },
    'medium': {
      'rl': require('./weights/cnn-2x-m-rl.json'),
      'an': require('./weights/cnn-2x-m-an.json'),
      '3d': require('./weights/cnn-2x-m-3d.json'),
    },
    'small': {
      'rl': require('./weights/cnn-2x-s-rl.json'),
      'an': require('./weights/cnn-2x-s-an.json'),
      '3d': require('./weights/cnn-2x-s-3d.json'),
    }
  };

  const networkNameMap = {
    'small': "anime4k/cnn-2x-s",
    'medium': "anime4k/cnn-2x-m",
    'large': "anime4k/cnn-2x-l",
  };

  // Network switching handled by UI via switchNetwork function


  // MediaBunny handles streaming from the blob for large files
  const source = new BlobSource(file);



  const input = new Input({
    formats: [MP4],
    source
  });

  // Get video track statistics
  const videoTrack = await input.getPrimaryVideoTrack();
  if (!videoTrack) {
    throw new Error("No video track found");
  }

  // Get audio track if available
  const audioTrack = await input.getPrimaryAudioTrack();
  if (audioTrack) {
    console.log('Audio track found - will be copied to output');
  } else {
    console.log('No audio track found in input video');
  }

  // CRITICAL: Update dimensions for the current video!
  // Use passed dimensions if available (from main thread), otherwise try to detect from track
  // @ts-ignore 
  const trackWidth = width || videoTrack.track_width || videoTrack.width || 0;
  // @ts-ignore
  const trackHeight = height || videoTrack.track_height || videoTrack.height || 0;

  console.log(`Video dimensions: ${trackWidth}x${trackHeight} (Provided: ${width}x${height})`);

  if (!trackWidth || !trackHeight) {
    throw new Error(`Unable to determine video dimensions. Track width: ${trackWidth}, height: ${trackHeight}`);
  }

  // Use the SAME dimension calculation as preview/init for consistency
  const dims = calculateFinalDimensions(trackWidth, trackHeight);

  console.log(`Processing dimensions:`);
  console.log(`  Input: ${trackWidth}x${trackHeight}`);
  console.log(`  Adjusted Input: ${dims.input.width}x${dims.input.height}`);
  console.log(`  AI Output (2x): ${dims.aiOutput.width}x${dims.aiOutput.height}`);
  console.log(`  Final Output: ${dims.final.width}x${dims.final.height} (scale: ${dims.additionalScale.toFixed(2)}x)`);

  // Set resolution and final dimensions using calculated values
  resolution = dims.input;
  finalDimensions = dims.final;

  // Resize internal AI canvas to AI output size (2x)
  if (internalAICanvas) {
    internalAICanvas.width = dims.aiOutput.width;
    internalAICanvas.height = dims.aiOutput.height;
  } else {
    internalAICanvas = new OffscreenCanvas(dims.aiOutput.width, dims.aiOutput.height);
  }

  // extract native framerate or default to 30
  // @ts-ignore - mediabunny types might be missing 'framerate' on track
  const fps = videoTrack.framerate || 30;
  console.log(`Input FPS: ${fps}`);


  let target: BufferTarget | StreamTarget;
  let writer: WritableStream | undefined;

  if (outputHandle) {
    writer = await outputHandle.createWritable();
    target = new StreamTarget(writer!);
  } else {
    target = new BufferTarget();
  }


  const output = new Output({
    format: new Mp4OutputFormat(),
    target: target,
  });

  // Always use H.264/AVC codec (most compatible)
  const selectedCodec = 'avc';
  console.log("Using H.264/AVC Codec for encoding");

  // Create a final output canvas for encoding (with minimum 1080p enforcement)
  const finalOutputCanvas = new OffscreenCanvas(finalDimensions.width, finalDimensions.height);
  const finalCtx = finalOutputCanvas.getContext('2d', {
    alpha: false,
    desynchronized: true,
    willReadFrequently: true  // Optimize for getImageData in sharpening
  });
  if (finalCtx) {
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
  }

  const videoSource = new CanvasSource(finalOutputCanvas, {
    codec: selectedCodec as any,
    bitrate: 15_000_000,
    keyFrameInterval: 60,
  });

  output.addVideoTrack(videoSource, { frameRate: fps });

  // Add audio track to output (passthrough with packet streaming)
  let audioPipeline: Promise<void> | null = null;

  if (audioTrack && keepAudio) {
    try {
      const codec = audioTrack.codec;
      if (!codec) {
        console.warn('Audio track has no codec information, skipping');
      } else {
        // Create audio source
        const audioSource = new EncodedAudioPacketSource(codec);
        output.addAudioTrack(audioSource);
        console.log(`Audio passthrough enabled (codec: ${codec})`);

        // Start audio packet pipeline (runs in parallel with video)
        audioPipeline = (async () => {
          const audioSink = new EncodedPacketSink(audioTrack);
          let firstPacket = true;
          let timestampOffset = 0;

          for await (const packet of audioSink.packets()) {
            try {
              // Normalize negative timestamps by offsetting
              if (firstPacket) {
                // If first packet has negative timestamp, calculate offset to make it 0
                if (packet.timestamp < 0) {
                  timestampOffset = -packet.timestamp;
                  console.log(`Audio has negative start timestamp ${packet.timestamp}s, applying offset: +${timestampOffset}s`);
                }
              }

              // Create normalized packet with adjusted timestamp
              const normalizedPacket = new EncodedPacket(
                packet.data,
                packet.type,
                packet.timestamp + timestampOffset,  // Apply offset
                packet.duration
              );

              // For first packet, include decoder config metadata
              if (firstPacket) {
                const decoderConfig = await audioTrack.getDecoderConfig();
                await audioSource.add(normalizedPacket, { decoderConfig: decoderConfig || undefined });
                firstPacket = false;
              } else {
                await audioSource.add(normalizedPacket);
              }
            } catch (e) {
              console.warn('Failed to add audio packet:', e);
              break;
            }
          }
          console.log('Audio pipeline finished');
        })();
      }
    } catch (e) {
      console.warn('Failed to setup audio passthrough:', e);
    }
  } else if (!keepAudio) {
    console.log('Audio passthrough disabled by user');
  }

  await output.start();





  const decodable = await videoTrack.canDecode();
  if (!decodable) {
    // TODO: Handle
  }



  const sink = new VideoSampleSink(videoTrack);


  const duration = await input.computeDuration();


  const start_time = performance.now();


  function reportProgress(sample: VideoSample) {

    const time_elapsed = performance.now() - start_time;
    const progress = Math.floor((sample.timestamp) / duration * 100);

    postMessage({ cmd: 'progress', data: progress })

    if (time_elapsed > 1000) {
      const processing_rate = ((sample.timestamp) / duration * 100) / time_elapsed;
      const eta = Math.round(((100 - progress) / processing_rate) / 1000);
      postMessage({ cmd: 'eta', data: prettyTime(eta) })

    } else {
      postMessage({ cmd: 'eta', data: 'calculating...' })
    }

  }



  // Loop over all frames
  for await (const sample of sink.samples()) {

    const videoFrame = sample.toVideoFrame();

    // Create bitmap for AI processing (adjusted resolution)
    const bitmap = await createImageBitmap(videoFrame, {
      resizeWidth: resolution.width,
      resizeHeight: resolution.height
    });

    // AI upscaling (2x) - renders to internalAICanvas (NOT visible on UI)
    websr.render(bitmap);

    // Apply post-AI scaling to reach minimum 1080p
    // Draw AI output from INTERNAL canvas (not the visible one)
    if (finalCtx) {
      finalCtx.drawImage(
        internalAICanvas, // Use internal canvas, not upscaled_canvas!
        0, 0, internalAICanvas.width, internalAICanvas.height,
        0, 0, finalDimensions.width, finalDimensions.height
      );

      // Apply light sharpening for enhanced detail
      applySharpen(finalCtx, finalOutputCanvas, 0.4);
    }

    // Add frame to output video
    videoSource.add(sample.timestamp, sample.duration);

    reportProgress(sample)


    videoFrame.close();
    sample.close();


  }

  // Wait for audio pipeline to finish
  if (audioPipeline) {
    console.log('Waiting for audio pipeline...');
    await audioPipeline;
  }

  await output.finalize();


  if (writer) {

    postMessage({ cmd: 'finished', data: null });

  } else {
    const buffer = (output.target as BufferTarget).buffer;
    if (buffer) {
        // @ts-ignore
        postMessage({ cmd: 'finished', data: buffer }, [buffer]);
    } else {
        postMessage({ cmd: 'finished', data: null });
    }
  }






}

/**
 * Format seconds into HH:MM:SS or MM:SS
 */
function prettyTime(secs: number): string {
  const sec_num = parseInt(secs.toString(), 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

/**
 * Worker message handler with type-safe message routing
 */
self.onmessage = async function (event: MessageEvent<WorkerRequestMessage>) {
  if (!event.data.cmd) return;

  try {
    switch (event.data.cmd) {
      case 'init':
        await init(event.data.data);
        break;

      case 'isSupported':
        await isSupported();
        break;

      case 'process':
        if (event.data.cmd === 'process') {
          // Get Blob from FileSystemFileHandle
          const file = await event.data.inputHandle.getFile();
          await initRecording(
            file,
            event.data.outputHandle,
            event.data.width || 0,
            event.data.height || 0,
            event.data.keepAudio ?? true
          );
        }
        break;

      case 'network':
        await switchNetwork(
          event.data.data.name,
          event.data.data.weights,
          event.data.data.bitmap
        );
        break;
    }
  } catch (error) {
    console.error('Worker error:', error);
    postMessage({
      cmd: 'error',
      data: error instanceof Error ? error.message : 'Unknown worker error'
    });
  }
};
