import { serverImageService } from "@/lib/serverImageService";
import { serverVideoService } from "@/lib/serverVideoService";
import { Metadata } from "next";
import { Eye, Calendar, Images } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import { notFound } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await serverImageService.getImagePostBySlug(resolvedParams.slug);

    if (!post) {
        return {
            title: "Image Not Found | Vidgram",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.web.id';
    const postUrl = `${baseUrl}/image/${post.slug}`;

    return {
        title: `${post.title} | Vidgram`,
        description: post.description,
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url: postUrl,
            siteName: 'Vidgram',
            images: [
                {
                    url: post.images[0]?.url || "",
                    width: 1200,
                    height: 1200,
                    alt: post.title,
                }
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: [post.images[0]?.url || ""],
        },
    };
}

export default async function ImagePostDetailPage({ params }: Props) {
    const resolvedParams = await params;

    const [post, recentPosts] = await Promise.all([
        serverImageService.getImagePostBySlug(resolvedParams.slug),
        serverImageService.getPublicImagePosts(11)
    ]);

    let uploaderProfile: any = null;
    if (post?.uploaderId) {
        uploaderProfile = await serverVideoService.getUserProfile(post.uploaderId);
    }

    if (!post) {
        notFound();
    }

    if (post.id) {
        serverImageService.incrementViews(post.id).catch(console.error);
    }

    const createdAt = new Date(post.createdAt);
    const suggestedPosts = recentPosts.filter(p => p.id !== post.id).slice(0, 10);

    return (
        <div className="animate-fade-in video-detail-layout" style={{
            paddingTop: '1.5rem',
            paddingBottom: '2rem',
        }}>
            {/* Main Content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Carousel & Lightbox/Zoom UI */}
                <ImageGallery images={post.images} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        lineHeight: 1.25,
                        letterSpacing: '-0.02em',
                    }}>
                        {post.title}
                    </h1>

                    {/* Stats Row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        color: 'var(--text-tertiary)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Eye size={15} />
                            <span>{post.views?.toLocaleString() || 0} views</span>
                        </div>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar size={15} />
                            <span>{createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
                            <Images size={14} />
                            <span>{post.images.length} Gambar</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{
                        padding: '1.25rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                    }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Description</h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: 1.7,
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                        }}>
                            {post.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar - Up Next */}
            <div className="video-sidebar">
                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Album Lainnya</h2>

                {suggestedPosts.length > 0 ? (
                    suggestedPosts.map((suggested) => (
                        <Link
                            href={`/image/${suggested.slug}`}
                            key={suggested.id}
                            className="sidebar-link"
                            style={{
                                display: 'flex',
                                gap: '0.75rem',
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'background 0.15s ease',
                            }}
                        >
                            <div style={{
                                width: '100px',
                                aspectRatio: '1',
                                borderRadius: 'var(--radius-sm)',
                                overflow: 'hidden',
                                flexShrink: 0,
                                position: 'relative',
                                background: '#f3f4f6',
                            }}>
                                <img
                                    src={suggested.images[0]?.url}
                                    alt={suggested.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
                                <h4 className="line-clamp-2" style={{
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    lineHeight: 1.35,
                                }}>
                                    {suggested.title}
                                </h4>
                                <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                                    {suggested.views?.toLocaleString() || 0} views
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                        Belum ada album lain.
                    </p>
                )}
            </div>
        </div>
    );
}
