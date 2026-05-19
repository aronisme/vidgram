"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileVideo, CheckCircle, Loader2, Play, Download, AlertCircle, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

type ProcessingState = 'init' | 'loading' | 'preview' | 'processing' | 'complete' | 'error';

export default function NativeUpscalerPage() {
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
    const [targetQuality, setTargetQuality] = useState<'2k'|'4k'>('2k');
    const [removeAudio, setRemoveAudio] = useState(false);
    const [hardwareWarning, setHardwareWarning] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const originalCanvasRef = useRef<HTMLCanvasElement>(null);
    const upscaledCanvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const fileRef = useRef<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);



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
                if (data && typeof data === 'object') {
                    if (!data.supported) {
                        console.warn("WebGPU not fully supported, relying on fallback.");
                        setHardwareWarning("WebGPU tidak terdeteksi. Upscaler mungkin berjalan lebih lambat (Mode Kompatibilitas).");
                    } else if (data.hardwareProfile) {
                        const profile = data.hardwareProfile;
                        if (profile.cpu.estimatedSpeed === 'slow' || profile.memory.tier === 'low') {
                            setHardwareWarning("Sistem Anda mungkin lambat memproses 4K. Resolusi 2K direkomendasikan.");
                        }
                    }
                } else if (!data) {
                    console.warn("WebGPU not fully supported, relying on fallback.");
                    setHardwareWarning("WebGPU tidak terdeteksi. Upscaler mungkin berjalan lebih lambat (Mode Kompatibilitas).");
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

    const handleFileSelectClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            fileRef.current = file;
            setState('loading');
            
            const arrayBuffer = await file.arrayBuffer();
            const fileBlob = new Blob([arrayBuffer], { type: "video/mp4" });
            
            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(fileBlob);
                videoRef.current.onloadeddata = async () => {
                    setupPreview(videoRef.current!, file.name);
                };
            }
        } catch (error: any) {
            addToast("Gagal membuka file: " + error.message, "error");
        }
    };

    const setupPreview = async (video: HTMLVideoElement, originalFilename: string) => {
        if (!originalCanvasRef.current || !upscaledCanvasRef.current || !workerRef.current) return;
        
        const outputWidth = video.videoWidth * 2;
        const outputHeight = video.videoHeight * 2;
        const qualityLabel = targetQuality.toUpperCase();
        setDownloadName(originalFilename.split(".")[0] + `_${qualityLabel}-upscaled.mp4`);

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
                updateNetwork();
            } catch (err) {
                console.error("Preview setup error:", err);
                addToast("Gagal menyiapkan preview.", "error");
            }
        }, 500);
    };

    const updateNetwork = async () => {
        if (!workerRef.current || !videoRef.current) return;
        try {
            const bmp = await createImageBitmap(videoRef.current);
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
            }, [bmp]);
        } catch (e) {
            console.error("Network switch error:", e);
        }
    };

    const startProcessing = async () => {
        if (!workerRef.current || !fileRef.current || !videoRef.current) return;
        setState('processing');
        setProgress(0);
        
        try {
            workerRef.current.postMessage({
                cmd: 'process',
                file: fileRef.current,
                outputHandle: null, // will use memory buffer
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
                targetQuality,
                keepAudio: !removeAudio,
                networkSize,
                contentType: contentStyle
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

    const handleQualityChange = (quality: '2k'|'4k') => {
        setTargetQuality(quality);
        if (fileRef.current) {
            const qualityLabel = quality.toUpperCase();
            setDownloadName(fileRef.current.name.split(".")[0] + `_${qualityLabel}-upscaled.mp4`);
        }
    };

    const handleDownloadClick = () => {
        if (isDownloading) return;
        setIsDownloading(true);
        // Reset loading state after 3 seconds (enough time for browser to start download)
        setTimeout(() => setIsDownloading(false), 3000);
    };


    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    AI Video Upscaler Gratis & Lokal
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto 0', lineHeight: 1.6 }}>
                    Perjelas video buram dan tingkatkan resolusi klip pendek hingga 4K. Proses 100% lokal di browser dengan WebGPU tanpa upload, sehingga sangat hemat kuota, waktu, dan aman. Sangat ringan berjalan di PC/laptop spek pas-pasan!
                </p>
            </div>

            {state === 'init' && (
                <div className="card" style={{ padding: '4rem', textAlign: 'center', cursor: 'pointer', border: '2px dashed var(--border)' }} onClick={handleFileSelectClick}>
                    <Upload size={48} style={{ margin: '0 auto', color: 'var(--accent)' }} />
                    <h3 style={{ marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Pilih Klip Video (.mp4)</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Pilih video durasi pendek. Diproses 100% secara lokal tanpa upload!</p>
                </div>
            )}

            {state === 'loading' && (
                <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <Loader2 size={48} className="animate-spin" style={{ margin: '0 auto', color: 'var(--accent)' }} />
                    <h3 style={{ marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Menyiapkan AI Engine...</h3>
                </div>
            )}

            {(state === 'loading' || state === 'preview' || state === 'processing' || state === 'complete') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card" style={{ padding: '1rem', background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: state === 'loading' ? 'none' : 'block' }}>
                            <div style={{ display: 'flex', gap: '1px', background: '#333' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12, zIndex: 10 }}>Original</div>
                                    <canvas ref={originalCanvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(99,102,241,0.8)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12, zIndex: 10 }}>AI Upscaled ({targetQuality.toUpperCase()})</div>
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
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                    <a href={downloadUrl} download={downloadName} onClick={handleDownloadClick} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', opacity: isDownloading ? 0.7 : 1, pointerEvents: isDownloading ? 'none' : 'auto' }}>
                                        {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                        {isDownloading ? 'Menyimpan...' : 'Simpan Video'}
                                    </a>
                                    <button onClick={() => { setState('init'); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Upload size={18} /> Upscale Video Lain
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: state === 'loading' ? 'none' : 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Target Resolusi</label>
                                <select className="input-field" value={targetQuality} onChange={(e) => handleQualityChange(e.target.value as any)} disabled={state !== 'preview'} style={{ width: '100%' }}>
                                    <option value="2k">2K (2560×1440)</option>
                                    <option value="4k">4K (3840×2160)</option>
                                </select>
                                {hardwareWarning && targetQuality === '4k' && (
                                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: 'var(--radius-md)', color: '#eab308', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                                        <span>{hardwareWarning}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="removeAudio" checked={removeAudio} onChange={(e) => setRemoveAudio(e.target.checked)} disabled={state !== 'preview'} />
                                <label htmlFor="removeAudio" style={{ fontSize: '0.875rem' }}>Hapus Audio</label>
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

            {/* SEO Content Section */}
            <div className="animate-fade-in" style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '3rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
                <section>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Mengapa Memilih AI Video Upscaler Lokal?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--success)' }}>✅ 100% Privasi Terjamin (Tanpa Upload)</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>Berbeda dengan layanan cloud upscaling, video Anda tidak pernah dikirim ke server. Pemrosesan dilakukan murni di dalam browser Anda menggunakan teknologi WebGPU.</p>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--success)' }}>✅ Hemat Kuota & Kecepatan Instan</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>Tanpa perlu mengunggah file gigabyte ke internet lalu mengunduhnya kembali. Anda menghemat 100% kuota data dan waktu tunggu transfer file.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Persyaratan Sistem (Hardware Requirements)</h2>
                    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-tertiary)' }}>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Spesifikasi</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Minimum (Laptop Spek Pas-pasan)</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Rekomendasi (Untuk 4K)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Browser</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Chrome 113+, Edge 113+</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Chrome Versi Terbaru</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>GPU (Kartu Grafis)</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Intel HD / AMD Radeon terintegrasi</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>NVIDIA RTX atau AMD Radeon RX</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>RAM</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>8 GB</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>16 GB ke atas</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Durasi Ideal</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Klip pendek (&lt; 30 detik)</td>
                                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Video panjang (&gt; 1 menit)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Hidden inputs for functionality */}
            <input 
                type="file" 
                accept="video/mp4" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
            />
            <video ref={videoRef} style={{ display: 'none' }} muted playsInline />
        </div>
    );
}
