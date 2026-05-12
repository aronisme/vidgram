import { serverVideoService } from "@/lib/serverVideoService";
import { Metadata } from "next";
import { Eye, Calendar } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import VideoActions from "@/components/VideoActions";
import VideoComments from "@/components/VideoComments";
import { notFound } from "next/navigation";

// Force dynamic rendering — data is always fresh from Firestore
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const video = await serverVideoService.getVideoBySlug(resolvedParams.slug);

    if (!video) {
        return {
            title: "Video Not Found | Vidgram",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.web.id';
    const videoUrl = `${baseUrl}/video/${video.slug}`;

    return {
        title: `${video.title} | Vidgram`,
        description: video.description,
        alternates: {
            canonical: videoUrl,
        },
        openGraph: {
            title: video.title,
            description: video.description,
            url: videoUrl,
            siteName: 'Vidgram',
            images: [
                {
                    url: video.thumbnailUrl,
                    width: 1280,
                    height: 720,
                    alt: video.title,
                }
            ],
            type: "video.other",
        },
        twitter: {
            card: "summary_large_image",
            title: video.title,
            description: video.description,
            images: [video.thumbnailUrl],
        },
    };
}

export default async function VideoDetailPage({ params }: Props) {
    const resolvedParams = await params;

    const [video, recentVideos] = await Promise.all([
        serverVideoService.getVideoBySlug(resolvedParams.slug),
        serverVideoService.getVideos(11)
    ]);

    let uploaderProfile: any = null;
    if (video?.uploaderId) {
        uploaderProfile = await serverVideoService.getUserProfile(video.uploaderId);
    }

    if (!video) {
        notFound();
    }

    if (video.id) {
        serverVideoService.incrementViews(video.id).catch(console.error);
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.web.id';
    const createdAt = new Date(video.createdAt);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: [video.thumbnailUrl],
        uploadDate: createdAt.toISOString(),
        contentUrl: video.videoUrl,
        embedUrl: `${baseUrl}/video/${video.slug}`,
        interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: { '@type': 'WatchAction' },
            userInteractionCount: video.views
        },
        publisher: {
            '@type': 'Organization',
            name: 'Vidgram',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`
            }
        }
    };

    const suggestedVideos = recentVideos.filter(v => v.id !== video.id).slice(0, 10);

    return (
        <div className="animate-fade-in video-detail-layout" style={{
            paddingTop: '1.5rem',
            paddingBottom: '2rem',
        }}>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Main Content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        lineHeight: 1.25,
                        letterSpacing: '-0.02em',
                    }}>
                        {video.title}
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
                            <span>{video.views.toLocaleString()} views</span>
                        </div>
                        <span style={{ opacity: 0.4 }}>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar size={15} />
                            <span>{createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <VideoActions
                        videoId={video.id!}
                        videoTitle={video.title}
                        videoUrl={video.videoUrl}
                        initialLikes={video.likes || 0}
                        uploaderId={video.uploaderId}
                        uploaderName={uploaderProfile?.displayName || "Unknown Creator"}
                        uploaderAvatar={uploaderProfile?.photoURL || ""}
                        initialSubscribers={uploaderProfile?.subscribersCount || 0}
                    />

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
                            {video.description}
                        </p>
                    </div>

                    <VideoComments videoId={video.id!} />
                </div>
            </div>

            {/* Sidebar - Up Next */}
            <div className="video-sidebar">
                <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Up Next</h2>

                {suggestedVideos.length > 0 ? (
                    suggestedVideos.map((suggestedVideo) => (
                        <a
                            href={`/video/${suggestedVideo.slug}`}
                            key={suggestedVideo.id}
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
                                width: '140px',
                                aspectRatio: '16/9',
                                borderRadius: 'var(--radius-sm)',
                                overflow: 'hidden',
                                flexShrink: 0,
                                position: 'relative',
                                background: '#000',
                            }}>
                                <img
                                    src={suggestedVideo.thumbnailUrl}
                                    alt={suggestedVideo.title}
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
                                    {suggestedVideo.title}
                                </h4>
                                <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                                    {suggestedVideo.views.toLocaleString()} views
                                </p>
                            </div>
                        </a>
                    ))
                ) : (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                        No suggested videos available.
                    </p>
                )}
            </div>
        </div>
    );
}
