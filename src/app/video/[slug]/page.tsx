import { videoService } from "@/lib/videoService";
import { Metadata } from "next";
import { Eye, Calendar, Link2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import VideoActions from "@/components/VideoActions";
import VideoComments from "@/components/VideoComments";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const video = await videoService.getVideoBySlug(resolvedParams.slug);

    if (!video) {
        return {
            title: "Video Not Found | Vidgram",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.vercel.app';
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

    // Fetch current video and recent videos in parallel
    const [video, recentVideos] = await Promise.all([
        videoService.getVideoBySlug(resolvedParams.slug),
        videoService.getVideos(11) // Fetch 11 recent videos (to show 10 after filtering out current)
    ]);

    let uploaderProfile: any = null;
    if (video?.uploaderId) {
        uploaderProfile = await videoService.getUserProfile(video.uploaderId);
    }

    if (!video) {
        notFound();
    }

    // Increment views in the background
    if (video.id) {
        videoService.incrementViews(video.id).catch(console.error);
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.vercel.app';
    const createdAt = video.createdAt?.toDate?.() || new Date(video.createdAt);

    // JSON-LD VideoObject Schema for Google Rich Snippets
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: [video.thumbnailUrl],
        uploadDate: createdAt.toISOString(),
        contentUrl: video.videoUrl, // Direct link to video
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

    // Filter out the current video from the recent videos list
    const suggestedVideos = recentVideos.filter(v => v.id !== video.id).slice(0, 10);

    return (
        <div className="py-8 flex flex-col lg:flex-row gap-8">
            {/* Inject JSON-LD Schema for SEO Indexing */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6">
                <VideoPlayer src={video.videoUrl} poster={video.thumbnailUrl} />

                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{video.title}</h1>
                    <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
                        <div className="flex items-center gap-6 text-[var(--text-secondary)] text-sm font-medium">
                            <div className="flex items-center gap-1.5">
                                <Eye size={18} />
                                <span>{video.views.toLocaleString()} views</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={18} />
                                <span>{createdAt.toLocaleDateString()}</span>
                            </div>
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

                    <div className="py-4 border-b border-[var(--border)]">
                        <h3 className="font-bold mb-2">Description</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            {video.description}
                        </p>
                    </div>

                    <VideoComments videoId={video.id!} />
                </div>
            </div>

            {/* Sidebar - Up Next */}
            <div className="lg:w-80 flex flex-col gap-4">
                <h2 className="font-bold text-lg">Up Next</h2>
                {suggestedVideos.length > 0 ? (
                    suggestedVideos.map((suggestedVideo) => (
                        <a href={`/video/${suggestedVideo.slug}`} key={suggestedVideo.id} className="flex gap-3 group cursor-pointer">
                            <div className="w-32 aspect-video glass rounded-md overflow-hidden flex-shrink-0 relative">
                                <img src={suggestedVideo.thumbnailUrl} alt={suggestedVideo.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-[var(--accent)] transition-colors">
                                    {suggestedVideo.title}
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    {suggestedVideo.views.toLocaleString()} views
                                </p>
                            </div>
                        </a>
                    ))
                ) : (
                    <p className="text-sm text-[var(--text-secondary)]">Koleksi video lainnya belum tersedia.</p>
                )}
            </div>
        </div>
    );
}
