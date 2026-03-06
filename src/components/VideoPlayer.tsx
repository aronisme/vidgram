"use client";

import { useRef, useEffect, useState } from "react";
import { Settings, Play, Pause, SkipBack, SkipForward, Maximize, Minimize, Volume2, VolumeX, Loader2, Volume1 } from "lucide-react";

interface VideoPlayerProps {
    src: string;
    poster: string;
}

const RESOLUTIONS = [
    { label: "480p", value: "h_480,q_auto:low" },
    { label: "720p", value: "h_720,q_auto" },
    { label: "1080p", value: "h_1080,q_auto:best" },
    { label: "Original", value: "original" },
];

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressContainerRef = useRef<HTMLDivElement>(null);

    // Video State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // Player Controls State
    const [quality, setQuality] = useState(RESOLUTIONS[0].value);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // UI State
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [activeSettingsMenu, setActiveSettingsMenu] = useState<'main' | 'quality' | 'speed'>('main');
    const [isHoveringVolume, setIsHoveringVolume] = useState(false);
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const [hoverProgress, setHoverProgress] = useState(0);

    // Animation State
    const [centerAction, setCenterAction] = useState<{ type: 'play' | 'pause' | 'ff' | 'rw' | null; id: number }>({ type: null, id: 0 });

    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const centerActionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

    const getTransformedUrl = (originalUrl: string, transformation: string) => {
        if (transformation === "original" || !originalUrl.includes("upload/")) return originalUrl;
        return originalUrl.replace("/upload/", `/upload/${transformation}/`);
    };

    const currentSrc = getTransformedUrl(src, quality);

    // Auto-hide controls timer
    const resetControlsTimeout = () => {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        setShowControls(true);
        if (isPlaying && !showSettings && !isDraggingProgress && !isHoveringVolume) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target !== document.body && !(containerRef.current?.contains(e.target as Node))) return;

            resetControlsTimeout();

            switch (e.code) {
                case "Space":
                case "KeyK":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "ArrowRight":
                case "KeyL":
                    e.preventDefault();
                    handleSkip(10);
                    break;
                case "ArrowLeft":
                case "KeyJ":
                    e.preventDefault();
                    handleSkip(-10);
                    break;
                case "KeyF":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "KeyM":
                    e.preventDefault();
                    toggleMute();
                    break;
            }
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        const handleMouseUp = () => {
            if (isDraggingProgress) {
                setIsDraggingProgress(false);
                if (videoRef.current && isPlaying) {
                    videoRef.current.play();
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingProgress && progressContainerRef.current && videoRef.current) {
                const rect = progressContainerRef.current.getBoundingClientRect();
                let pos = (e.clientX - rect.left) / rect.width;
                pos = Math.max(0, Math.min(1, pos));
                const newTime = pos * duration;
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (centerActionTimeoutRef.current) clearTimeout(centerActionTimeoutRef.current);
        };
    }, [isPlaying, showSettings, isDraggingProgress, duration]);

    // Handle video events
    const handleTimeUpdate = () => {
        if (!videoRef.current || isDraggingProgress) return;
        setCurrentTime(videoRef.current.currentTime);

        if (videoRef.current.buffered.length > 0) {
            const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
            setBuffered(bufferedEnd);
        }
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);

        // Restore volume
        const savedVolume = localStorage.getItem("yt_player_volume");
        if (savedVolume !== null) {
            const v = parseFloat(savedVolume);
            videoRef.current.volume = v;
            setVolume(v);
        }

        const savedMuted = localStorage.getItem("yt_player_muted");
        if (savedMuted === "true") {
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    };

    const handlePlayPauseEvent = () => {
        // Just sync React state with native video state, do not trigger animations here
        setIsPlaying(!videoRef.current?.paused);
        resetControlsTimeout();
    };

    const triggerCenterAction = (type: 'play' | 'pause' | 'ff' | 'rw') => {
        setCenterAction({ type, id: Date.now() });
        if (centerActionTimeoutRef.current) clearTimeout(centerActionTimeoutRef.current);
        centerActionTimeoutRef.current = setTimeout(() => {
            setCenterAction(prev => ({ ...prev, type: null }));
        }, 500); // Wait for CSS animation to finish
    };

    // Actions
    const togglePlay = (e?: React.MouseEvent | KeyboardEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            triggerCenterAction('play');
        } else {
            videoRef.current.pause();
            triggerCenterAction('pause');
        }
    };

    const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement | HTMLDivElement>) => {
        // Double tap detection for mobile
        const now = Date.now();
        const screenX = e.clientX;
        const rect = containerRef.current?.getBoundingClientRect();

        if (rect && now - lastTapRef.current.time < 300) {
            // Double tap!
            const isRightSide = screenX > rect.left + rect.width / 2;
            if (isRightSide) {
                handleSkip(10);
            } else {
                handleSkip(-10);
            }
            // Prevent play toggle on double tap
            lastTapRef.current = { time: now, x: screenX };
            return;
        }

        // Single tap
        togglePlay(e);
        lastTapRef.current = { time: now, x: screenX };
    };

    const handleSkip = (amount: number) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime += amount;
        setCurrentTime(videoRef.current.currentTime);
        triggerCenterAction(amount > 0 ? 'ff' : 'rw');
    };

    const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!progressContainerRef.current || !videoRef.current) return;

        const rect = progressContainerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        let pos = (clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));

        if (e.type === 'mousedown' || e.type === 'touchstart') {
            setIsDraggingProgress(true);
            videoRef.current.pause();
        }

        const newTime = pos * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressContainerRef.current) return;
        const rect = progressContainerRef.current.getBoundingClientRect();
        let pos = (e.clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));
        setHoverProgress(pos);
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            try {
                await containerRef.current.requestFullscreen();
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err);
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const val = parseFloat(e.target.value);
        videoRef.current.volume = val;
        videoRef.current.muted = val === 0;
        setVolume(val);
        setIsMuted(val === 0);
        localStorage.setItem("yt_player_volume", val.toString());
        localStorage.setItem("yt_player_muted", (val === 0).toString());
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);

        if (isMuted && volume === 0) {
            videoRef.current.volume = 1;
            setVolume(1);
            localStorage.setItem("yt_player_volume", "1");
        }
        localStorage.setItem("yt_player_muted", (!isMuted).toString());
    };

    const handleQualityChange = (val: string) => {
        if (!videoRef.current) return;
        const time = videoRef.current.currentTime;
        const wasPaused = videoRef.current.paused;

        setQuality(val);
        setShowSettings(false);
        setActiveSettingsMenu('main');

        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.currentTime = time;
                if (!wasPaused) {
                    videoRef.current.play();
                }
            }
        }, 100);
    };

    const handleSpeedChange = (speed: number) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = speed;
        setPlaybackSpeed(speed);
        setShowSettings(false);
        setActiveSettingsMenu('main');
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return "0:00";
        const h = Math.floor(timeInSeconds / 3600);
        const m = Math.floor((timeInSeconds % 3600) / 60);
        const s = Math.floor(timeInSeconds % 60);
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
    const progressPercent = (currentTime / (duration || 1)) * 100;
    const bufferPercent = (buffered / (duration || 1)) * 100;

    return (
        <div
            ref={containerRef}
            className="group font-sans"
            style={{
                position: 'relative',
                aspectRatio: '16/9',
                width: '100%',
                background: '#000',
                borderRadius: isFullscreen ? '0' : 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: isFullscreen ? 'none' : 'var(--shadow-lg)',
                userSelect: 'none',
            }}
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => {
                isHoveringVolume && setIsHoveringVolume(false);
                if (isPlaying && !showSettings && !isDraggingProgress) {
                    setShowControls(false);
                }
            }}
            onClick={() => {
                if (!showControls) resetControlsTimeout();
            }}
        >
            <video
                ref={videoRef}
                src={currentSrc}
                style={{ width: '100%', height: '100%', cursor: showControls ? 'default' : 'none' }}
                poster={poster}
                playsInline
                onClick={handleVideoClick}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlayPauseEvent}
                onPause={handlePlayPauseEvent}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
            />

            {/* Buffering Indicator */}
            {isBuffering && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                }}>
                    <Loader2 size={48} className="animate-spin text-white opacity-80" />
                </div>
            )}

            {/* Central Action Animation */}
            {centerAction.type && (
                <div
                    key={centerAction.id} // Re-trigger animation only on new action
                    className="yt-action-animation"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        width: '72px',
                        height: '72px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        pointerEvents: 'none',
                        zIndex: 15,
                    }}
                >
                    {centerAction.type === 'play' && <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
                    {centerAction.type === 'pause' && <Pause size={32} fill="currentColor" />}
                    {centerAction.type === 'ff' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>+10s</span>
                        </div>
                    )}
                    {centerAction.type === 'rw' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>-10s</span>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom Controls Bar */}
            <div
                className={`transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                    padding: '0 12px',
                    pointerEvents: showControls ? 'auto' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 20
                }}
            >
                {/* Custom Progress Bar (Scrubber) */}
                <div
                    ref={progressContainerRef}
                    className="yt-progress-container"
                    style={{
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        marginBottom: '-6px'
                    }}
                    onMouseDown={handleProgressScrub}
                    onTouchStart={handleProgressScrub}
                    onTouchMove={handleProgressScrub}
                    onMouseMove={handleProgressHover}
                    onMouseLeave={() => setHoverProgress(0)}
                >
                    {/* Track Background */}
                    <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)', transition: 'height 0.1s ease' }} className="yt-progress-track" />

                    {/* Hover Indicator */}
                    <div style={{ position: 'absolute', left: 0, width: `${hoverProgress * 100}%`, height: '3px', background: 'rgba(255,255,255,0.4)', transition: 'height 0.1s ease', pointerEvents: 'none' }} className="yt-progress-track" />

                    {/* Buffer Track */}
                    <div style={{ position: 'absolute', left: 0, width: `${bufferPercent}%`, height: '3px', background: 'rgba(255,255,255,0.4)', transition: 'height 0.1s ease, width 0.3s ease', pointerEvents: 'none' }} className="yt-progress-track" />

                    {/* Play progress Track */}
                    <div style={{ position: 'absolute', left: 0, width: `${progressPercent}%`, height: '3px', background: '#ff0000', transition: 'height 0.1s ease', pointerEvents: 'none' }} className="yt-progress-track yt-progress-filled" />

                    {/* Scrubber Knob */}
                    <div
                        className="yt-progress-knob"
                        style={{
                            position: 'absolute',
                            left: `${progressPercent}%`,
                            transform: 'translateX(-50%) scale(0)',
                            width: '13px',
                            height: '13px',
                            borderRadius: '50%',
                            background: '#ff0000',
                            transition: 'transform 0.1s ease',
                            pointerEvents: 'none'
                        }}
                    />
                </div>

                {/* Controls Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '48px' }}>
                    {/* Left Side Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button onClick={togglePlay} className="yt-icon-btn group/btn" aria-label={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <Pause size={24} fill="currentColor" strokeWidth={1.5} /> : <Play size={24} fill="currentColor" strokeWidth={1.5} />}
                        </button>

                        {/* Volume Control Container */}
                        <div
                            style={{ display: 'flex', alignItems: 'center' }}
                            onMouseEnter={() => setIsHoveringVolume(true)}
                            onMouseLeave={() => setIsHoveringVolume(false)}
                        >
                            <button onClick={toggleMute} className="yt-icon-btn" aria-label={isMuted ? "Unmute" : "Mute"}>
                                <VolumeIcon size={24} strokeWidth={2} />
                            </button>

                            <div
                                className="yt-volume-slider-container"
                                style={{
                                    width: isHoveringVolume ? '64px' : '0',
                                    opacity: isHoveringVolume ? 1 : 0,
                                    overflow: 'hidden',
                                    transition: 'width 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: isHoveringVolume ? '-4px' : '0'
                                }}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    style={{
                                        width: '60px',
                                        height: '3px',
                                        appearance: 'none',
                                        background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`,
                                        cursor: 'pointer',
                                    }}
                                    className="yt-volume-slider"
                                />
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div style={{ marginLeft: '12px', fontSize: '13px', color: '#ddd', userSelect: 'auto' }}>
                            <span style={{ color: 'white' }}>{formatTime(currentTime)}</span>
                            <span style={{ margin: '0 4px', opacity: 0.7 }}>/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Right Side Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>

                        {/* Settings Button & Menu */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => {
                                    setShowSettings(!showSettings);
                                    setActiveSettingsMenu('main');
                                }}
                                className={`yt-icon-btn transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`}
                                aria-label="Settings"
                            >
                                <Settings size={22} strokeWidth={2} />
                            </button>

                            {/* Settings Dropdown menu */}
                            {showSettings && (
                                <div className="animate-fade-in" style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    right: 12,
                                    marginBottom: '16px',
                                    width: '260px',
                                    background: 'rgba(28, 28, 28, 0.95)',
                                    borderRadius: '12px',
                                    padding: '8px 0',
                                    boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
                                    zIndex: 30,
                                    overflow: 'hidden'
                                }}>
                                    {activeSettingsMenu === 'main' && (
                                        <div className="animate-slide-left" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <button
                                                onClick={() => setActiveSettingsMenu('quality')}
                                                className="yt-menu-item"
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Settings size={18} />
                                                    <span>Quality</span>
                                                </div>
                                                <span className="yt-menu-value">
                                                    {RESOLUTIONS.find(r => r.value === quality)?.label}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSettingsMenu('speed')}
                                                className="yt-menu-item"
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <Play size={18} />
                                                    <span>Playback speed</span>
                                                </div>
                                                <span className="yt-menu-value">
                                                    {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {activeSettingsMenu === 'quality' && (
                                        <div className="animate-slide-right" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <button
                                                onClick={() => setActiveSettingsMenu('main')}
                                                className="yt-menu-header"
                                            >
                                                <span style={{ fontSize: '18px', marginRight: '8px' }}>←</span> Quality
                                            </button>
                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />
                                            {RESOLUTIONS.map((res) => (
                                                <button
                                                    key={res.value}
                                                    onClick={() => handleQualityChange(res.value)}
                                                    className="yt-menu-item"
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                                        <div style={{ width: '16px', display: 'flex', justifyContent: 'center' }}>
                                                            {quality === res.value && <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }} />}
                                                        </div>
                                                        <span style={{ fontWeight: quality === res.value ? 500 : 400 }}>{res.label}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {activeSettingsMenu === 'speed' && (
                                        <div className="animate-slide-right" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <button
                                                onClick={() => setActiveSettingsMenu('main')}
                                                className="yt-menu-header"
                                            >
                                                <span style={{ fontSize: '18px', marginRight: '8px' }}>←</span> Playback speed
                                            </button>
                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />
                                            {PLAYBACK_SPEEDS.map((speed) => (
                                                <button
                                                    key={speed}
                                                    onClick={() => handleSpeedChange(speed)}
                                                    className="yt-menu-item"
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                                                        <div style={{ width: '16px', display: 'flex', justifyContent: 'center' }}>
                                                            {playbackSpeed === speed && <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }} />}
                                                        </div>
                                                        <span style={{ fontWeight: playbackSpeed === speed ? 500 : 400 }}>
                                                            {speed === 1 ? 'Normal' : speed}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button onClick={toggleFullscreen} className="yt-icon-btn" aria-label="Fullscreen">
                            {isFullscreen ? <Minimize size={22} strokeWidth={2} /> : <Maximize size={22} strokeWidth={2} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Scoped CSS for YouTube-like specifics */}
            <style jsx>{`
                /* Progress bar hover effects */
                .yt-progress-container:hover .yt-progress-track {
                    height: 5px !important;
                }
                .yt-progress-container:hover .yt-progress-knob {
                    transform: translateX(-50%) scale(1) !important;
                }

                /* Icon buttons */
                .yt-icon-btn {
                    width: 46px;
                    height: 48px;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    opacity: 0.9;
                    transition: opacity 0.1s;
                }
                .yt-icon-btn:hover {
                    opacity: 1;
                }

                /* Menus */
                .yt-menu-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding: 10px 16px;
                    color: white;
                    font-size: 13px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                }
                .yt-menu-item:hover {
                    background: rgba(255,255,255,0.1);
                }
                .yt-menu-value {
                    color: rgba(255,255,255,0.7);
                    font-size: 12px;
                }
                .yt-menu-header {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 8px 16px;
                    color: white;
                    font-size: 14px;
                    font-weight: 500;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                }
                
                /* Animations */
                @keyframes yt-fade-out {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
                }
                .yt-action-animation {
                    animation: yt-fade-out 0.5s ease forwards;
                }

                @keyframes slideLeft {
                    from { transform: translateX(-10px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideRight {
                    from { transform: translateX(10px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-left { animation: slideLeft 0.2s ease forwards; }
                .animate-slide-right { animation: slideRight 0.2s ease forwards; }

                /* Volume Slider Thumb Override */
                .yt-volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                }
                .yt-volume-slider::-moz-range-thumb {
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
}
