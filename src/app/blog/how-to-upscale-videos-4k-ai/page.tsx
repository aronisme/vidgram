import React from 'react';
import { Calendar, User, ArrowLeft, Zap, Sparkles, Monitor } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "How to Upscale Videos to 4K Using AI - Vidgram Guide",
  description: "Discover how AI-powered upscaling can breathe new life into your old low-resolution videos. Step-by-step guide using Vidgram's AI tools.",
};

export default function BlogPost() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '6rem' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9375rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Kembali ke Blog
      </Link>

      <header style={{ marginBottom: '4rem' }}>
        <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>AI Tools</div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '2rem' }}>
          Cara Upscale Video ke 4K Menggunakan AI - Panduan Lengkap
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><Calendar size={18} /> 10 Mei 2026</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><User size={18} /> Vidgram Team</div>
        </div>
      </header>

      <div className="card" style={{ height: '400px', marginBottom: '4rem', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles size={80} color="var(--accent)" style={{ opacity: 0.2 }} />
      </div>

      <article className="blog-content">
        <p>Apakah Anda memiliki video lama dengan resolusi rendah yang terlihat buram di layar modern? Dengan kemajuan kecerdasan buatan (AI), kini Anda dapat meningkatkan kualitas video tersebut hingga resolusi 4K dengan detail yang menakjubkan.</p>

        <h2>Apa itu AI Video Upscaling?</h2>
        <p>AI Video Upscaling adalah proses meningkatkan resolusi video menggunakan algoritma *deep learning*. Berbeda dengan metode *interpolation* tradisional yang hanya meregangkan piksel, AI mampu "menebak" dan merekonstruksi detail yang hilang berdasarkan jutaan pola yang telah dipelajarinya.</p>

        <div className="card" style={{ padding: '2rem', margin: '3rem 0', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--accent)' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}><Zap size={20} color="var(--accent)" /> Keuntungan Menggunakan AI Upscaler:</h4>
          <ul style={{ margin: 0 }}>
            <li>Menghilangkan *noise* dan artefak kompresi.</li>
            <li>Mempertajam tepian objek tanpa terlihat berlebihan.</li>
            <li>Meningkatkan kejernihan tekstur (rambut, kulit, kain).</li>
            <li>Membuat video lama layak ditonton di TV 4K terbaru.</li>
          </ul>
        </div>

        <h2>Langkah demi Langkah Menggunakan Vidgram AI Upscaler</h2>
        <p>Vidgram menyediakan alat Upscale Video yang berjalan langsung di browser Anda menggunakan teknologi WebGPU. Berikut caranya:</p>
        
        <ol>
          <li><strong>Buka Alat Upscaler:</strong> Kunjungi halaman <Link href="/upscaler">AI Video Upscaler</Link> di Vidgram.</li>
          <li><strong>Unggah Video:</strong> Pilih file video dari perangkat Anda. Kami mendukung format MP4, WebM, dan lainnya.</li>
          <li><strong>Pilih Model AI:</strong> Pilih model 'Standard' untuk hasil natural atau 'Ultra' untuk detail maksimal.</li>
          <li><strong>Proses dan Unduh:</strong> Klik tombol 'Start Upscaling'. Setelah selesai, Anda dapat langsung mengunduh hasilnya.</li>
        </ol>

        <h2>Tips Mendapatkan Hasil Terbaik</h2>
        <p>Meskipun AI sangat canggih, kualitas input tetap berpengaruh. Gunakan video dengan *noise* minimal dan pastikan pencahayaan dalam video asli cukup baik untuk hasil rekonstruksi yang optimal.</p>

        <p>Mulai tingkatkan kualitas koleksi video Anda hari ini dengan <Link href="/upscaler">Vidgram AI Upscaler</Link>!</p>
      </article>
    </div>
  );
}
