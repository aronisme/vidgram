import { MetadataRoute } from 'next';
import { serverVideoService } from '@/lib/serverVideoService';
import { serverImageService } from '@/lib/serverImageService';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vidgram.web.id';

  // --- 1. Static pages ---
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tiktok-downloader`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instagram-downloader`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-video-upscaler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/discovery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dark-ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/flow-downloader`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/smart-keywords`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // --- 2. Blog pages ---
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/free-tiktok-video-downloader-no-watermark-hd`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/instagram-downloader-save-reels-videos-photos-hd`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/free-ai-video-upscaler-enhance-to-4k-no-upload`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/dark-ai-free-chatbot-coding-writing-creative`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/best-instagram-downloaders-2026-top-10-compared`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/tiktok-to-mp3-converter-extract-audio-free`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/download-tiktok-videos-pc-mac-iphone-android`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/is-it-legal-to-download-tiktok-instagram-videos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/best-tiktok-downloaders-2026`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/how-to-upscale-videos-4k-ai`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/seo-for-video-platforms-ranking-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/webgpu-vs-cloud-upscaling`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // --- 3. Dynamic video pages from Firebase ---
  let videoPages: MetadataRoute.Sitemap = [];
  try {
    const videos = await serverVideoService.getVideos(1000);
    videoPages = videos
      .filter((v) => v.slug)
      .map((video) => ({
        url: `${baseUrl}/video/${video.slug}`,
        lastModified: video.createdAt ? new Date(video.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (e) {
    console.error('[sitemap] Failed to fetch videos from Firebase:', e);
  }

  // --- 4. Dynamic image post pages from Firebase ---
  let imagePages: MetadataRoute.Sitemap = [];
  try {
    const images = await serverImageService.getPublicImagePosts(1000);
    imagePages = images
      .filter((img) => img.slug)
      .map((image) => ({
        url: `${baseUrl}/image/${image.slug}`,
        lastModified: image.createdAt ? new Date(image.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
  } catch (e) {
    console.error('[sitemap] Failed to fetch image posts from Firebase:', e);
  }

  return [...staticPages, ...blogPages, ...videoPages, ...imagePages];
}
