"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, Share2, Facebook, Twitter, User as UserIcon } from "lucide-react";
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
    const [isLiked, setIsLiked] = useState(false); // In real app, fetch from user's 'liked_videos' subcollection

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
        if (isLiked) return; // Prevent double like for simple demo

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

    const handleShare = async () => {
        const shareData = {
            title: videoTitle,
            text: "Lihat video keren ini di Vidgram!",
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                await videoService.incrementShares(videoId);
            } else {
                navigator.clipboard.writeText(window.location.href);
                addToast("Link disalin ke clipboard!", "success");
                await videoService.incrementShares(videoId);
            }
        } catch (err) {
            console.error("Error sharing:", err);
            addToast("Gagal membagikan link.", "error");
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[var(--border)] gap-6">
            {/* Uploader Info */}
            <div className="flex items-center gap-4">
                <img
                    src={uploaderAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                    alt={uploaderName}
                    className="w-12 h-12 rounded-full object-cover bg-white"
                />
                <div className="flex flex-col">
                    <span className="font-bold">{uploaderName || "Unknown Creator"}</span>
                    <span className="text-xs text-[var(--text-secondary)]">{subscribers.toLocaleString()} subscribers</span>
                </div>
                {user?.uid !== uploaderId && (
                    <button
                        onClick={handleSubscribe}
                        disabled={isSubscribing}
                        className={`ml-4 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${isSubscribed ? 'glass text-[var(--text-secondary)]' : 'bg-white text-black dark:bg-black dark:text-white'}`}
                    >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 bg-[var(--bg-secondary)] p-1 rounded-full w-full sm:w-auto overflow-x-auto justify-start sm:justify-end">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isLiked ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                    <ThumbsUp size={18} className={isLiked ? "fill-current" : ""} />
                    <span className="font-medium text-sm">{likes > 0 ? likes.toLocaleString() : "Like"}</span>
                </button>
                <div className="w-px h-6 bg-[var(--border)]"></div>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    <Share2 size={18} />
                    <span className="font-medium text-sm">Share</span>
                </button>
            </div>
        </div>
    );
}
