import Link from 'next/link';
import { CheckCircle, Download, LayoutDashboard, Cloud, Zap, Target } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Keywords Extension - Adobe Stock Auto Fill',
  description: 'Berhenti membuang waktu 10 menit untuk mengisi metadata. Biar AI yang memikirkan judul, keyword, hingga mencegah upload ganda.',
};

export default function SmartKeywordsPage() {
  return (
    <main style={{ paddingBottom: '100px' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '100px', paddingBottom: '80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1 }}></div>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2, background: 'linear-gradient(135deg, #a78bfa, #c4b5fd, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Berhenti Membuang Waktu 10 Menit<br />Hanya Untuk Isi Judul & Keyword
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Biar AI yang memikirkan metadata, kategori, hingga mencegah upload ganda. Smart Keywords mengisi form Adobe Stock Anda secara otomatis hanya dalam 3 detik.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/downloads/Smart_keywords_ext_v2.7.29.zip" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent)', color: 'white', padding: '16px 32px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 10px 25px rgba(139,92,246,0.4)', transition: 'transform 0.2s' }}>
              <Download size={24} /> Download Ekstensi (v2.7.29)
            </Link>
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>⭐⭐⭐⭐⭐ Digunakan oleh ratusan kontributor cerdas.</p>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '50px' }}>Fitur Utama Kami</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Target size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>AI SEO-Optimized</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Menggunakan strategi <i>Layered SEO</i> (Subject, Action, Context, Style). Keyword relevan dengan algoritma pencarian pembeli.</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Cloud size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Anti-Duplikasi (Sync)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Melacak histori upload secara real-time antar device/tim. Selamat tinggal peringatan <i>&quot;File already exists&quot;</i>!</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Zap size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>1-Click Auto Fill</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Judul, Kategori, Checkbox Fictional Property terisi instan. Anda hanya perlu klik tombol Submit.</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <LayoutDashboard size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Fleksibel & Murah</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Gunakan API Key sendiri (Gratis) atau langganan API kami hanya seharga kopi saset per bulan (Rp 10.000).</p>
          </div>

        </div>
      </section>

      {/* Comparison Section */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <div style={{ background: 'var(--glass-strong)', borderRadius: '24px', padding: '50px', border: '1px solid var(--border)', overflowX: 'auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '40px' }}>Mengapa Harus Beralih?</h2>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Aktivitas</th>
                <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Tanpa Ekstensi</th>
                <th style={{ padding: '15px', color: 'var(--accent)', fontSize: '1.1rem' }}>Dengan Smart Keywords</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Isi Judul & Keyword</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>5 - 10 Menit per foto</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Kurang dari 5 detik</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Pilih Kategori</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Scroll panjang manual</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Terpilih otomatis oleh AI</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Cek Duplikat</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Buka folder / ingat-ingat</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Deteksi instan saat upload</td>
              </tr>
              <tr>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Kualitas Keyword</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Kata acak / filler (Spam)</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Terstruktur Buyer-Intent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Pricing / Upsell Section */}
      <section className="container">
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0))', borderRadius: '24px', padding: '50px', border: '1px solid rgba(139,92,246,0.3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px' }}>Tidak Paham Cara Buat API Key?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px' }}>
            Jangan khawatir! Kami menyediakan layanan <b>Sewa API Premium</b> yang siap pakai. Hanya dengan <b>Rp 10.000 / 30 Hari</b>, Anda sudah mendapatkan:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px', maxWidth: '400px', textAlign: 'left' }}>
            <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><CheckCircle color="var(--accent)" /> Load Balancing 3 Ronde (Anti-Timeout)</li>
            <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><CheckCircle color="var(--accent)" /> Tanpa perlu pakai Kartu Kredit</li>
            <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><CheckCircle color="var(--accent)" /> Bisa dipakai di 2 perangkat berbeda</li>
            <li style={{ display: 'flex', gap: '10px' }}><CheckCircle color="var(--accent)" /> Kecepatan prioritas Gemini 2.5 Flash & Llama 4</li>
          </ul>
          <Link href="/downloads/Smart_keywords_ext_v2.7.29.zip" style={{ display: 'inline-block', background: 'white', color: 'black', padding: '14px 28px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', transition: 'transform 0.2s' }}>
            Mulai Sekarang!
          </Link>
        </div>
      </section>

    </main>
  );
}
