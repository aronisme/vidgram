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

    const getTransformedUrl = (originalUrl: string, transformation: string) => {
        if (transformation === "original" || !originalUrl.includes("upload/")) return originalUrl;
        return originalUrl.replace("/upload/", `/upload/${transformation}/`);
    };

    const currentSrc = getTransformedUrl(src, quality);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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

    const handleQualityChange = (val: string) => {
        if (!videoRef.current) return;
        const currentTime = videoRef.current.currentTime;
        const isPaused = videoRef.current.paused;

        setQuality(val);
        setShowSettings(false);

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
        <div style={{
            position: 'relative',
            aspectRatio: '16/9',
            width: '100%',
            background: '#000',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
        }} className="group">
            <video
                ref={videoRef}
                src={currentSrc}
                controls
                style={{ width: '100%', height: '100%' }}
                poster={poster}
            />

            {/* Quality Settings Overlay */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                opacity: 0,
                transition: 'opacity 0.3s ease',
            }} className="group-hover:!opacity-100">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    style={{
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Settings size={18} />
                </button>

                {showSettings && (
                    <div className="animate-slide-down" style={{
                        position: 'absolute',
                        right: 0,
                        marginTop: '0.5rem',
                        width: '180px',
                        background: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(16px)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.375rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.125rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}>
                        <div style={{
                            fontSize: '0.6875rem',
                            color: 'rgba(255,255,255,0.4)',
                            padding: '0.375rem 0.625rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}>Video Quality</div>
                        {RESOLUTIONS.map((res) => (
                            <button
                                key={res.value}
                                onClick={() => handleQualityChange(res.value)}
                                style={{
                                    textAlign: 'left',
                                    fontSize: '0.8125rem',
                                    padding: '0.5rem 0.625rem',
                                    borderRadius: 'var(--radius-sm)',
                                    transition: 'all 0.15s ease',
                                    background: quality === res.value ? 'var(--accent)' : 'transparent',
                                    color: quality === res.value ? 'white' : 'rgba(255,255,255,0.8)',
                                    fontWeight: quality === res.value ? 600 : 400,
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
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
