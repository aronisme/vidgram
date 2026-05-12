import React from 'react';
import { Calendar, User, ArrowLeft, Search, TrendingUp, Globe } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SEO for Video Platforms: How to Rank Your Videos on Google - Vidgram Guide",
  description: "Maximize your video visibility with our comprehensive SEO guide for video platforms and creators. Learn how to rank higher.",
};

export default function BlogPost() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '6rem' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9375rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Kembali ke Blog
      </Link>

      <header style={{ marginBottom: '4rem' }}>
        <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>SEO</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '2rem' }}>
          SEO untuk Platform Video: Cara Agar Video Anda Muncul di Google
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><Calendar size={18} /> 08 Mei 2026</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><User size={18} /> Vidgram Team</div>
        </div>
      </header>

      <div className="card" style={{ height: '400px', marginBottom: '4rem', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TrendingUp size={80} color="var(--accent)" style={{ opacity: 0.2 }} />
      </div>

      <article className="blog-content">
        <p>Membuat video yang hebat hanyalah separuh dari perjuangan. Separuh lainnya adalah memastikan orang dapat menemukannya. Inilah peran penting SEO (Search Engine Optimization) untuk video.</p>

        <h2>1. Gunakan Kata Kunci yang Tepat di Judul</h2>
        <p>Judul adalah faktor terpenting dalam SEO video. Gunakan alat riset kata kunci untuk menemukan apa yang dicari audiens Anda. Pastikan kata kunci utama berada di awal judul untuk dampak maksimal.</p>

        <h2>2. Optimalkan Meta Deskripsi</h2>
        <p>Deskripsi memberikan konteks lebih lanjut kepada mesin pencari tentang isi video Anda. Tulis deskripsi yang menarik (minimal 200 kata) dan sertakan kata kunci turunan secara alami.</p>

        <div className="card" style={{ padding: '2rem', margin: '3rem 0', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--accent)' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}><Search size={20} color="var(--accent)" /> Checklist SEO Video Cepat:</h4>
          <ul style={{ margin: 0 }}>
            <li>Judul mengandung kata kunci utama.</li>
            <li>Thumbnail menarik dengan rasio klik-tayang (CTR) tinggi.</li>
            <li>Nama file video mengandung kata kunci (misal: cara-seo-video.mp4).</li>
            <li>Gunakan tag video yang relevan.</li>
            <li>Tambahkan transkrip teks jika memungkinkan.</li>
          </ul>
        </div>

        <h2>3. Pentingnya Thumbnail</h2>
        <p>Meskipun secara teknis bukan faktor ranking langsung, thumbnail yang menarik meningkatkan CTR. Google melihat interaksi pengguna sebagai sinyal kualitas, sehingga CTR yang tinggi akan membantu video Anda naik peringkat.</p>

        <h2>4. Struktur Metadata Vidgram</h2>
        <p>Di Vidgram, kami secara otomatis mengoptimalkan struktur data (JSON-LD) untuk setiap video yang diunggah. Ini membantu Google menampilkan video Anda sebagai "Rich Snippets" di hasil pencarian, yang seringkali mendapatkan lebih banyak klik.</p>

        <p>Ingin video Anda lebih banyak ditonton? Mulai terapkan strategi ini sekarang dan lihat perbedaannya pada trafik Anda!</p>
      </article>
    </div>
  );
}
