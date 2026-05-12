import React from 'react';
import { Sparkles, Users, Zap, Shield, Globe } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Vidgram - Our Mission & Vision",
  description: "Learn more about Vidgram, our mission to empower creators with high-performance video tools, and the team behind the platform.",
};

export default function AboutPage() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center' }}>
        <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>Our Story</div>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.0, marginBottom: '2rem' }}>
          Empowering Creators <br />
          <span style={{ color: 'var(--accent)' }}>With Better Tools.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          Vidgram didesain untuk menjembatani celah antara kreativitas dan teknologi. Kami menyediakan alat video berkinerja tinggi yang mudah digunakan untuk semua orang.
        </p>
      </section>

      {/* Values Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
        <div className="card" style={{ padding: '3rem 2.5rem' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}><Zap size={32} /></div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Kecepatan Maksimal</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Kami mengoptimalkan setiap baris kode untuk memastikan alat kami berjalan secepat kilat, bahkan pada koneksi yang lambat.
          </p>
        </div>
        <div className="card" style={{ padding: '3rem 2.5rem' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}><Shield size={32} /></div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Privasi Utama</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Data Anda adalah milik Anda. Kami tidak menyimpan video atau informasi pribadi Anda tanpa izin eksplisit.
          </p>
        </div>
        <div className="card" style={{ padding: '3rem 2.5rem' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}><Globe size={32} /></div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Akses Global</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Dikembangkan di Indonesia namun dirancang untuk melayani kreator dari seluruh penjuru dunia dengan infrastruktur global.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="card hero-gradient" style={{ padding: '6rem 4rem', borderRadius: 'var(--radius-2xl)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>Misi Kami</h2>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Misi Vidgram adalah mendemokratisasi pengeditan video dan alat distribusi yang canggih. Kami percaya bahwa teknologi AI dan pengolahan video tingkat tinggi tidak seharusnya hanya bisa diakses oleh perusahaan besar dengan anggaran tak terbatas.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
              <Users size={20} color="var(--accent)" /> 50,000+ Kreator Aktif Bulanan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
              <Sparkles size={20} color="var(--accent)" /> 1M+ Video Diproses
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass" style={{ height: '200px', borderRadius: 'var(--radius-xl)' }}></div>
          <div className="glass" style={{ height: '200px', borderRadius: 'var(--radius-xl)', marginTop: '2rem' }}></div>
          <div className="glass" style={{ height: '200px', borderRadius: 'var(--radius-xl)', marginTop: '-2rem' }}></div>
          <div className="glass" style={{ height: '200px', borderRadius: 'var(--radius-xl)' }}></div>
        </div>
      </section>
    </div>
  );
}
