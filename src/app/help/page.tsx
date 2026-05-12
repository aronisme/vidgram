import React from 'react';
import { Search, Mail, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Help Center - Vidgram Support",
  description: "Find answers to frequently asked questions, tutorials, and support resources for Vidgram tools.",
};

const categories = [
  { icon: <FileText size={24} />, title: "Getting Started", count: 12 },
  { icon: <MessageCircle size={24} />, title: "TikTok Downloader", count: 8 },
  { icon: <Search size={24} />, title: "AI Upscaler", count: 6 },
  { icon: <Mail size={24} />, title: "Account & Billing", count: 4 },
];

const faqs = [
  { q: "Bagaimana cara kerja AI Video Upscaler?", a: "AI Video Upscaler kami menggunakan jaringan saraf tiruan (Neural Networks) yang berjalan langsung di browser Anda menggunakan WebGPU. Teknologi ini menganalisis setiap frame dan merekonstruksi piksel yang hilang untuk meningkatkan resolusi tanpa kehilangan detail." },
  { q: "Mengapa video TikTok saya gagal diunduh?", a: "Pastikan tautan yang Anda tempel benar dan video tersebut tidak disetel ke 'Private' atau dihapus oleh pemiliknya. Jika masalah berlanjut, coba muat ulang halaman atau hubungi dukungan kami." },
  { q: "Apakah Vidgram berbayar?", a: "Saat ini semua alat dasar Vidgram tersedia secara gratis untuk umum. Kami mungkin menawarkan fitur premium di masa depan, tetapi fitur utama akan selalu tersedia bagi kreator." },
];

export default function HelpPage() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Header */}
      <section style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Apa yang bisa kami <span style={{ color: 'var(--accent)' }}>bantu?</span></h1>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}><Search size={20} /></div>
          <input 
            type="text" 
            placeholder="Cari solusi atau panduan..." 
            style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: 'var(--radius-full)', border: '2px solid var(--border)', background: 'var(--bg-secondary)', outline: 'none' }}
          />
        </div>
      </section>

      {/* Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '6rem' }}>
        {categories.map((cat, i) => (
          <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{cat.icon}</div>
            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{cat.title}</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>{cat.count} Artikel</p>
          </div>
        ))}
      </div>

      {/* Common Questions */}
      <section style={{ maxWidth: '800px', margin: '0 auto 6rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem', textAlign: 'center' }}>Pertanyaan Populer</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {faqs.map((faq, i) => (
            <details key={i} className="card" style={{ padding: '0' }}>
              <summary style={{ padding: '1.5rem 2rem', cursor: 'pointer', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}
                <span style={{ color: 'var(--accent)' }}>+</span>
              </summary>
              <div style={{ padding: '0 2rem 2rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="card" style={{ padding: '4rem', textAlign: 'center', background: 'var(--bg-tertiary)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Masih butuh bantuan?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Tim dukungan kami siap membantu Anda 24/7 untuk masalah teknis atau pertanyaan lainnya.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={18} /> Hubungi Lewat Email
          </button>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            Hubungi via Telegram <ExternalLink size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}
