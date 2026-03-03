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

    // Pagination state
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const VIDEOS_PER_PAGE = 8;

    useEffect(() => {
        // Load initial "Terbaru" videos
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
            // Melakukan pencarian dari server Firestore langsung
            const searchResults = await videoService.searchVideos(searchQuery, VIDEOS_PER_PAGE);
            setVideos(searchResults);
            if (searchResults.length < VIDEOS_PER_PAGE) setHasMore(false);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce effect isn't ideal for Firestore reads (too many api calls), 
    // so we use a form submit / enter key instead.

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

    return (
        <div className="py-8 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Discovery</h1>
                <p className="text-[var(--text-secondary)]">Temukan video-video menarik dari para kreator.</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl w-full flex gap-2">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-secondary)]">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari judul atau topik video..."
                        className="glass w-full bg-transparent p-4 pl-12 rounded-[var(--radius-lg)] outline-none focus:border-[var(--accent)] transition-colors text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-[var(--accent)] text-white px-8 rounded-[var(--radius-lg)] font-bold hover:opacity-90 flex items-center justify-center shrink-0 disabled:opacity-50"
                    disabled={isSearching}
                >
                    {isSearching ? "Mencari..." : "Cari"}
                </button>
            </form>


            {/* Video List */}
            <div>
                {hasSearched ? (
                    <h2 className="text-xl font-semibold mb-6">
                        Hasil pencarian untuk "{searchQuery}" ({videos.length})
                    </h2>
                ) : (
                    <h2 className="text-xl font-semibold mb-6">Video Terbaru Disarankan ({videos.length})</h2>
                )}

                {isLoading || isSearching ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
                    </div>
                ) : videos.length > 0 ? (
                    <div className="video-grid">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                ) : (
                    <div className="glass p-12 text-center rounded-[var(--radius-lg)]">
                        <p className="text-[var(--text-secondary)] text-lg">Tidak ada video yang ditemukan.</p>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && videos.length > 0 && !isLoading && !isSearching && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="text-[var(--accent)] font-semibold border-2 border-[var(--accent)] px-8 py-3 rounded-full hover:bg-[var(--accent)] hover:text-white transition-colors disabled:opacity-50"
                        >
                            {isLoadingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
