"use client";

import { useState, useEffect } from "react";
import { videoService, VideoMetadata } from "@/lib/videoService";
import { Play, Users, TrendingUp, ArrowUpRight, Video as VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user, dbUser, loading } = useAuth();
    const [videos, setVideos] = useState<VideoMetadata[]>([]);
    const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0, totalVideos: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const VIDEOS_PER_PAGE = 5;

    useEffect(() => {
        if (!loading && !user) {
            // If not logged in after auth check, redirect
            window.location.href = "/";
            return;
        }

        if (!user) return;

        async function fetchData() {
            try {
                const [userVideos, userStats] = await Promise.all([
                    videoService.getVideosByUser(user!.uid, VIDEOS_PER_PAGE),
                    videoService.getUserStats(user!.uid)
                ]);

                setVideos(userVideos);
                setStats(userStats);

                if (userVideos.length < VIDEOS_PER_PAGE) setHasMore(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user, loading]);

    const loadMore = async () => {
        if (!user || isLoadingMore || !hasMore || videos.length === 0) return;
        setIsLoadingMore(true);
        try {
            const lastVideo = videos[videos.length - 1];
            const newVideos = await videoService.getVideosByUser(user.uid, VIDEOS_PER_PAGE, lastVideo.createdAt);
            if (newVideos.length < VIDEOS_PER_PAGE) setHasMore(false);
            setVideos(prev => [...prev, ...newVideos]);
        } catch (error) {
            console.error("Failed to load more videos:", error);
        } finally {
            setIsLoadingMore(false);
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
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                    Hello, {dbUser?.displayName}! 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                    Monitor your channel growth and video statistics.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }} className="stagger-children">
                {[
                    {
                        label: "Total Video Views",
                        value: stats.totalViews.toLocaleString(),
                        icon: <Play size={20} />,
                        gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                        shadow: 'rgba(59, 130, 246, 0.3)',
                    },
                    {
                        label: "Total Videos",
                        value: stats.totalVideos.toLocaleString(),
                        icon: <VideoIcon size={20} />,
                        gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        shadow: 'rgba(139, 92, 246, 0.3)',
                    },
                    {
                        label: "Subscribers",
                        value: (dbUser?.subscribersCount || 0).toLocaleString(),
                        icon: <Users size={20} />,
                        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        shadow: 'rgba(245, 158, 11, 0.3)',
                    },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{
                                background: stat.gradient,
                                width: '42px',
                                height: '42px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: `0 4px 12px ${stat.shadow}`,
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

            {/* Content Table */}
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Content</h2>
                    <Link href="/dashboard/upload" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                        Upload New
                    </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Video</th>
                                <th className="hide-on-mobile" style={{ padding: '1rem', fontWeight: 600 }}>Visibility</th>
                                <th className="hide-on-mobile" style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Views</th>
                                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Likes</th>
                                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.length > 0 ? (
                                videos.map((video) => (
                                    <tr key={video.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                        <td>
                                            <Link href={`/video/${video.slug}`} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                textDecoration: 'none',
                                                color: 'var(--text-primary)',
                                                padding: '1rem 0',
                                            }}>
                                                <div style={{
                                                    position: 'relative',
                                                    width: '80px',
                                                    height: '50px',
                                                    flexShrink: 0,
                                                    background: '#000',
                                                    borderRadius: 'var(--radius-sm)',
                                                    overflow: 'hidden',
                                                }}>
                                                    <Image
                                                        src={video.thumbnailUrl}
                                                        alt={video.title}
                                                        fill
                                                        sizes="80px"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <span style={{ fontWeight: 600 }} className="line-clamp-2">{video.title}</span>
                                            </Link>
                                        </td>
                                        <td className="hide-on-mobile">
                                            <span className="badge badge-success">Public</span>
                                        </td>
                                        <td className="hide-on-mobile" style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(video.createdAt?.toDate?.() || video.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ fontWeight: 600, textAlign: 'right' }}>{video.views.toLocaleString()}</td>
                                        <td style={{ fontWeight: 600, textAlign: 'right' }}>{video.likes.toLocaleString()}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Link href={`/dashboard/edit-video/${video.id}`} className="btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}>
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                                        You haven't uploaded any videos yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {videos.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <p>You haven't uploaded any videos yet.</p>
                    </div>
                )}

                {hasMore && videos.length > 0 && (
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="btn-secondary"
                            style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
                        >
                            {isLoadingMore ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
