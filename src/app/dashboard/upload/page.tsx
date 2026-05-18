"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileVideo, Image as ImageIcon, CheckCircle, Loader2, X, Sparkles, Plus, Link as LinkIcon, Lock, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { videoService } from "@/lib/videoService";
import { imageService } from "@/lib/imageService";
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
    const { user, loading } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    // --- TAB STATE ---
    const [uploadType, setUploadType] = useState<'video' | 'image'>('video');

    // --- VIDEO STATE ---
    const [items, setItems] = useState<UploadItem[]>([]);
    const [globalLanguage, setGlobalLanguage] = useState("Indonesia");
    const [isUploadingAll, setIsUploadingAll] = useState(false);
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    // --- IMAGE STATE ---
    const [imageFiles, setImageFiles] = useState<{ id: string, file: File, preview: string }[]>([]);
    const [imageTitle, setImageTitle] = useState("");
    const [imageDescription, setImageDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isUploadingImagePost, setIsUploadingImagePost] = useState(false);
    const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
    const [imageLanguage, setImageLanguage] = useState("Indonesia");
    const [isGeneratingImageAI, setIsGeneratingImageAI] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const imgCloudName = process.env.NEXT_PUBLIC_IMG_CLOUDINARY_CLOUD_NAME;
    const imgUploadPreset = process.env.NEXT_PUBLIC_IMG_CLOUDINARY_UPLOAD_PRESET;

    // ==========================================
    //            VIDEO LOGIC
    // ==========================================
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

    const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                        status: 'pending' as const
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

    const allVideoSuccess = items.length > 0 && items.every(i => i.status === 'success');

    if (allVideoSuccess && uploadType === 'video') {
        setTimeout(() => {
            router.push("/dashboard");
        }, 3000);
    }

    // ==========================================
    //            IMAGE LOGIC
    // ==========================================

    const compressImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxSize = 640;
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.7)); // compress kualitas 70%
                } else {
                    resolve("");
                }
                URL.revokeObjectURL(objectUrl);
            };
            img.onerror = reject;
            img.src = objectUrl;
        });
    };

    const generateAIForSpecificImage = async (id: string) => {
        const targetImg = imageFiles.find(i => i.id === id);
        if (!targetImg) return;

        setIsGeneratingImageAI(true);
        try {
            // Kompresi sebelum diubah ke base64 agar payload tidak membengkak
            const base64Img = await compressImageToBase64(targetImg.file);

            const res = await fetch("/api/generate-metadata", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageBase64: base64Img,
                    filename: targetImg.file.name,
                    language: imageLanguage
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal menghubungi AI.");

            setImageTitle(data.title || imageTitle);
            setImageDescription(data.description || imageDescription);
            addToast(`AI berhasil menganalisis gambar!`, "success");
        } catch (error: any) {
            console.error("AI Error:", error);
            addToast(`AI failed: ${error.message}`, "error");
        } finally {
            setIsGeneratingImageAI(false);
        }
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        const validFiles = newFiles.filter(f => {
            if (!f.type.startsWith("image/")) {
                addToast(`File ${f.name} bukan gambar. Dilewati.`, "error");
                return false;
            }
            if (f.size > 10 * 1024 * 1024) {
                addToast(`File ${f.name} lebih dari 10MB. Dilewati.`, "error");
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            const mappedFiles = validFiles.map(file => ({
                id: Math.random().toString(36).substring(2, 9),
                file,
                preview: URL.createObjectURL(file)
            }));
            setImageFiles(prev => [...prev, ...mappedFiles]);
        }

        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const removeImageFile = (id: string) => {
        setImageFiles(prev => {
            const item = prev.find(i => i.id === id);
            if (item) URL.revokeObjectURL(item.preview);
            return prev.filter(i => i.id !== id);
        });
    };

    const handleUploadImagePost = async () => {
        if (!imgCloudName || !imgUploadPreset) {
            addToast("Setup Image Cloud Name & Upload Preset di .env.local dulu.", "error");
            return;
        }
        if (!user) {
            addToast("You must be signed in to upload.", "error");
            return;
        }
        if (imageFiles.length === 0) {
            addToast("Pilih setidaknya 1 gambar.", "error");
            return;
        }
        if (!imageTitle || !imageDescription) {
            addToast("Judul dan deskripsi wajib diisi.", "error");
            return;
        }

        setIsUploadingImagePost(true);
        try {
            const uploadedImages: { url: string; cloudinaryId: string }[] = [];

            // Upload all images sequentially
            for (const img of imageFiles) {
                const formData = new FormData();
                formData.append("file", img.file);
                formData.append("upload_preset", imgUploadPreset);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${imgCloudName}/image/upload`, {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error?.message || "Failed to upload image.");
                }

                const data = await res.json();
                uploadedImages.push({
                    url: data.secure_url,
                    cloudinaryId: data.public_id
                });
            }

            // Save to Firestore
            const slug = imageTitle.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            await imageService.addImagePost({
                title: imageTitle,
                description: imageDescription,
                images: uploadedImages,
                isPrivate: isPrivate,
                slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
                uploaderId: user.uid,
            });

            setImageUploadSuccess(true);
            addToast("Postingan gambar berhasil diupload!", "success");
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);

        } catch (error: any) {
            console.error(error);
            addToast(error.message || "Upload gagal.", "error");
        } finally {
            setIsUploadingImagePost(false);
        }
    };


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '4rem' }}>
            
            {/* Header & Mode Toggle */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Create Post</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                            Upload video content or image galleries.
                        </p>
                    </div>
                    {uploadType === 'video' && (
                        <button
                            onClick={() => router.push("/dashboard/upload-link")}
                            className="btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <LinkIcon size={18} />
                            Upload Video Link
                        </button>
                    )}
                </div>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: 'var(--radius-lg)', width: 'fit-content' }}>
                    <button
                        onClick={() => setUploadType('video')}
                        style={{
                            padding: '0.625rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: uploadType === 'video' ? 'var(--bg-primary)' : 'transparent',
                            color: uploadType === 'video' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            boxShadow: uploadType === 'video' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FileVideo size={18} />
                        Video
                    </button>
                    <button
                        onClick={() => setUploadType('image')}
                        style={{
                            padding: '0.625rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: uploadType === 'image' ? 'var(--bg-primary)' : 'transparent',
                            color: uploadType === 'image' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            boxShadow: uploadType === 'image' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ImageIcon size={18} />
                        Image Gallery
                    </button>
                </div>
            </div>

            {/* ============================== */}
            {/*          VIDEO MODE            */}
            {/* ============================== */}
            {uploadType === 'video' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
                    {allVideoSuccess ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '50%' }}>
                                <CheckCircle size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Semua Video Berhasil Diupload!</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Mengalihkan ke Dashboard dalam beberapa detik...</p>
                        </div>
                    ) : (
                        <>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="dropzone"
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                            >
                                <input type="file" accept="video/*" multiple style={{ display: 'none' }} ref={fileInputRef} onChange={handleVideoFileChange} />
                                <div style={{ background: 'var(--accent-light)', padding: '1rem', borderRadius: '50%' }}>
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
                                    {/* Video Actions Sticky */}
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
                                                <div style={{ width: '200px', flexShrink: 0, position: 'relative' }} className="group">
                                                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                                                        {item.localThumbnail ? (
                                                            <img src={item.localThumbnail} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                                                <Loader2 size={20} className="animate-spin" />
                                                                <span style={{ fontSize: '0.6875rem', marginTop: '0.25rem' }}>Processing...</span>
                                                            </div>
                                                        )}
                                                        {item.status === 'uploading' && (
                                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(99, 102, 241, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                                <Loader2 size={24} className="animate-spin" />
                                                                <span style={{ fontWeight: 700, fontSize: '0.75rem', marginTop: '0.25rem' }}>Uploading</span>
                                                            </div>
                                                        )}
                                                        {item.status === 'success' && (
                                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                                <CheckCircle size={24} />
                                                                <span style={{ fontWeight: 700, fontSize: '0.75rem', marginTop: '0.25rem' }}>Success</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.375rem' }}>
                                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>{item.file.name}</span>
                                                        <span>{(item.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                                                    </div>
                                                    {item.status !== 'uploading' && item.status !== 'success' && (
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            style={{ position: 'absolute', top: '-6px', left: '-6px', background: 'var(--error)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease' }}
                                                            className="group-hover:!opacity-100"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>

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
            )}

            {/* ============================== */}
            {/*          IMAGE MODE            */}
            {/* ============================== */}
            {uploadType === 'image' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
                    {imageUploadSuccess ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '50%' }}>
                                <CheckCircle size={40} />
                            </div>
                            <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Postingan Gambar Berhasil Diupload!</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Mengalihkan ke Dashboard dalam beberapa detik...</p>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            
                            {/* Dropzone & Preview */}
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'block', marginBottom: '0.75rem' }}>Foto / Gambar</label>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                                    {/* Existing Images */}
                                    {imageFiles.map((img) => (
                                        <div key={img.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }} className="group">
                                            <img src={img.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            
                                            {/* AI Autofill Button */}
                                            <button
                                                onClick={(e) => { e.preventDefault(); generateAIForSpecificImage(img.id); }}
                                                disabled={isGeneratingImageAI}
                                                style={{ position: 'absolute', top: '0.25rem', left: '0.25rem', background: 'rgba(99,102,241,0.9)', color: 'white', borderRadius: '4px', padding: '0.25rem 0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', fontWeight: 600, opacity: 0, transition: 'opacity 0.2s', backdropFilter: 'blur(4px)' }}
                                                className="group-hover:!opacity-100 hover:!bg-indigo-600"
                                                title="Gunakan gambar ini untuk referensi AI"
                                            >
                                                {isGeneratingImageAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => removeImageFile(img.id)}
                                                style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', padding: '0.25rem', border: 'none', cursor: 'pointer', display: 'flex', opacity: 0, transition: 'opacity 0.2s' }}
                                                className="group-hover:!opacity-100 hover:!bg-red-500"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Button */}
                                    <div
                                        onClick={() => imageInputRef.current?.click()}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: 'var(--radius-md)',
                                            border: '2px dashed var(--border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            background: 'var(--bg-secondary)',
                                            color: 'var(--text-secondary)',
                                            transition: 'all 0.2s'
                                        }}
                                        className="hover:border-indigo-500 hover:text-indigo-500"
                                    >
                                        <input type="file" accept="image/*" multiple style={{ display: 'none' }} ref={imageInputRef} onChange={handleImageFileChange} />
                                        <Plus size={24} />
                                        <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 500 }}>Tambah</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details Form */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'block' }}>Judul Postingan</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Bahasa AI:</span>
                                            <select
                                                className="input-field"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
                                                value={imageLanguage}
                                                onChange={(e) => setImageLanguage(e.target.value)}
                                                disabled={isUploadingImagePost || isGeneratingImageAI}
                                            >
                                                <option value="Indonesia">ID</option>
                                                <option value="English">EN</option>
                                                <option value="Japanese">JP</option>
                                                <option value="Korean">KR</option>
                                                <option value="Spanish">ES</option>
                                            </select>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Tulis judul menarik untuk galeri ini..."
                                        className="input-field"
                                        value={imageTitle}
                                        onChange={(e) => setImageTitle(e.target.value)}
                                        disabled={isUploadingImagePost || isGeneratingImageAI}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'block', marginBottom: '0.5rem' }}>Deskripsi</label>
                                    <textarea
                                        placeholder="Ceritakan tentang foto-foto ini..."
                                        rows={4}
                                        className="input-field"
                                        style={{ resize: 'none' }}
                                        value={imageDescription}
                                        onChange={(e) => setImageDescription(e.target.value)}
                                        disabled={isUploadingImagePost || isGeneratingImageAI}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        onClick={() => setIsPrivate(false)}
                                        style={{
                                            flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid',
                                            borderColor: !isPrivate ? 'var(--accent)' : 'var(--border)',
                                            background: !isPrivate ? 'var(--accent-light)' : 'transparent',
                                            color: !isPrivate ? 'var(--accent)' : 'var(--text-secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >
                                        <Globe size={18} /> Public
                                    </button>
                                    <button
                                        onClick={() => setIsPrivate(true)}
                                        style={{
                                            flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid',
                                            borderColor: isPrivate ? 'var(--accent)' : 'var(--border)',
                                            background: isPrivate ? 'var(--accent-light)' : 'transparent',
                                            color: isPrivate ? 'var(--accent)' : 'var(--text-secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                    >
                                        <Lock size={18} /> Private
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={handleUploadImagePost}
                                    disabled={isUploadingImagePost || imageFiles.length === 0}
                                    className="btn-primary"
                                    style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem' }}
                                >
                                    {isUploadingImagePost ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} />
                                            Posting Album
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
