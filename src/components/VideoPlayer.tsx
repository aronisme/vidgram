"use client";

import { useRef, useEffect, useState } from "react";
import { Settings } from "lucide-react";

interface VideoPlayerProps {
    src: string;
    poster: string;
}

const RESOLUTIONS = [
    { label: "480p Data Saver", value: "h_480,q_auto:low" },
    { label: "720p Standard", value: "h_720,q_auto" },
    { label: "1080p HD", value: "h_1080,q_auto:best" },
    { label: "Original", value: "original" },
];

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [quality, setQuality] = useState(RESOLUTIONS[0].value);
    const [showSettings, setShowSettings] = useState(false);

    // Build the Cloudinary transformed URL
    const getTransformedUrl = (originalUrl: string, transformation: string) => {
        if (transformation === "original" || !originalUrl.includes("upload/")) return originalUrl;
        // Insert the transformation right after 'upload/'
        return originalUrl.replace("/upload/", `/upload/${transformation}/`);
    };

    const currentSrc = getTransformedUrl(src, quality);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if not typing in an input or textarea
            if (e.code === "Space" && e.target === document.body) {
                e.preventDefault();
                if (videoRef.current) {
                    if (videoRef.current.paused) {
                        videoRef.current.play();
                    } else {
                        videoRef.current.pause();
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // When quality changes, keep the current time and autoplay
    const handleQualityChange = (val: string) => {
        if (!videoRef.current) return;
        const currentTime = videoRef.current.currentTime;
        const isPaused = videoRef.current.paused;

        setQuality(val);
        setShowSettings(false);

        // Wait for the new source to load then restore time and state
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.currentTime = currentTime;
                if (!isPaused) {
                    videoRef.current.play();
                }
            }
        }, 100);
    };

    return (
        <div className="relative aspect-video w-full bg-black rounded-[var(--radius-lg)] overflow-hidden group">
            <video
                ref={videoRef}
                src={currentSrc}
                controls
                className="w-full h-full"
                poster={poster}
            />

            {/* Custom Quality Settings Overlay */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors"
                >
                    <Settings size={20} />
                </button>

                {showSettings && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-xl p-2 flex flex-col gap-1 border border-white/10 shadow-xl">
                        <div className="text-xs text-white/50 px-3 py-2 font-semibold uppercase">Video Quality</div>
                        {RESOLUTIONS.map((res) => (
                            <button
                                key={res.value}
                                onClick={() => handleQualityChange(res.value)}
                                className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${quality === res.value ? 'bg-[var(--accent)] text-white font-semibold' : 'text-gray-300 hover:bg-white/10'}`}
                            >
                                {res.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

