"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { videoService } from "@/lib/videoService";

interface VideoActionsProps {
    videoId: string;
    videoTitle: string;
    videoUrl: string;
    initialLikes: number;
    uploaderId: string;
    uploaderName: string;
    uploaderAvatar: string;
    initialSubscribers: number;
}

export default function VideoActions({
    videoId,
    videoTitle,
    videoUrl,
    initialLikes,
    uploaderId,
    uploaderName,
    uploaderAvatar,
    initialSubscribers
}: VideoActionsProps) {
    const { user } = useAuth();
    const { addToast } = useToast();

    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribers, setSubscribers] = useState(initialSubscribers);
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        if (user && uploaderId) {
            videoService.checkSubscription(user.uid, uploaderId).then(setIsSubscribed);
        }
    }, [user, uploaderId]);

    const handleLike = async () => {
        if (!user) return addToast("Silakan login untuk menyukai video.", "error");
        if (isLiked) return;
        setIsLiked(true);
        setLikes(prev => prev + 1);
        await videoService.incrementLikes(videoId);
    };

    const handleSubscribe = async () => {
        if (!user) return addToast("Silakan login untuk subscribe.", "error");
        if (user.uid === uploaderId) return addToast("Anda tidak bisa subscribe channel sendiri.", "error");
        setIsSubscribing(true);
        try {
            const newStatus = await videoService.toggleSubscribe(user.uid, uploaderId);
            if (newStatus !== undefined) {
                setIsSubscribed(newStatus);
                setSubscribers(prev => newStatus ? prev + 1 : prev - 1);
            }
        } finally {
            setIsSubscribing(false);
        }
    };

    const copyToClipboard = async (text: string): Promise<boolean> => {
        // Try modern Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch {
                // Fall through to fallback
            }
        }
        // Fallback: textarea + execCommand for non-HTTPS or older browsers
        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            textarea.style.top = "-9999px";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(textarea);
            return ok;
        } catch {
            return false;
        }
    };

    const handleShare = async () => {
        const pageUrl = window.location.href;
        const shareData = {
            title: videoTitle,
            text: "Lihat video keren ini di Vidgram!",
            url: pageUrl,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                await videoService.incrementShares(videoId);
            } else {
                const copied = await copyToClipboard(pageUrl);
                if (copied) {
                    addToast("Link disalin ke clipboard!", "success");
                    await videoService.incrementShares(videoId);
                } else {
                    addToast("Gagal menyalin link.", "error");
                }
            }
        } catch (err: any) {
            // User cancelled the native share dialog — not an error
            if (err?.name === "AbortError") return;
            console.error("Error sharing:", err);
            addToast("Gagal membagikan link.", "error");
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border)',
        }}>
            {/* Uploader Row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                        src={uploaderAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                        alt={uploaderName}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            background: 'var(--bg-tertiary)',
                            border: '2px solid var(--border)',
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{uploaderName || "Unknown Creator"}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {subscribers.toLocaleString()} subscribers
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user?.uid !== uploaderId && (
                        <button
                            onClick={handleSubscribe}
                            disabled={isSubscribing}
                            className={isSubscribed ? "btn-secondary" : "btn-primary"}
                            style={{
                                padding: '0.5rem 1.25rem',
                                fontSize: '0.8125rem',
                            }}
                        >
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    )}
                </div>
            </div>

            {/* Actions Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'var(--bg-secondary)',
                padding: '0.25rem',
                borderRadius: 'var(--radius-full)',
                width: 'fit-content',
            }}>
                <button
                    onClick={handleLike}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        background: isLiked ? 'var(--accent-light)' : 'transparent',
                        color: isLiked ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                >
                    <ThumbsUp size={16} className={isLiked ? "fill-current" : ""} />
                    <span>{likes > 0 ? likes.toLocaleString() : "Like"}</span>
                </button>

                <div style={{ width: '1px', height: '1.5rem', background: 'var(--border)' }}></div>

                <button
                    onClick={handleShare}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                    }}
                >
                    <Share2 size={16} />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
}
