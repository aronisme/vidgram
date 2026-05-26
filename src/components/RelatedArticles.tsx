import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedArticle {
  title: string;
  slug: string;
  category: string;
}

// Master list of all blog posts for cross-referencing
const allPosts: RelatedArticle[] = [
  { title: "How to Download TikTok Videos Without Watermark in HD (Free, 2026)", slug: "free-tiktok-video-downloader-no-watermark-hd", category: "TikTok" },
  { title: "Instagram Downloader: Save Reels, Videos & Photos in HD (Free, 2026)", slug: "instagram-downloader-save-reels-videos-photos-hd", category: "Instagram" },
  { title: "Free AI Video Upscaler: Enhance Blurry Videos to 4K Without Uploading", slug: "free-ai-video-upscaler-enhance-to-4k-no-upload", category: "AI Tools" },
  { title: "Dark AI: Free AI Chatbot for Coding, Writing & Creative Ideas", slug: "dark-ai-free-chatbot-coding-writing-creative", category: "AI Tools" },
  { title: "10 Best TikTok Downloaders in 2026 (No Watermark)", slug: "best-tiktok-downloaders-2026", category: "Guides" },
  { title: "Best Instagram Downloaders 2026: Top 10 Tools Compared", slug: "best-instagram-downloaders-2026-top-10-compared", category: "Instagram" },
  { title: "TikTok to MP3 Converter: Extract Audio from Any TikTok Video Free", slug: "tiktok-to-mp3-converter-extract-audio-free", category: "TikTok" },
  { title: "How to Download TikTok Videos on PC, Mac, iPhone & Android", slug: "download-tiktok-videos-pc-mac-iphone-android", category: "TikTok" },
  { title: "Is It Legal to Download TikTok & Instagram Videos? (2026 Guide)", slug: "is-it-legal-to-download-tiktok-instagram-videos", category: "Guides" },
  { title: "WebGPU vs Cloud Upscaling: Performance & Security Analysis", slug: "webgpu-vs-cloud-upscaling", category: "Technology" },
  { title: "How to Upscale Videos to 4K Free Without Upload (WebGPU)", slug: "how-to-upscale-videos-4k-ai", category: "AI Tools" },
  { title: "SEO for Video Platforms: How to Rank Your Videos on Google", slug: "seo-for-video-platforms-ranking-guide", category: "SEO" },
];

interface RelatedArticlesProps {
  currentSlug: string;
  maxItems?: number;
}

export default function RelatedArticles({ currentSlug, maxItems = 4 }: RelatedArticlesProps) {
  const current = allPosts.find(p => p.slug === currentSlug);
  if (!current) return null;

  // Prioritize same-category posts, then fill with others
  const sameCat = allPosts.filter(p => p.slug !== currentSlug && p.category === current.category);
  const otherCat = allPosts.filter(p => p.slug !== currentSlug && p.category !== current.category);
  const related = [...sameCat, ...otherCat].slice(0, maxItems);

  if (related.length === 0) return null;

  return (
    <section style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Related Articles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card"
            style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
          >
            <span className="badge badge-accent" style={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}>{post.category}</span>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.35, margin: 0 }}>{post.title}</h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
              Read Article <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
