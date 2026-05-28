"use client";

import { useState, useEffect, useMemo } from "react";
import { videoService } from "@/lib/videoService";
import { imageService } from "@/lib/imageService";
import { Play, Users, Video as VideoIcon, Images, Trash2, Edit, X, Save, Image as ImageIcon, Lock, Globe, Loader2, Eye, Heart, Plus, Grid3X3, Film } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

type TabType = "public" | "private" | "video";

export default function DashboardPage() {
    const { user, dbUser, loading } = useAuth();
    const { addToast } = useToast();
    const [posts, setPosts] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0, totalVideos: 0, totalImages: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("public");

    const POSTS_PER_PAGE = 30;
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

    // Filter posts by tab
    const filteredPosts = useMemo(() => {
        switch (activeTab) {
            case "public":
                return posts.filter(p => !p.isPrivate);
            case "private":
                return posts.filter(p => p.isPrivate);
            case "video":
                return posts.filter(p => p.type === "video");
            default:
                return posts;
        }
    }, [posts, activeTab]);

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

    const tabCounts = {
        public: posts.filter(p => !p.isPrivate).length,
        private: posts.filter(p => p.isPrivate).length,
        video: posts.filter(p => p.type === "video").length,
    };

    const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
        { key: "public", label: "Publik", icon: <Globe size={16} /> },
        { key: "private", label: "Privat", icon: <Lock size={16} /> },
        { key: "video", label: "Video", icon: <Film size={16} /> },
    ];

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem', display: 'flex', flexDirection: 'column' }}>

            {/* ══════════════════════════════════════════
                PROFILE HEADER — Social Media Style
               ══════════════════════════════════════════ */}
            <div className="dashboard-profile-header">
                {/* Background Gradient Accent */}
                <div className="dashboard-profile-banner" />

                <div className="dashboard-profile-info">
                    {/* Avatar */}
                    <div className="dashboard-avatar-wrapper">
                        <img
                            src={dbUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                            alt="Avatar"
                            className="dashboard-avatar"
                        />
                        <Link href="/dashboard/upload" className="dashboard-avatar-upload-btn" title="Buat Postingan">
                            <Plus size={16} />
                        </Link>
                    </div>

                    {/* Name + Bio */}
                    <div className="dashboard-user-meta">
                        <h1 className="dashboard-display-name">
                            {dbUser?.displayName || "User"}
                        </h1>
                        {dbUser?.username && (
                            <p className="dashboard-username">@{dbUser.username}</p>
                        )}
                        {dbUser?.bio && (
                            <p className="dashboard-bio">{dbUser.bio}</p>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div className="dashboard-stats-row">
                        <div className="dashboard-stat-item">
                            <span className="dashboard-stat-value">{(stats.totalVideos + stats.totalImages).toLocaleString()}</span>
                            <span className="dashboard-stat-label">Postingan</span>
                        </div>
                        <div className="dashboard-stat-divider" />
                        <div className="dashboard-stat-item">
                            <span className="dashboard-stat-value">{(dbUser?.subscribersCount || 0).toLocaleString()}</span>
                            <span className="dashboard-stat-label">Subscriber</span>
                        </div>
                        <div className="dashboard-stat-divider" />
                        <div className="dashboard-stat-item">
                            <span className="dashboard-stat-value">{stats.totalViews.toLocaleString()}</span>
                            <span className="dashboard-stat-label">Views</span>
                        </div>
                        <div className="dashboard-stat-divider" />
                        <div className="dashboard-stat-item">
                            <span className="dashboard-stat-value">{stats.totalLikes.toLocaleString()}</span>
                            <span className="dashboard-stat-label">Likes</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="dashboard-action-row">
                        <Link href="/dashboard/profile" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem', borderRadius: 'var(--radius-full)' }}>
                            <Edit size={14} />
                            Edit Profile
                        </Link>
                        <Link href="/dashboard/upload" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}>
                            <Plus size={14} />
                            Buat Postingan
                        </Link>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                TAB BAR — Instagram/TikTok style
               ══════════════════════════════════════════ */}
            <div className="dashboard-tabs-bar">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`dashboard-tab ${activeTab === tab.key ? "dashboard-tab-active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.icon}
                        <span className="dashboard-tab-label">{tab.label}</span>
                        <span className="dashboard-tab-count">{tabCounts[tab.key]}</span>
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════
                CONTENT GRID — 3-column thumbnail grid
               ══════════════════════════════════════════ */}
            <div style={{ marginTop: '0.5rem' }}>
                {filteredPosts.length > 0 ? (
                    <div className="dashboard-content-grid">
                        {filteredPosts.map((post) => {
                            const isImg = post.type === 'image';
                            const previewUrl = isImg ? post.images[0]?.url : post.thumbnailUrl;
                            const postLink = isImg ? `/image/${post.slug}` : `/video/${post.slug}`;

                            return (
                                <div key={post.id} className="dashboard-grid-item">
                                    <Link href={postLink} className="dashboard-grid-thumb">
                                        <Image
                                            src={previewUrl}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                            style={{ objectFit: 'cover' }}
                                        />

                                        {/* Hover overlay with stats */}
                                        <div className="dashboard-grid-overlay">
                                            <div className="dashboard-grid-overlay-stats">
                                                <span><Eye size={16} /> {post.views?.toLocaleString() || 0}</span>
                                                <span><Heart size={16} /> {post.likes?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>

                                        {/* Type indicator */}
                                        {!isImg && (
                                            <div className="dashboard-grid-type-badge">
                                                <Play size={14} fill="white" />
                                            </div>
                                        )}

                                        {/* Multi-image indicator */}
                                        {isImg && post.images?.length > 1 && (
                                            <div className="dashboard-grid-multi-badge">
                                                <Grid3X3 size={14} />
                                            </div>
                                        )}

                                        {/* Privacy badge */}
                                        {post.isPrivate && (
                                            <div className="dashboard-grid-private-badge">
                                                <Lock size={12} />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Action buttons — visible on hover */}
                                    <div className="dashboard-grid-actions">
                                        <button onClick={() => handleEditClick(post)} className="dashboard-grid-action-btn" title="Edit">
                                            <Edit size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(post)} className="dashboard-grid-action-btn dashboard-grid-action-delete" title="Hapus">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="dashboard-empty-state">
                        {activeTab === "public" && <Globe size={48} style={{ opacity: 0.3 }} />}
                        {activeTab === "private" && <Lock size={48} style={{ opacity: 0.3 }} />}
                        {activeTab === "video" && <Film size={48} style={{ opacity: 0.3 }} />}
                        <p>Belum ada konten {activeTab === "public" ? "publik" : activeTab === "private" ? "privat" : "video"}.</p>
                        <Link href="/dashboard/upload" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
                            <Plus size={16} />
                            Upload Sekarang
                        </Link>
                    </div>
                )}

                {(hasMoreVideos || hasMoreImages) && filteredPosts.length > 0 && (
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

            {/* ══════════════════════════════════════════
                         EDIT MODAL
               ══════════════════════════════════════════ */}
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
