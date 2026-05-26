import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Vidgram Blog - Guides, Tips & Product Updates",
  description: "Learn how to download TikTok and Instagram videos, upscale videos to 4K with AI, use Dark AI chatbot, and optimize your content for maximum reach.",
};

const posts = [
  {
    title: "How to Download TikTok Videos Without Watermark in HD (Free, 2026)",
    slug: "free-tiktok-video-downloader-no-watermark-hd",
    excerpt: "The complete guide to downloading TikTok videos without watermark in full HD quality. Free, fast, and ad-free with Vidgram.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "TikTok"
  },
  {
    title: "Instagram Downloader: Save Reels, Videos & Photos in HD (Free, 2026)",
    slug: "instagram-downloader-save-reels-videos-photos-hd",
    excerpt: "Download Instagram Reels, videos, stories, and photos in HD quality. No login required. The fastest IG downloader available.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "Instagram"
  },
  {
    title: "Free AI Video Upscaler: Enhance Blurry Videos to 4K Without Uploading",
    slug: "free-ai-video-upscaler-enhance-to-4k-no-upload",
    excerpt: "Upscale videos to 4K using AI — 100% locally in your browser via WebGPU. No upload, no server, complete privacy. The best free video enhancer.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "AI Tools"
  },
  {
    title: "Dark AI: Free AI Chatbot for Coding, Writing & Creative Ideas",
    slug: "dark-ai-free-chatbot-coding-writing-creative",
    excerpt: "Meet Dark AI — Vidgram's free AI assistant for coding, writing, brainstorming, and content strategy. No sign-up required.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "AI Tools"
  },
  {
    title: "Best Instagram Downloaders 2026: Top 10 Tools Compared",
    slug: "best-instagram-downloaders-2026-top-10-compared",
    excerpt: "We tested dozens of Instagram downloaders and ranked the top 10 by speed, quality, safety, and features. See which tool came out on top.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "Instagram"
  },
  {
    title: "TikTok to MP3 Converter: Extract Audio from Any TikTok Video Free",
    slug: "tiktok-to-mp3-converter-extract-audio-free",
    excerpt: "Convert TikTok videos to MP3 audio files for free. Save trending sounds, music, and voiceovers. No app needed.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "TikTok"
  },
  {
    title: "How to Download TikTok Videos on PC, Mac, iPhone & Android",
    slug: "download-tiktok-videos-pc-mac-iphone-android",
    excerpt: "Device-specific step-by-step guide for downloading TikTok videos on every platform. Windows, macOS, iOS, and Android covered.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "TikTok"
  },
  {
    title: "Is It Legal to Download TikTok & Instagram Videos? (2026 Guide)",
    slug: "is-it-legal-to-download-tiktok-instagram-videos",
    excerpt: "Comprehensive legal guide covering copyright law, fair use, platform ToS, and practical guidelines for downloading social media content.",
    date: "May 27, 2026",
    author: "Vidgram Team",
    category: "Legal Guide"
  },
  {
    title: "10 Best TikTok Downloaders in 2026 (No Watermark)",
    slug: "best-tiktok-downloaders-2026",
    excerpt: "Looking for the best way to save TikTok videos without watermarks? We've tested and ranked the top 10 tools for 2026.",
    date: "May 12, 2026",
    author: "Vidgram Team",
    category: "Guides"
  },
  {
    title: "WebGPU vs Cloud Upscaling: Analisis Performa & Keamanan",
    slug: "webgpu-vs-cloud-upscaling",
    excerpt: "Analisis lengkap mengapa memproses video upscaling secara lokal via WebGPU jauh lebih baik, hemat kuota, dan aman privasinya dibanding cloud.",
    date: "May 20, 2026",
    author: "Tim Teknikal Vidgram",
    category: "Edukasi Teknologi"
  },
  {
    title: "Cara Upscale Video Gratis Tanpa Upload (WebGPU Lokal)",
    slug: "how-to-upscale-videos-4k-ai",
    excerpt: "Panduan lengkap perjelas video buram dan upscale klip pendek ke 2K/4K langsung di browser menggunakan laptop spek pas-pasan.",
    date: "May 10, 2026",
    author: "Tim Vidgram",
    category: "Panduan AI"
  },
  {
    title: "SEO for Video Platforms: How to Rank Your Videos on Google",
    slug: "seo-for-video-platforms-ranking-guide",
    excerpt: "Maximize your video visibility with our comprehensive SEO guide for video platforms and creators.",
    date: "May 08, 2026",
    author: "Vidgram Team",
    category: "SEO"
  }
];

export default function BlogPage() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Vidgram <span style={{ color: 'var(--accent)' }}>Blog</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Expert guides, industry news, and product updates from the Vidgram team.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '2.5rem' }}>
        {posts.map((post) => (
          <article key={post.slug} className="card stagger-item" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>{post.category}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
                <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.8125rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {post.date}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} /> {post.author}</div>
              </div>
            </div>
            <Link href={`/blog/${post.slug}`} className="blog-card-link">
              Read Article <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
