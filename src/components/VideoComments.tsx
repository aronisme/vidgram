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

            addToast("Comment added successfully!", "success");
            await fetchComments();
        } catch (error: any) {
            console.error("Error adding comment:", error);
            addToast("Failed to add comment.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const topLevelComments = comments.filter(c => !c.parentId);
    const replies = comments.filter(c => c.parentId);

    const getRepliesFor = (commentId: string) => {
        return replies.filter(r => r.parentId === commentId).sort((a, b) => {
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
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
            }}>
                <MessageCircle size={20} />
                {comments.length} Comments
            </h3>

            {/* Main Comment Input */}
            <form onSubmit={(e) => handleAddComment(e, null)} style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '2rem',
            }}>
                <div style={{ flexShrink: 0 }}>
                    {dbUser?.photoURL ? (
                        <img src={dbUser.photoURL} alt="Avatar" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            background: 'var(--bg-tertiary)',
                        }} />
                    ) : (
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--bg-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent)',
                        }}>
                            <UserIcon size={18} />
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder={user ? "Add a comment..." : "Sign in to comment..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!user || isSubmitting}
                        style={{
                            width: '100%',
                            padding: '0.75rem 0',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '2px solid var(--border)',
                            outline: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '0.9375rem',
                            transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderBottomColor = 'var(--border)'}
                    />
                    {newComment.trim() && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setNewComment("")}
                                className="btn-ghost"
                                style={{ fontSize: '0.8125rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
                                style={{ padding: '0.375rem 1rem', fontSize: '0.8125rem' }}
                            >
                                <Send size={14} /> Comment
                            </button>
                        </div>
                    )}
                </div>
            </form>

            {/* Comment List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {topLevelComments.map(comment => (
                    <div key={comment.id!} style={{ display: 'flex', gap: '0.75rem' }} className="animate-fade-in">
                        <img
                            src={comment.userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                            alt={comment.userName}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                flexShrink: 0,
                                background: 'var(--bg-tertiary)',
                            }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{comment.userName}</span>
                                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{formatDate(comment.createdAt)}</span>
                            </div>
                            <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{comment.text}</p>

                            <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id!)}
                                className="btn-ghost"
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.75rem',
                                    width: 'fit-content',
                                    marginTop: '0.125rem',
                                }}
                            >
                                <Reply size={13} /> Reply
                            </button>

                            {/* Reply Input */}
                            {replyingTo === comment.id && (
                                <form onSubmit={(e) => handleAddComment(e, comment.id!)} style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    marginTop: '0.5rem',
                                    alignItems: 'flex-start',
                                }}>
                                    <img
                                        src={dbUser?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                        alt="Avatar"
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Tulis balasan..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0',
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: '1.5px solid var(--accent)',
                                                outline: 'none',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.8125rem',
                                            }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                                            <button type="button" onClick={() => setReplyingTo(null)} className="btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={isSubmitting || !replyText.trim()} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Nested Replies */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.875rem',
                                marginTop: '0.75rem',
                                paddingLeft: '0.75rem',
                                borderLeft: '2px solid var(--accent-light)',
                            }}>
                                {getRepliesFor(comment.id!).map(reply => (
                                    <div key={reply.id!} style={{ display: 'flex', gap: '0.5rem' }}>
                                        <img
                                            src={reply.userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                            alt={reply.userName}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                flexShrink: 0,
                                                background: 'var(--bg-tertiary)',
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{reply.userName}</span>
                                                <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>{formatDate(reply.createdAt)}</span>
                                            </div>
                                            <p style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>{reply.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {comments.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '2.5rem 1rem',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.9375rem',
                }}>
                    <MessageCircle size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
    );
}
