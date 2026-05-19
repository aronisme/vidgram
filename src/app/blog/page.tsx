import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Vidgram Blog - Panduan, Tips & Pembaruan Produk",
  description: "Pelajari cara mendownload video TikTok, memperjelas resolusi video dengan AI lokal, dan mengoptimalkan konten video Anda.",
};

const posts = [
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
          Panduan ahli, berita industri, dan pembaruan produk dari tim Vidgram.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
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
