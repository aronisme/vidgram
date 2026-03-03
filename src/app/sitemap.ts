import { MetadataRoute } from 'next';
import { videoService } from '@/lib/videoService';

// We fetch the dynamic videos and build the sitemap
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidgram.vercel.app'; // Replace with real domain when live

    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${baseUrl}/discovery`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9,
        },
    ];

    // 2. Dynamic Video Routes
    let dynamicRoutes: MetadataRoute.Sitemap = [];

    try {
        // Fetch ALL videos (or paginated if the site grows to 50k+ videos)
        // Here we fetch up to 1000 latest for the sitemap to prevent timeout
        const videos = await videoService.getVideos(1000);

        dynamicRoutes = videos.map((video) => ({
            url: `${baseUrl}/video/${video.slug}`,
            lastModified: (video.createdAt as any)?.toDate ? (video.createdAt as any).toDate() : new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Failed to generate video sitemap routes", e);
    }

    return [...staticRoutes, ...dynamicRoutes];
}
