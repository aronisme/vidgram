"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Link as LinkIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { videoService } from "@/lib/videoService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function UploadLinkPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();

    const [videoUrl, setVideoUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleUpload = async () => {
        if (!user) {
            addToast("You must be signed in to upload videos.", "error");
            return;
        }

        if (!videoUrl || !title || !description) {
            addToast("Semua field harus diisi.", "error");
            return;
        }

        setIsUploading(true);

        try {
            const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

            await videoService.addVideo({
                title,
                description,
                cloudinaryId: "external-link",
                videoUrl,
                thumbnailUrl: "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22640%22%20height%3D%22360%22%20viewBox%3D%220%200%20640%20360%22%3E%3Crect%20width%3D%22640%22%20height%3D%22360%22%20fill%3D%22%231f2937%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22180%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EVideo%20Link%3C%2Ftext%3E%3C%2Fsvg%3E",
                slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
                uploaderId: user.uid,
            });

            setIsSuccess(true);
            addToast("Video berhasil ditambahkan melalui link.", "success");

            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (error: any) {
            console.error(error);
            addToast(error.message || "Upload failed.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Upload by Link</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                        Input a direct video link instead of uploading a file.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/upload")}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Upload size={18} />
                    File Upload
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {isSuccess ? (
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
                        <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Video Berhasil Ditambahkan!</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Mengalihkan ke Dashboard dalam beberapa detik...</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                                Video Link (URL)
                            </label>
                            <input
                                type="url"
                                placeholder="https://tv.hhhahh.fun/stream/..."
                                className="input-field"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                disabled={isUploading}
                                style={{ width: '100%', fontSize: '0.875rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                                Judul Video
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan judul video"
                                className="input-field"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isUploading}
                                style={{ width: '100%', fontSize: '0.875rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                                Deskripsi
                            </label>
                            <textarea
                                placeholder="Jelaskan tentang video ini..."
                                rows={4}
                                className="input-field"
                                style={{ resize: 'none', width: '100%', fontSize: '0.875rem' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isUploading}
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="btn-primary"
                            style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}
                        >
                            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <LinkIcon size={18} />}
                            {isUploading ? "Memproses..." : "Tambahkan Video"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
