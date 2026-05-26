"use client";

import { useState, useEffect } from "react";
import { videoService } from "@/lib/videoService";
import { imageService } from "@/lib/imageService";
import { Play, Users, Video as VideoIcon, Images, Trash2, Edit, X, Save, Image as ImageIcon, Lock, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function DashboardPage() {
    const { user, dbUser, loading } = useAuth();
    const { addToast } = useToast();
    const [posts, setPosts] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0, totalVideos: 0, totalImages: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const POSTS_PER_PAGE = 10;
    const [hasMoreVideos, setHasMoreVideos] = useState(true);
    const [hasMoreImages, setHasMoreImages] = useState(true);
    const [lastVideoDate, setLastVideoDate] = useState<any>(null);
    const [lastImageDate, setLastImageDate] = useState<any>(null);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Edit State
    const [editingPost, setEditingPost] = useState<any>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = "/";
            return;
        }

        if (!user) return;

        async function fetchData() {
            try {
                const [userVideos, userImages, userStats] = await Promise.all([
                    videoService.getVideosByUser(user!.uid, POSTS_PER_PAGE),
                    // Mengambil gambar, kita bypass includePrivate agar dapat semua foto milik uploader
                    imageService.getImagePostsByUser(user!.uid, POSTS_PER_PAGE, null, true), 
                    videoService.getUserStats(user!.uid)
                ]);

                if (userVideos.length < POSTS_PER_PAGE) setHasMoreVideos(false);
                if (userImages.length < POSTS_PER_PAGE) setHasMoreImages(false);

                if (userVideos.length > 0) setLastVideoDate(userVideos[userVideos.length - 1].createdAt);
                if (userImages.length > 0) setLastImageDate(userImages[userImages.length - 1].createdAt);

                // Kalkulasi manual untuk statistik gambar
                let imgViews = 0, imgLikes = 0;
                userImages.forEach(img => {
                    imgViews += (img.views || 0);
                    imgLikes += (img.likes || 0);
                });

                setStats({
                    totalViews: userStats.totalViews + imgViews,
                    totalLikes: userStats.totalLikes + imgLikes,
                    totalVideos: userStats.totalVideos,
                    totalImages: userImages.length
                });

                const all = [
                    ...userVideos.map(v => ({ ...v, type: 'video' })),
                    ...userImages.map(i => ({ ...i, type: 'image' }))
                ].sort((a, b) => {
                    const timeA = a.createdAt?.toDate?.()?.getTime() || new Date(a.createdAt).getTime();
                    const timeB = b.createdAt?.toDate?.()?.getTime() || new Date(b.createdAt).getTime();
                    return timeB - timeA;
                });

                setPosts(all);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user, loading]);

    const loadMore = async () => {
        if (!user || isFetchingMore || (!hasMoreVideos && !hasMoreImages)) return;
        setIsFetchingMore(true);
        try {
            const promises = [];
            
            if (hasMoreVideos) promises.push(videoService.getVideosByUser(user.uid, POSTS_PER_PAGE, lastVideoDate));
            else promises.push(Promise.resolve([]));

            if (hasMoreImages) promises.push(imageService.getImagePostsByUser(user.uid, POSTS_PER_PAGE, lastImageDate, true));
            else promises.push(Promise.resolve([]));

            const [newVideos, newImages] = await Promise.all(promises);

            if (newVideos.length < POSTS_PER_PAGE) setHasMoreVideos(false);
            if (newImages.length < POSTS_PER_PAGE) setHasMoreImages(false);

            if (newVideos.length > 0) setLastVideoDate(newVideos[newVideos.length - 1].createdAt);
            if (newImages.length > 0) setLastImageDate(newImages[newImages.length - 1].createdAt);

            const all = [
                ...newVideos.map(v => ({ ...v, type: 'video' })),
                ...newImages.map(i => ({ ...i, type: 'image' }))
            ];
            
            setPosts(prev => {
                return [...prev, ...all].sort((a, b) => {
                    const timeA = a.createdAt?.toDate?.()?.getTime() || new Date(a.createdAt).getTime();
                    const timeB = b.createdAt?.toDate?.()?.getTime() || new Date(b.createdAt).getTime();
                    return timeB - timeA;
                });
            });
        } catch (error) {
            console.error("Failed to load more posts:", error);
            addToast("Gagal memuat postingan lama", "error");
        } finally {
            setIsFetchingMore(false);
        }
    };

    const handleDelete = async (post: any) => {
        if (!confirm(`Yakin ingin menghapus ${post.title}? Tindakan ini tidak bisa dibatalkan.`)) return;
        try {
            if (post.type === 'image') {
                await imageService.deleteImagePost(post.id);
            } else {
                await videoService.deleteVideo(post.id);
            }
            setPosts(prev => prev.filter(p => p.id !== post.id));
            addToast("Postingan berhasil dihapus", "success");
        } catch (e: any) {
            addToast(`Gagal menghapus: ${e.message}`, "error");
        }
    };

    const handleEditClick = (post: any) => {
        setEditingPost(post);
        setEditTitle(post.title);
        setEditDescription(post.description);
        setIsPrivate(post.isPrivate || false);
    };

    const handleSaveEdit = async () => {
        if (!editTitle || !editDescription) {
            addToast("Judul dan deskripsi tidak boleh kosong", "error");
            return;
        }
        setIsSaving(true);
        try {
            if (editingPost.type === 'image') {
                await imageService.updateImagePost(editingPost.id, {
                    title: editTitle,
                    description: editDescription,
                    isPrivate
                });
            } else {
                await videoService.updateVideo(editingPost.id, {
                    title: editTitle,
                    description: editDescription
                });
            }
            
            setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, title: editTitle, description: editDescription, isPrivate: editingPost.type === 'image' ? isPrivate : undefined } : p));
            setEditingPost(null);
            addToast("Perubahan berhasil disimpan", "success");
        } catch (e: any) {
            addToast(`Gagal menyimpan: ${e.message}`, "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || (user && isLoading)) {
        return (
            <div style={{ paddingTop: '5rem', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="animate-fade-in" style={{ paddingTop: '1.5rem', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Greeting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                        Dashboard Anda 👋
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                        Kelola konten, cek performa, dan edit postingan dengan mudah.
                    </p>
                </div>
                <Link href="/dashboard/upload" className="btn-primary" style={{ padding: '0.625rem 1.5rem', fontSize: '0.9375rem' }}>
                    + Buat Postingan
                </Link>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }} className="stagger-children">
                {[
                    { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: <Play size={20} />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', shadow: 'rgba(59, 130, 246, 0.3)' },
                    { label: "Total Videos", value: stats.totalVideos.toLocaleString(), icon: <VideoIcon size={20} />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', shadow: 'rgba(139, 92, 246, 0.3)' },
                    { label: "Total Images", value: stats.totalImages.toLocaleString(), icon: <Images size={20} />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', shadow: 'rgba(16, 185, 129, 0.3)' },
                    { label: "Subscribers", value: (dbUser?.subscribersCount || 0).toLocaleString(), icon: <Users size={20} />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', shadow: 'rgba(245, 158, 11, 0.3)' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{
                                background: stat.gradient, width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: `0 4px 12px ${stat.shadow}`,
                            }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }}>{stat.label}</p>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0 0 1.5rem 0', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Semua Postingan Anda</h2>
                </div>

                {posts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
                        {posts.map((post) => {
                            const isImg = post.type === 'image';
                            const previewUrl = isImg ? post.images[0]?.url : post.thumbnailUrl;
                            const postLink = isImg ? `/image/${post.slug}` : `/video/${post.slug}`;
                            const date = new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});

                            return (
                                <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                                    <Link href={postLink} style={{ position: 'relative', width: '100%', aspectRatio: isImg ? '1' : '16/9', background: 'var(--bg-secondary)', display: 'block' }}>
                                        <Image src={previewUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
                                        
                                        {/* Type Badge */}
                                        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', backdropFilter: 'blur(4px)' }}>
                                            {isImg ? <ImageIcon size={12} /> : <VideoIcon size={12} />}
                                            {isImg ? "Album" : "Video"}
                                        </div>
                                    </Link>
                                    
                                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                        <Link href={postLink} style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', lineHeight: 1.4 }} className="hover:text-[var(--accent)] line-clamp-2">
                                            {post.title}
                                        </Link>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                            <span>{date}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Play size={12} /> {post.views?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {isImg ? (
                                                post.isPrivate ? (
                                                    <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}><Lock size={12} style={{marginRight: '4px'}}/> Private</span>
                                                ) : (
                                                    <span className="badge badge-success"><Globe size={12} style={{marginRight: '4px'}}/> Public</span>
                                                )
                                            ) : (
                                                <span className="badge badge-success"><Globe size={12} style={{marginRight: '4px'}}/> Public</span>
                                            )}

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <button onClick={() => handleEditClick(post)} className="btn-secondary" style={{ padding: '0.375rem', borderRadius: 'var(--radius-sm)' }}>
                                                    <Edit size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(post)} className="btn-secondary" style={{ padding: '0.375rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="card" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Images size={40} style={{ opacity: 0.5 }} />
                        <p>Anda belum mengunggah apa pun. Mari mulai berkarya!</p>
                    </div>
                )}

                {(hasMoreVideos || hasMoreImages) && posts.length > 0 && (
                    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={loadMore}
                            disabled={isFetchingMore}
                            className="btn-secondary"
                            style={{ padding: '0.625rem 2rem', fontSize: '0.9375rem', borderRadius: 'var(--radius-full)' }}
                        >
                            {isFetchingMore ? "Memuat..." : "Muat Lebih Banyak"}
                        </button>
                    </div>
                )}
            </div>

            {/* ============================== */}
            {/*          EDIT MODAL            */}
            {/* ============================== */}
            {editingPost && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }} className="animate-fade-in">
                    <div className="card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Edit size={18} color="var(--accent)"/> Edit {editingPost.type === 'image' ? 'Album' : 'Video'}
                            </h3>
                            <button onClick={() => setEditingPost(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Body */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Judul</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    value={editTitle} 
                                    onChange={e => setEditTitle(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Deskripsi</label>
                                <textarea 
                                    className="input-field" 
                                    rows={4} 
                                    style={{ resize: 'none' }}
                                    value={editDescription} 
                                    onChange={e => setEditDescription(e.target.value)} 
                                />
                            </div>

                            {/* Khusus gambar ada opsi privasi */}
                            {editingPost.type === 'image' && (
                                <div>
                                    <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Visibilitas</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9375rem' }}>
                                            <input type="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} />
                                            <Globe size={16} /> Publik
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9375rem' }}>
                                            <input type="radio" checked={isPrivate} onChange={() => setIsPrivate(true)} />
                                            <Lock size={16} /> Private
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', background: 'var(--bg-secondary)' }}>
                            <button onClick={() => setEditingPost(null)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }} disabled={isSaving}>
                                Batal
                            </button>
                            <button onClick={handleSaveEdit} className="btn-primary" style={{ padding: '0.5rem 1.5rem' }} disabled={isSaving}>
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
