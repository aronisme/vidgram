import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, Images } from "lucide-react";
import { ServerImagePostMetadata } from "@/lib/serverImageService";

export default function ImagePostCard({ post }: { post: ServerImagePostMetadata }) {
    const createdDate = (() => {
        try {
            const d = new Date(post.createdAt);
            const now = new Date();
            const diff = now.getTime() - d.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            if (days === 0) return "Hari ini";
            if (days === 1) return "Kemarin";
            if (days < 7) return `${days} hari lalu`;
            if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return "Baru saja";
        }
    })();

    const firstImage = post.images[0]?.url || "";

    return (
        <article className="card animate-fade-in group" style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Thumbnail */}
            <Link href={`/image/${post.slug}`} style={{
                position: 'relative',
                aspectRatio: '1',
                overflow: 'hidden',
                display: 'block',
                background: '#f3f4f6'
            }}>
                {firstImage && (
                    <Image
                        src={firstImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                            objectFit: 'cover',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        className="group-hover:scale-105"
                        priority={false}
                    />
                )}
                
                {/* Multi-image indicator */}
                {post.images.length > 1 && (
                    <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        padding: '0.375rem 0.625rem',
                        borderRadius: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                        <Images size={14} />
                        {post.images.length}
                    </div>
                )}
            </Link>

            {/* Content */}
            <div style={{
                padding: '1rem 1.125rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                flex: 1,
            }}>
                <h3 style={{
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
                }}>
                    <Link href={`/image/${post.slug}`} style={{
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                    }} className="line-clamp-2 hover:text-[var(--accent)]">
                        {post.title}
                    </Link>
                </h3>

                <p className="line-clamp-2" style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                }}>
                    {post.description}
                </p>

                {/* Footer */}
                <div style={{
                    marginTop: 'auto',
                    paddingTop: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    fontWeight: 500,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Eye size={13} />
                        <span>{post.views?.toLocaleString() || 0}</span>
                    </div>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} />
                        <span>{createdDate}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
