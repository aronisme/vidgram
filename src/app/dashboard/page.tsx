"use client";

import { useState, useEffect } from "react";
import { videoService, VideoMetadata } from "@/lib/videoService";
import { BarChart3, Users, Play, TrendingUp, ArrowUpRight, Video as VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user, dbUser } = useAuth();
    const [videos, setVideos] = useState<VideoMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Constant for pagination limit
    const VIDEOS_PER_PAGE = 5;

    useEffect(() => {
        if (!user) return;

        async function fetchVideos() {
            try {
                const userVideos = await videoService.getVideosByUser(user!.uid, VIDEOS_PER_PAGE);
                setVideos(userVideos);
                if (userVideos.length < VIDEOS_PER_PAGE) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to fetch user videos:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchVideos();
    }, [user]);

    const loadMore = async () => {
        if (!user || isLoadingMore || !hasMore || videos.length === 0) return;
        setIsLoadingMore(true);

        try {
            const lastVideo = videos[videos.length - 1];
            const newVideos = await videoService.getVideosByUser(user.uid, VIDEOS_PER_PAGE, lastVideo.createdAt);

            if (newVideos.length < VIDEOS_PER_PAGE) {
                setHasMore(false);
            }

            setVideos(prev => [...prev, ...newVideos]);
        } catch (error) {
            console.error("Failed to load more videos:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const totalViews = videos.reduce((acc, video) => acc + video.views, 0);
    const totalVideos = videos.length;
    const avgViews = totalVideos > 0 ? (totalViews / totalVideos).toFixed(1) : 0;

    if (!user || isLoading) {
        return (
            <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
            </div>
        );
    }

    return (
        <div className="py-8 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Halo, {dbUser?.displayName}!</h1>
                <p className="text-[var(--text-secondary)]">Monitor perkemban channel dan statistik videomu.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-[var(--radius-lg)] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600">
                            <Play size={24} />
                        </div>
                        <span className="text-green-500 flex items-center text-sm font-bold bg-green-500/10 px-2 py-1 rounded-full">
                            <ArrowUpRight size={14} /> +12%
                        </span>
                    </div>
                    <div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium">Total Video Views</p>
                        <h2 className="text-3xl font-bold">{totalViews.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="glass p-6 rounded-[var(--radius-lg)] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600">
                            <VideoIcon size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium">Total Videos</p>
                        <h2 className="text-3xl font-bold">{totalVideos}</h2>
                    </div>
                </div>

                <div className="glass p-6 rounded-[var(--radius-lg)] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl text-orange-600">
                            <Users size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[var(--text-secondary)] text-sm font-medium">Subscribers</p>
                        <h2 className="text-3xl font-bold">{dbUser?.subscribersCount || 0}</h2>
                    </div>
                </div>
            </div>

            {/* Video Performance Table */}
            <div className="glass rounded-[var(--radius-lg)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="text-xl font-bold">Video Performance</h2>
                    <Link href="/dashboard/upload" className="text-sm font-semibold text-[var(--accent)] hover:underline">
                        Upload New
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm">
                                <th className="px-6 py-4 font-semibold">Video</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Views</th>
                                <th className="px-6 py-4 font-semibold">Upload Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {videos.map((video) => (
                                <tr key={video.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                    <td className="px-6 py-4">
                                        <Link href={`/video/${video.slug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                            <div className="relative w-16 h-10 shrink-0 bg-black rounded overflow-hidden">
                                                <Image
                                                    src={video.thumbnailUrl}
                                                    alt={video.title}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-semibold line-clamp-2 hover:text-[var(--accent)] transition-colors">{video.title}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold">
                                            Public
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{video.views.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {new Date(video.createdAt?.toDate?.() || video.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {videos.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                        Belum ada video. Ayo upload video pertamamu sekarang!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Load More Button inside table wrapper */}
                {hasMore && videos.length > 0 && (
                    <div className="p-4 border-t border-[var(--border)] flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="text-sm font-semibold text-[var(--accent)] hover:opacity-80 disabled:opacity-50 px-6 py-2 border border-[var(--accent)] rounded-full transition-colors flex items-center gap-2"
                        >
                            {isLoadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
