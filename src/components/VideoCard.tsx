import Link from "next/link";
import Image from "next/image";
import { Play, Eye, Clock } from "lucide-react";
import { VideoMetadata } from "@/lib/videoService";

export default function VideoCard({ video }: { video: VideoMetadata }) {
    const createdDate = (() => {
        try {
            const d = video.createdAt?.toDate?.() || new Date(video.createdAt);
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

    return (
        <article className="card animate-fade-in" style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Thumbnail */}
            <Link href={`/video/${video.slug}`} style={{
                position: 'relative',
                aspectRatio: '16/9',
                overflow: 'hidden',
                display: 'block',
            }}>
                <Image
                    src={video.thumbnailUrl?.includes('via.placeholder.com') ? "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22640%22%20height%3D%22360%22%20viewBox%3D%220%200%20640%20360%22%3E%3Crect%20width%3D%22640%22%20height%3D%22360%22%20fill%3D%22%231f2937%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22180%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EVideo%20Link%3C%2Ftext%3E%3C%2Fsvg%3E" : video.thumbnailUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                        objectFit: 'cover',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="group-hover:scale-105"
                    priority={false}
                />
                {/* Play Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                }} className="group-hover:!opacity-100">
                    <div style={{
                        background: 'rgba(255,255,255,0.95)',
                        padding: '0.75rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    }}>
                        <Play size={22} fill="var(--accent)" color="var(--accent)" />
                    </div>
                </div>
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
                    <Link href={`/video/${video.slug}`} style={{
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                    }} className="line-clamp-2 hover:text-[var(--accent)]">
                        {video.title}
                    </Link>
                </h3>

                <p className="line-clamp-2" style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                }}>
                    {video.description}
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
                        <span>{video.views.toLocaleString()}</span>
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
