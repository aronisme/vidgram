"use client";

import { useState, useRef } from "react";
import { Upload, FileVideo, CheckCircle, Loader2, X, Sparkles, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { videoService } from "@/lib/videoService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface UploadItem {
    id: string;
    file: File;
    localThumbnail: string | null;
    title: string;
    description: string;
    language: string;
    status: 'pending' | 'generating' | 'uploading' | 'success' | 'error';
    errorMessage?: string;
}

export default function UploadPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();

    const [items, setItems] = useState<UploadItem[]>([]);
    const [globalLanguage, setGlobalLanguage] = useState("Indonesia");
    const [isUploadingAll, setIsUploadingAll] = useState(false);
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const generateThumbnail = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            const objectUrl = URL.createObjectURL(file);
            const videoElement = document.createElement("video");
            videoElement.src = objectUrl;
            videoElement.muted = true;
            videoElement.crossOrigin = "anonymous";

            videoElement.onloadeddata = () => {
                videoElement.currentTime = 1;
            };

            videoElement.onseeked = () => {
                const canvas = document.createElement("canvas");
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg", 0.7));
                } else {
                    resolve(null);
                }
                URL.revokeObjectURL(objectUrl);
            };

            videoElement.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(null);
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(f => {
            if (!f.type.startsWith("video/")) {
                addToast(`File ${f.name} bukan video. Dilewati.`, "error");
                return false;
            }
            if (f.size > 5 * 1024 * 1024) {
                addToast(`File ${f.name} lebih dari 5MB. Dilewati.`, "error");
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            const newItems: UploadItem[] = await Promise.all(
                validFiles.map(async (file) => {
                    const thumb = await generateThumbnail(file);
                    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

                    return {
                        id: Math.random().toString(36).substring(2, 9),
                        file,
                        localThumbnail: thumb,
                        title: fileNameWithoutExt,
                        description: "",
                        language: globalLanguage,
                        status: 'pending'
                    };
                })
            );

            setItems(prev => [...prev, ...newItems]);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const updateItem = (id: string, updates: Partial<UploadItem>) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const generateAIForItem = async (item: UploadItem) => {
        if (!item.localThumbnail) {
            addToast(`Video ${item.file.name} doesn't have a thumbnail.`, "info");
            return;
        }

        updateItem(item.id, { status: 'generating' });

        try {
            const res = await fetch("/api/generate-metadata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageBase64: item.localThumbnail,
                    filename: item.file.name,
                    language: item.language
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to contact AI.");

            updateItem(item.id, {
                title: data.title || item.title,
                description: data.description || item.description,
                status: 'pending'
            });
            addToast(`AI berhasil mengisi data untuk ${item.file.name}`, "success");
        } catch (error: any) {
            console.error("AI Error:", error);
            updateItem(item.id, { status: 'error', errorMessage: error.message });
            addToast(`AI failed for ${item.file.name}: ${error.message}`, "error");
        }
    };

    const handleGenerateAllAI = async () => {
        setIsGeneratingAll(true);
        const pendingItems = items.filter(item => item.status === 'pending');
        for (const item of pendingItems) {
            await generateAIForItem(item);
        }
        setIsGeneratingAll(false);
    };

    const uploadSingleItem = async (item: UploadItem) => {
        if (!item.title || !item.description) {
            updateItem(item.id, { status: 'error', errorMessage: 'Judul dan deskripsi wajib diisi.' });
            return;
        }

        updateItem(item.id, { status: 'uploading' });

        try {
            const uploadData = new FormData();
            uploadData.append("file", item.file);
            uploadData.append("upload_preset", uploadPreset!);

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
                { method: "POST", body: uploadData }
            );

            if (!cloudinaryRes.ok) {
                const errData = await cloudinaryRes.json();
                throw new Error(errData.error?.message || "Cloudinary upload failed");
            }

            const data = await cloudinaryRes.json();
            const slug = item.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

            await videoService.addVideo({
                title: item.title,
                description: item.description,
                cloudinaryId: data.public_id,
                videoUrl: data.secure_url,
                thumbnailUrl: data.secure_url.replace(/\.[^/.]+$/, ".jpg"),
                slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
                uploaderId: user!.uid,
            });

            updateItem(item.id, { status: 'success' });
        } catch (error: any) {
            console.error(error);
            updateItem(item.id, { status: 'error', errorMessage: error.message || 'Upload failed.' });
        }
    };

    const handleUploadAll = async () => {
        if (!cloudName || !uploadPreset || cloudName === "demo") {
            addToast("Setup Cloud Name & Upload Preset di .env.local dulu.", "error");
            return;
        }
        if (!user) {
            addToast("You must be signed in to upload videos.", "error");
            return;
        }

        const itemsToUpload = items.filter(i => i.status === 'pending' || i.status === 'error');
        if (itemsToUpload.length === 0) {
            addToast("Tidak ada video yang siap diupload.", "info");
            return;
        }

        setIsUploadingAll(true);
        for (const item of itemsToUpload) {
            await uploadSingleItem(item);
        }
        setIsUploadingAll(false);
        addToast("Proses upload selesai.", "info");
    };

    const allSuccess = items.length > 0 && items.every(i => i.status === 'success');

    if (allSuccess) {
        setTimeout(() => {
            router.push("/dashboard");
        }, 3000);
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Upload Video</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                    Select multiple videos, auto-fill data using AI, and upload!
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {allSuccess ? (
                    <div className="card" style={{
                        padding: '3rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                    }}>
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--success)',
                            padding: '1rem',
                            borderRadius: '50%',
                        }}>
                            <CheckCircle size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Semua Video Berhasil Diupload!</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Mengalihkan ke Dashboard dalam beberapa detik...</p>
                    </div>
                ) : (
                    <>
                        {/* Dropzone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="dropzone"
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                        >
                            <input
                                type="file"
                                accept="video/*"
                                multiple
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <div style={{
                                background: 'var(--accent-light)',
                                padding: '1rem',
                                borderRadius: '50%',
                            }}>
                                <Plus size={28} style={{ color: 'var(--accent)' }} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Tambah Video</p>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                    Select multiple files (MP4, MOV, etc) — max 5MB
                                </p>
                            </div>
                        </div>

                        {items.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>

                                {/* Sticky Action Bar */}
                                <div className="glass-strong" style={{
                                    padding: '0.875rem 1.25rem',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '0.75rem',
                                    position: 'sticky',
                                    top: 'calc(var(--navbar-height) + 0.5rem)',
                                    zIndex: 40,
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9375rem' }}>
                                        <FileVideo size={18} />
                                        {items.length} Video Terpilih
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                                        <select
                                            className="input-field"
                                            style={{ padding: '0.375rem 0.625rem', fontSize: '0.8125rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
                                            value={globalLanguage}
                                            onChange={(e) => {
                                                setGlobalLanguage(e.target.value);
                                                setItems(items.map(i => ({ ...i, language: e.target.value })));
                                            }}
                                        >
                                            <option value="Indonesia">Bahasa Indonesia</option>
                                            <option value="English">English</option>
                                            <option value="Japanese">日本語</option>
                                            <option value="Korean">한국어</option>
                                            <option value="Spanish">Español</option>
                                        </select>

                                        <button
                                            onClick={handleGenerateAllAI}
                                            disabled={isGeneratingAll || isUploadingAll}
                                            className="btn-secondary"
                                            style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}
                                        >
                                            {isGeneratingAll ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                            Autofill AI
                                        </button>

                                        <button
                                            onClick={handleUploadAll}
                                            disabled={isUploadingAll || isGeneratingAll}
                                            className="btn-primary"
                                            style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}
                                        >
                                            {isUploadingAll ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                            Upload Semua
                                        </button>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="stagger-children">
                                    {items.map((item) => (
                                        <div key={item.id} className="card" style={{
                                            padding: '1.25rem',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: '1.25rem',
                                            opacity: item.status === 'success' ? 0.5 : 1,
                                            pointerEvents: item.status === 'success' ? 'none' : 'auto',
                                            position: 'relative',
                                        }}>

                                            {/* Thumbnail */}
                                            <div style={{ width: '200px', flexShrink: 0, position: 'relative' }} className="group">
                                                <div style={{
                                                    width: '100%',
                                                    aspectRatio: '16/9',
                                                    background: '#000',
                                                    borderRadius: 'var(--radius-md)',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                }}>
                                                    {item.localThumbnail ? (
                                                        <img src={item.localThumbnail} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'rgba(255,255,255,0.5)',
                                                        }}>
                                                            <Loader2 size={20} className="animate-spin" />
                                                            <span style={{ fontSize: '0.6875rem', marginTop: '0.25rem' }}>Processing...</span>
                                                        </div>
                                                    )}

                                                    {item.status === 'uploading' && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            background: 'rgba(99, 102, 241, 0.6)',
                                                            backdropFilter: 'blur(4px)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                        }}>
                                                            <Loader2 size={24} className="animate-spin" />
                                                            <span style={{ fontWeight: 700, fontSize: '0.75rem', marginTop: '0.25rem' }}>Uploading</span>
                                                        </div>
                                                    )}
                                                    {item.status === 'success' && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            background: 'rgba(16, 185, 129, 0.6)',
                                                            backdropFilter: 'blur(4px)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                        }}>
                                                            <CheckCircle size={24} />
                                                            <span style={{ fontWeight: 700, fontSize: '0.75rem', marginTop: '0.25rem' }}>Success</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '0.6875rem',
                                                    color: 'var(--text-tertiary)',
                                                    marginTop: '0.375rem',
                                                }}>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>{item.file.name}</span>
                                                    <span>{(item.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                                                </div>

                                                {item.status !== 'uploading' && item.status !== 'success' && (
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-6px',
                                                            left: '-6px',
                                                            background: 'var(--error)',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            width: '24px',
                                                            height: '24px',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s ease',
                                                        }}
                                                        className="group-hover:!opacity-100"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Form */}
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <label style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Judul Video</label>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                        <select
                                                            className="input-field"
                                                            style={{ padding: '0.25rem 0.375rem', fontSize: '0.75rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
                                                            value={item.language}
                                                            onChange={(e) => updateItem(item.id, { language: e.target.value })}
                                                            disabled={item.status === 'uploading' || item.status === 'generating'}
                                                        >
                                                            <option value="Indonesia">ID</option>
                                                            <option value="English">EN</option>
                                                            <option value="Japanese">JP</option>
                                                            <option value="Korean">KR</option>
                                                            <option value="Spanish">ES</option>
                                                        </select>
                                                        <button
                                                            onClick={() => generateAIForItem(item)}
                                                            disabled={item.status === 'generating' || item.status === 'uploading'}
                                                            className="btn-ghost"
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                        >
                                                            {item.status === 'generating' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                            AI
                                                        </button>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    disabled={item.status === 'uploading' || item.status === 'success' || item.status === 'generating'}
                                                    placeholder="Contoh: Tutorial Masak Keren"
                                                    className="input-field"
                                                    style={{ fontSize: '0.875rem' }}
                                                    value={item.title}
                                                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                                />

                                                <label style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Deskripsi</label>
                                                <textarea
                                                    disabled={item.status === 'uploading' || item.status === 'success' || item.status === 'generating'}
                                                    placeholder="Jelaskan tentang video ini..."
                                                    rows={3}
                                                    className="input-field"
                                                    style={{ fontSize: '0.875rem', resize: 'none' }}
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                                />

                                                {item.status === 'error' && (
                                                    <p style={{ color: 'var(--error)', fontSize: '0.75rem', fontWeight: 600 }}>{item.errorMessage}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
