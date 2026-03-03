"use client";

import { useState, useEffect } from "react";
import { Send, MessageCircle, Reply, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { videoService, VideoComment } from "@/lib/videoService";

interface VideoCommentsProps {
    videoId: string;
}

export default function VideoComments({ videoId }: VideoCommentsProps) {
    const { user, dbUser } = useAuth();
    const { addToast } = useToast();

    const [comments, setComments] = useState<VideoComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const fetchComments = async () => {
        try {
            const fetchedComments = await videoService.getComments(videoId);
            setComments(fetchedComments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault();
        if (!user || !dbUser) {
            addToast("Silakan login untuk berkomentar.", "error");
            return;
        }

        const text = parentId ? replyText : newComment;
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            await videoService.addComment({
                videoId,
                userId: user.uid,
                userName: dbUser.displayName || "Anonymous",
                userAvatar: dbUser.photoURL || "",
                text: text.trim(),
                parentId
            });

            if (parentId) {
                setReplyText("");
                setReplyingTo(null);
            } else {
                setNewComment("");
            }

            addToast("Komentar berhasil ditambahkan!", "success");
            await fetchComments(); // Refresh list
        } catch (error: any) {
            console.error("Error adding comment:", error);
            addToast("Gagal menambahkan komentar.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Organize comments into threads
    const topLevelComments = comments.filter(c => !c.parentId);
    const replies = comments.filter(c => c.parentId);

    const getRepliesFor = (commentId: string) => {
        return replies.filter(r => r.parentId === commentId).sort((a, b) => {
            // Sort replies chronological (oldest first)
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateA - dateB;
        });
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Baru saja";
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
            return new Intl.RelativeTimeFormat('id', { numeric: 'auto' }).format(
                Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 'day'
            );
        } catch {
            return "Beberapa waktu lalu";
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <MessageCircle size={24} />
                {comments.length} Komentar
            </h3>

            {/* Main Comment Input */}
            <form onSubmit={(e) => handleAddComment(e, null)} className="flex gap-4 mb-10">
                <div className="shrink-0">
                    {dbUser?.photoURL ? (
                        <img src={dbUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full object-cover bg-white" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--accent)]">
                            <UserIcon size={20} />
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder={user ? "Tambahkan komentar..." : "Login untuk berkomentar..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!user || isSubmitting}
                        className="glass bg-transparent p-3 rounded-[var(--radius-md)] outline-none border-b-2 border-transparent focus:border-[var(--accent)] transition-colors w-full"
                    />
                    {newComment.trim() && (
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setNewComment("")}
                                className="px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[var(--accent)] text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                <Send size={16} /> Comment
                            </button>
                        </div>
                    )}
                </div>
            </form>

            {/* Comment List */}
            <div className="flex flex-col gap-6">
                {topLevelComments.map(comment => (
                    <div key={comment.id!} className="flex gap-4">
                        <img
                            src={comment.userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                            alt={comment.userName}
                            className="w-10 h-10 rounded-full object-cover shrink-0 bg-white"
                        />
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-sm">{comment.userName}</span>
                                <span className="text-xs text-[var(--text-secondary)]">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm pb-1">{comment.text}</p>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id!)}
                                    className="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors py-1"
                                >
                                    <Reply size={14} /> Balas
                                </button>
                            </div>

                            {/* Reply Input Box */}
                            {replyingTo === comment.id && (
                                <form onSubmit={(e) => handleAddComment(e, comment.id!)} className="flex gap-3 mt-3 mb-2">
                                    <img
                                        src={dbUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                        alt="Avatar"
                                        className="w-6 h-6 rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex-1 flex flex-col gap-2">
                                        <input
                                            type="text"
                                            placeholder="Tulis balasan..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            autoFocus
                                            className="glass bg-transparent px-3 py-1.5 text-sm rounded-[var(--radius-md)] outline-none focus:border-[var(--accent)] transition-colors w-full"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setReplyingTo(null)}
                                                className="px-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-medium"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !replyText.trim()}
                                                className="bg-[var(--accent)] text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity text-xs font-medium disabled:opacity-50"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Nested Replies */}
                            <div className="flex flex-col gap-4 mt-3 pl-2 sm:pl-4 border-l-2 border-[var(--border)]">
                                {getRepliesFor(comment.id!).map(reply => (
                                    <div key={reply.id!} className="flex gap-3">
                                        <img
                                            src={reply.userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                            alt={reply.userName}
                                            className="w-8 h-8 rounded-full object-cover shrink-0 bg-white"
                                        />
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-[13px]">{reply.userName}</span>
                                                <span className="text-[11px] text-[var(--text-secondary)]">{formatDate(reply.createdAt)}</span>
                                            </div>
                                            <p className="text-[13px]">{reply.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {comments.length === 0 && (
                <div className="text-center py-8 border-t border-[var(--border)] text-[var(--text-secondary)]">
                    <p>Belum ada komentar. Jadilah yang pertama!</p>
                </div>
            )}
        </div>
    );
}
