"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { videoService, VideoMetadata } from "@/lib/videoService";
import VideoCard from "@/components/VideoCard";

export default function DiscoveryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState<VideoMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const VIDEOS_PER_PAGE = 8;

    useEffect(() => {
        async function fetchInitialVideos() {
            setIsLoading(true);
            setHasMore(true);
            try {
                const recentVideos = await videoService.getVideos(VIDEOS_PER_PAGE);
                setVideos(recentVideos);
                if (recentVideos.length < VIDEOS_PER_PAGE) setHasMore(false);
            } catch (error) {
                console.error("Failed to fetch initial videos", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInitialVideos();
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSearching(true);
        setHasSearched(true);
        setHasMore(true);
        try {
            const searchResults = await videoService.searchVideos(searchQuery, VIDEOS_PER_PAGE);
            setVideos(searchResults);
            if (searchResults.length < VIDEOS_PER_PAGE) setHasMore(false);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const loadMore = async () => {
        if (isLoadingMore || !hasMore || videos.length === 0) return;
        setIsLoadingMore(true);
        try {
            const lastVideo = videos[videos.length - 1];
            let newVideos = [];
            if (hasSearched && searchQuery.trim() !== "") {
                newVideos = await videoService.searchVideos(searchQuery, VIDEOS_PER_PAGE, lastVideo.createdAt);
            } else {
                newVideos = await videoService.getVideos(VIDEOS_PER_PAGE, lastVideo.createdAt);
            }
            if (newVideos.length < VIDEOS_PER_PAGE) setHasMore(false);
            setVideos(prev => [...prev, ...newVideos]);
        } catch (error) {
            console.error("Failed to load more videos:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ paddingTop: '1.5rem', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Page Header */}
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Discovery</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9375rem' }}>
                    Discover amazing videos from creators around the world.
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
                display: 'flex',
                gap: '0.5rem',
                maxWidth: '640px',
                width: '100%',
            }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-tertiary)',
                        pointerEvents: 'none',
                    }}>
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search video title or topic..."
                        className="input-field"
                        style={{
                            paddingLeft: '2.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.9375rem',
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSearching}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white',
                        padding: '0.625rem 1.5rem',
                        borderRadius: '9999px',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.25s ease',
                        opacity: isSearching ? 0.7 : 1,
                    }}
                >
                    {isSearching ? "Searching..." : "Search"}
                </button>
            </form>

            {/* Results */}
            <div>
                <div className="section-header">
                    <h2 className="section-title">
                        {hasSearched ? (
                            <>Hasil untuk &quot;{searchQuery}&quot;</>
                        ) : (
                            "Latest Videos"
                        )}
                    </h2>
                    <span className="badge badge-accent">{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>
                </div>

                {isLoading || isSearching ? (
                    /* Skeleton Grid */
                    <div className="video-grid">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }}></div>
                                <div className="skeleton" style={{ height: '1rem', width: '85%' }}></div>
                                <div className="skeleton" style={{ height: '0.75rem', width: '60%' }}></div>
                            </div>
                        ))}
                    </div>
                ) : videos.length > 0 ? (
                    <div className="video-grid stagger-children">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        background: 'var(--bg-secondary)',
                        padding: '3rem',
                        textAlign: 'center',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                    }}>
                        <p>No videos found.</p>
                    </div>
                )}

                {/* Load More */}
                {hasMore && videos.length > 0 && !isLoading && !isSearching && (
                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="btn-secondary"
                            style={{ padding: '0.75rem 2rem' }}
                        >
                            {isLoadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
