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

    // Async thumbnail generator
    const generateThumbnail = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            const objectUrl = URL.createObjectURL(file);
            const videoElement = document.createElement("video");
            videoElement.src = objectUrl;
            videoElement.muted = true;
            videoElement.crossOrigin = "anonymous";

            videoElement.onloadeddata = () => {
                videoElement.currentTime = 1; // seek to 1 second
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
                addToast(`File ${f.name} lebih dari 5MB. Maksimal ukuran adalah 5MB untuk menghemat bandwidth. Dilewati.`, "error");
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            // Read thumbnails and create initial items
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

        // reset input
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
            addToast(`Video ${item.file.name} belum memiliki thumbnail.`, "info");
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
            if (!res.ok) throw new Error(data.error || "Gagal menghubungi AI.");

            updateItem(item.id, {
                title: data.title || item.title,
                description: data.description || item.description,
                status: 'pending'
            });
            addToast(`AI berhasil mengisi data untuk ${item.file.name}`, "success");
        } catch (error: any) {
            console.error("AI Error:", error);
            updateItem(item.id, { status: 'error', errorMessage: error.message });
            addToast(`AI gagal untuk ${item.file.name}: ${error.message}`, "error");
        }
    };

    const handleGenerateAllAI = async () => {
        setIsGeneratingAll(true);
        const pendingItems = items.filter(item => item.status === 'pending');

        // We do it sequentially
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
            updateItem(item.id, { status: 'error', errorMessage: error.message || 'Upload gagal.' });
        }
    };

    const handleUploadAll = async () => {
        if (!cloudName || !uploadPreset || cloudName === "demo") {
            addToast("Setup Cloud Name & Upload Preset di .env.local dulu.", "error");
            return;
        }
        if (!user) {
            addToast("Anda harus login untuk mengupload video.", "error");
            return;
        }

        const itemsToUpload = items.filter(i => i.status === 'pending' || i.status === 'error');
        if (itemsToUpload.length === 0) {
            addToast("Tidak ada video yang siap diupload.", "info");
            return;
        }

        setIsUploadingAll(true);

        // Upload sequentially to avoid network overwhelming
        for (const item of itemsToUpload) {
            await uploadSingleItem(item);
        }

        setIsUploadingAll(false);
        addToast("Proses upload selesai.", "info");

        // Timeout check if all are success
        setTimeout(() => {
            // React state closure issue inside timeout, but we rely on rendering "allSuccess" 
        }, 1000);
    };

    // Derived state
    const allSuccess = items.length > 0 && items.every(i => i.status === 'success');

    if (allSuccess) {
        setTimeout(() => {
            router.push("/dashboard");
        }, 3000);
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold">Upload Video Batch</h1>
                <p className="text-[var(--text-secondary)]">Pilih banyak video sekaligus, isi data otomatis dengan AI, lalu upload!</p>
            </div>

            <div className="flex flex-col gap-6">
                {allSuccess ? (
                    <div className="glass p-12 rounded-[var(--radius-lg)] text-center flex flex-col items-center gap-4">
                        <div className="bg-green-100 text-green-600 p-4 rounded-full">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-bold">Semua Video Berhasil Diupload!</h2>
                        <p className="text-[var(--text-secondary)]">Mengalihkan ke Dashboard dalam beberapa detik...</p>
                    </div>
                ) : (
                    <>
                        {/* File Selection Dropzone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius-lg)] p-8 text-center flex flex-col items-center gap-4 hover:border-[var(--accent)] transition-colors cursor-pointer bg-[var(--bg-secondary)]"
                        >
                            <input
                                type="file"
                                accept="video/*"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <div className="bg-[var(--accent)]/10 p-4 rounded-full">
                                <Plus size={32} className="text-[var(--accent)]" />
                            </div>
                            <div className="flex flex-col gap-1 items-center">
                                <p className="font-semibold text-lg">Tambah Video</p>
                                <p className="text-sm text-[var(--text-secondary)]">Pilih beberapa file sekaligus (MP4, MOV, dll)</p>
                            </div>
                        </div>

                        {items.length > 0 && (
                            <div className="flex flex-col gap-6 mt-8">
                                {/* Global Actions */}
                                <div className="glass p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-50 shadow-lg border border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
                                    <div className="flex items-center gap-4 font-bold text-lg">
                                        <FileVideo />
                                        {items.length} Video Terpilih
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select
                                            className="bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-2 rounded-lg outline-none text-sm"
                                            value={globalLanguage}
                                            onChange={(e) => {
                                                setGlobalLanguage(e.target.value);
                                                setItems(items.map(i => ({ ...i, language: e.target.value })));
                                            }}
                                            title="Ubah bahasa semua video"
                                        >
                                            <option value="Indonesia">Bahasa Indonesia</option>
                                            <option value="English">English</option>
                                            <option value="Japanese">日本語 (Japanese)</option>
                                            <option value="Korean">한국어 (Korean)</option>
                                            <option value="Spanish">Español (Spanish)</option>
                                        </select>

                                        <button
                                            onClick={handleGenerateAllAI}
                                            disabled={isGeneratingAll || isUploadingAll}
                                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            {isGeneratingAll ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                            Autofill Semua AI
                                        </button>

                                        <button
                                            onClick={handleUploadAll}
                                            disabled={isUploadingAll || isGeneratingAll}
                                            className="btn-primary flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                                        >
                                            {isUploadingAll ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            Upload Semua
                                        </button>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="grid grid-cols-1 gap-6">
                                    {items.map((item) => (
                                        <div key={item.id} className={`glass p-4 rounded-xl flex flex-col md:flex-row gap-6 relative transition-opacity ${item.status === 'success' ? 'opacity-50 pointer-events-none' : ''}`}>

                                            {/* Left: Thumbnail & Info */}
                                            <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 relative group">
                                                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
                                                    {item.localThumbnail ? (
                                                        <img src={item.localThumbnail} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                                                            <Loader2 size={24} className="animate-spin mb-1" />
                                                            <span className="text-xs">Processing...</span>
                                                        </div>
                                                    )}

                                                    {/* Status Overlays */}
                                                    {item.status === 'uploading' && (
                                                        <div className="absolute inset-0 bg-blue-500/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                                            <Loader2 size={32} className="animate-spin mb-2" />
                                                            <span className="font-bold">Uploading</span>
                                                        </div>
                                                    )}
                                                    {item.status === 'success' && (
                                                        <div className="absolute inset-0 bg-green-500/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                                            <CheckCircle size={32} className="mb-2" />
                                                            <span className="font-bold">Sukses</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-[var(--text-secondary)] flex justify-between">
                                                    <span className="truncate max-w-[150px]" title={item.file.name}>{item.file.name}</span>
                                                    <span>{(item.file.size / (1024 * 1024)).toFixed(1)} MB</span>
                                                </div>

                                                {item.status !== 'uploading' && item.status !== 'success' && (
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        title="Hapus Video"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Right: Form */}
                                            <div className="flex-1 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <label className="font-semibold text-sm">Judul Video</label>
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            className="bg-transparent border border-[var(--border)] px-2 py-1 rounded text-xs outline-none"
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
                                                            className="flex items-center gap-1 text-[var(--accent)] hover:opacity-80 text-xs font-semibold px-2 py-1 border border-[var(--accent)] rounded"
                                                        >
                                                            {item.status === 'generating' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                                            Autofill AI
                                                        </button>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    disabled={item.status === 'uploading' || item.status === 'success' || item.status === 'generating'}
                                                    placeholder="Contoh: Tutorial Masak Keren"
                                                    className="bg-transparent border-b border-[var(--border)] p-2 outline-none focus:border-[var(--accent)] w-full transition-colors text-sm"
                                                    value={item.title}
                                                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                                                />

                                                <label className="font-semibold text-sm mt-1">Deskripsi</label>
                                                <textarea
                                                    disabled={item.status === 'uploading' || item.status === 'success' || item.status === 'generating'}
                                                    placeholder="Jelaskan tentang video ini..."
                                                    rows={3}
                                                    className="bg-transparent border border-[var(--border)] p-2 rounded-md outline-none focus:border-[var(--accent)] w-full transition-colors text-sm resize-none"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                                />

                                                {item.status === 'error' && (
                                                    <p className="text-red-500 text-xs font-semibold mt-1">{item.errorMessage}</p>
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
