"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileVideo, CheckCircle, Loader2, Play, Download, AlertCircle, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

type ProcessingState = 'init' | 'loading' | 'preview' | 'processing' | 'complete' | 'error';

export default function NativeUpscalerPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const [state, setState] = useState<ProcessingState>('init');
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [downloadName, setDownloadName] = useState("upscaled.mp4");

    const [networkSize, setNetworkSize] = useState<'small'|'medium'|'large'>('large');
    const [contentStyle, setContentStyle] = useState<'rl'|'an'|'3d'>('rl');
    const [keepAudio, setKeepAudio] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const originalCanvasRef = useRef<HTMLCanvasElement>(null);
    const upscaledCanvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const fileHandleRef = useRef<any>(null); // FileSystemFileHandle

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        // Initialize worker
        if (typeof window !== "undefined" && !workerRef.current) {
            workerRef.current = new Worker(new URL('@/lib/upscaler/worker.ts', import.meta.url));
            workerRef.current.onmessage = handleWorkerMessage;
            workerRef.current.postMessage({ cmd: 'isSupported' });
        }
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    const handleWorkerMessage = (e: MessageEvent) => {
        const { cmd, data } = e.data;
        switch (cmd) {
            case 'isSupported':
                if (!data) {
                    setState('error');
                    setErrorMsg("Browser Anda tidak mendukung WebGPU yang dibutuhkan untuk AI Upscaler.");
                }
                break;
            case 'progress':
                setProgress(data);
                if (state !== 'processing') setState('processing');
                break;
            case 'eta':
                setEta(data);
                break;
            case 'finished':
                setState('complete');
                if (data instanceof ArrayBuffer) {
                    const blob = new Blob([data], { type: "video/mp4" });
                    setDownloadUrl(URL.createObjectURL(blob));
                }
                break;
            case 'error':
                setState('error');
                setErrorMsg(data);
                addToast("Error memproses video: " + data, "error");
                break;
        }
    };

    const handleFileSelect = async () => {
        try {
            // @ts-ignore
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{ description: 'Video Files', accept: { 'video/mp4': ['.mp4'] } }],
                multiple: false
            });
            fileHandleRef.current = fileHandle;
            const file = await fileHandle.getFile();
            
            setState('loading');
            
            const arrayBuffer = await file.arrayBuffer();
            const fileBlob = new Blob([arrayBuffer], { type: "video/mp4" });
            
            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(fileBlob);
                videoRef.current.onloadeddata = async () => {
                    setupPreview(videoRef.current!, file.name);
                };
            }
        } catch (e: any) {
            if (e.name !== 'AbortError') {
                addToast("Gagal membuka file: " + e.message, "error");
            }
        }
    };

    const setupPreview = async (video: HTMLVideoElement, originalFilename: string) => {
        if (!originalCanvasRef.current || !upscaledCanvasRef.current || !workerRef.current) return;
        
        const outputWidth = video.videoWidth * 2;
        const outputHeight = video.videoHeight * 2;
        setDownloadName(originalFilename.split(".")[0] + `_${outputWidth}x${outputHeight}-upscaled.mp4`);

        upscaledCanvasRef.current.width = outputWidth;
        upscaledCanvasRef.current.height = outputHeight;
        originalCanvasRef.current.width = outputWidth;
        originalCanvasRef.current.height = outputHeight;

        video.currentTime = video.duration * 0.2 || 0;

        // Wait a bit for seek
        setTimeout(async () => {
            try {
                const bitmap = await createImageBitmap(video);
                const upscaled = upscaledCanvasRef.current!.transferControlToOffscreen();
                const original = originalCanvasRef.current!.transferControlToOffscreen();

                workerRef.current!.postMessage({
                    cmd: "init", 
                    data: {
                        bitmap,
                        upscaled,
                        original,
                        resolution: { width: video.videoWidth, height: video.videoHeight }
                    }
                }, [bitmap, upscaled, original]);

                setState('preview');
                
                // Initialize default network
                updateNetwork(bitmap);
            } catch (err) {
                console.error("Preview setup error:", err);
                addToast("Gagal menyiapkan preview.", "error");
            }
        }, 500);
    };

    const updateNetwork = async (bitmap?: ImageBitmap) => {
        if (!workerRef.current || !videoRef.current) return;
        try {
            const bmp = bitmap || await createImageBitmap(videoRef.current);
            const networks: any = { 'small': "anime4k/cnn-2x-s", 'medium': "anime4k/cnn-2x-m", 'large': "anime4k/cnn-2x-l" };
            
            const weightMap: any = {
                'small': {
                    'rl': require('@/lib/upscaler/weights/cnn-2x-s-rl.json'),
                    'an': require('@/lib/upscaler/weights/cnn-2x-s-an.json'),
                    '3d': require('@/lib/upscaler/weights/cnn-2x-s-3d.json')
                },
                'medium': {
                    'rl': require('@/lib/upscaler/weights/cnn-2x-m-rl.json'),
                    'an': require('@/lib/upscaler/weights/cnn-2x-m-an.json'),
                    '3d': require('@/lib/upscaler/weights/cnn-2x-m-3d.json')
                },
                'large': {
                    'rl': require('@/lib/upscaler/weights/cnn-2x-l-rl.json'),
                    'an': require('@/lib/upscaler/weights/cnn-2x-l-an.json'),
                    '3d': require('@/lib/upscaler/weights/cnn-2x-l-3d.json')
                }
            };

            const weights = weightMap[networkSize][contentStyle];
            
            workerRef.current.postMessage({
                cmd: 'network',
                data: {
                    name: networks[networkSize],
                    bitmap: bmp,
                    weights: weights
                }
            });
        } catch (e) {
            console.error("Network switch error:", e);
        }
    };

    const startProcessing = async () => {
        if (!workerRef.current || !fileHandleRef.current || !videoRef.current) return;
        setState('processing');
        setProgress(0);
        
        try {
            workerRef.current.postMessage({
                cmd: 'process',
                inputHandle: fileHandleRef.current,
                outputHandle: null, // will use memory buffer
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
                keepAudio
            });
        } catch (e: any) {
            setState('error');
            setErrorMsg(e.message);
        }
    };

    const handleNetworkChange = (size: 'small'|'medium'|'large') => {
        setNetworkSize(size);
        setTimeout(() => updateNetwork(), 100);
    };

    const handleStyleChange = (style: 'rl'|'an'|'3d') => {
        setContentStyle(style);
        setTimeout(() => updateNetwork(), 100);
    };

    if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}><div className="spinner"></div></div>;
    if (!user) return null;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    AI Video Upscaler (Native)
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Tingkatkan resolusi video menggunakan kekuatan WebGPU langsung di browser.
                </p>
            </div>

            {state === 'init' && (
                <div className="card" style={{ padding: '4rem', textAlign: 'center', cursor: 'pointer', border: '2px dashed var(--border)' }} onClick={handleFileSelect}>
                    <Upload size={48} style={{ margin: '0 auto', color: 'var(--accent)' }} />
                    <h3 style={{ marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Pilih Video (.mp4)</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Video akan diproses secara lokal 100% tanpa upload.</p>
                </div>
            )}

            {state === 'loading' && (
                <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto', color: 'var(--accent)' }} />
                    <h3 style={{ marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Menyiapkan AI Engine...</h3>
                </div>
            )}

            {(state === 'preview' || state === 'processing' || state === 'complete') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card" style={{ padding: '1rem', background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', gap: '1px', background: '#333' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12, zIndex: 10 }}>Original</div>
                                    <canvas ref={originalCanvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(99,102,241,0.8)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12, zIndex: 10 }}>AI Upscaled (2x)</div>
                                    <canvas ref={upscaledCanvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                            </div>
                        </div>

                        {state === 'processing' && (
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>Sedang Memproses...</span>
                                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{progress}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.3s ease' }}></div>
                                </div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                                    Estimasi waktu: {eta}
                                </div>
                            </div>
                        )}

                        {state === 'complete' && downloadUrl && (
                            <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)' }}>
                                <CheckCircle size={40} style={{ margin: '0 auto', color: 'var(--success)' }} />
                                <h3 style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>Selesai!</h3>
                                <a href={downloadUrl} download={downloadName} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', textDecoration: 'none' }}>
                                    <Download size={18} /> Simpan Video
                                </a>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={18} /> Pengaturan</h3>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Kualitas / Kecepatan</label>
                                <select className="input-field" value={networkSize} onChange={(e) => handleNetworkChange(e.target.value as any)} disabled={state !== 'preview'} style={{ width: '100%' }}>
                                    <option value="small">Cepat (Preview)</option>
                                    <option value="medium">Seimbang (Rekomendasi)</option>
                                    <option value="large">Kualitas Terbaik (Lambat)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Gaya Visual</label>
                                <select className="input-field" value={contentStyle} onChange={(e) => handleStyleChange(e.target.value as any)} disabled={state !== 'preview'} style={{ width: '100%' }}>
                                    <option value="rl">Real Life (Kamera Asli)</option>
                                    <option value="an">Anime / Kartun</option>
                                    <option value="3d">3D Animation (CGI)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="keepAudio" checked={keepAudio} onChange={(e) => setKeepAudio(e.target.checked)} disabled={state !== 'preview'} />
                                <label htmlFor="keepAudio" style={{ fontSize: '0.875rem' }}>Pertahankan Audio Asli</label>
                            </div>

                            {state === 'preview' && (
                                <button onClick={startProcessing} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem' }}>
                                    <Play size={18} /> Mulai Upscale
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {state === 'error' && (
                <div className="card" style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                        <AlertCircle size={24} /> Terjadi Kesalahan
                    </div>
                    <p>{errorMsg}</p>
                    <button onClick={() => setState('init')} className="btn-secondary" style={{ marginTop: '1rem' }}>Coba Lagi</button>
                </div>
            )}

            {/* Hidden video element for preview sourcing */}
            <video ref={videoRef} style={{ display: 'none' }} muted playsInline />
        </div>
    );
}
