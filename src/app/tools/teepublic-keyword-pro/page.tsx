'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Download, 
  Sparkles, 
  Zap, 
  Target, 
  Tag, 
  Sliders, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Shirt
} from 'lucide-react';
import { statsService } from '@/lib/statsService';

const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/teepublic-keyword-pro/icgacnoaolgljkidedpcganocmmpinnd?utm_source=item-share-cb';

export default function TeePublicKeywordProPage() {
  const [downloads, setDownloads] = useState<number>(385);

  const handleStoreClick = () => {
    setDownloads(prev => prev + 1);
  };

  return (
    <main style={{ paddingBottom: '100px' }}>
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        paddingTop: '80px', 
        paddingBottom: '70px', 
        textAlign: 'center' 
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '-10%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '800px', 
          height: '400px', 
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(0,0,0,0) 70%)', 
          zIndex: -1 
        }} />
        
        <div className="container">
          {/* Platform Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <span style={{ 
              background: 'rgba(99,102,241,0.1)', 
              color: 'var(--accent)', 
              padding: '6px 18px', 
              borderRadius: '50px', 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              border: '1px solid rgba(99,102,241,0.25)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" width={16} height={16}/> 
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg" alt="Edge" width={16} height={16}/> 
              Ekstensi Resmi Chrome & Edge
            </span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', 
            fontWeight: 900, 
            marginBottom: '20px', 
            lineHeight: 1.15, 
            letterSpacing: '-0.03em', 
            maxWidth: '850px', 
            margin: '0 auto 20px' 
          }}>
            Otomatiskan Judul & Tag <br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}>TeePublic POD dalam 3 Detik.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 35px', lineHeight: 1.6, fontWeight: 500 }}>
            Memperkenalkan <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>TeePublic Keyword Pro</strong>. Ekstensi browser berbasis AI Vision yang otomatis menganalisis desain Anda, lalu mengisi formulir uploader TeePublic (Title, Description, Main Tag, dan Supporting Tags) secara instan.
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <a 
              href={CHROME_STORE_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={handleStoreClick} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                color: 'white', 
                padding: '16px 36px', 
                borderRadius: '50px', 
                fontSize: '1.1rem', 
                fontWeight: 800, 
                textDecoration: 'none', 
                boxShadow: '0 10px 30px rgba(99,102,241,0.4)', 
                transition: 'all 0.25s ease' 
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Download size={22} /> Pasang di Chrome (Gratis v1.2.1)
              <ExternalLink size={16} />
            </a>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" /> 5.0 / 5.0 Rating di Chrome Store
            </span>
            <span>•</span>
            <span>⚡ Kompatibel dengan TeePublic Single & Multi Upload</span>
          </div>
        </div>
      </section>

      {/* Visual Demo Card */}
      <section className="container" style={{ marginBottom: '80px', maxWidth: '960px' }}>
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(236,72,153,0.08) 100%)', 
          border: '1.5px solid rgba(99,102,241,0.3)', 
          borderRadius: 'var(--radius-xl)', 
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div className="badge badge-accent" style={{ marginBottom: '1rem' }}>
                <Sparkles size={14} /> AI Vision Analysis
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.25 }}>
                Unggah Desain T-Shirt, Biarkan AI Bekerja
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Cukup letakkan file PNG/JPG desain t-shirt, sticker, atau hoodie Anda ke TeePublic. Ekstensi langsung mengenali subjek (misal: anime retro, hewan lucu, kata-kata lucu) dan menuliskan metadata yang siap mendatangkan pembeli.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle size={18} /> Otomatis mengisi kolom 'Title' menarik
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle size={18} /> Menemukan 'Main Tag' paling bervolume tinggi
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle size={18} /> Mengisi hingga 15 Supporting Tags relevan
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>TEEPUBLIC UPLOADER PREVIEW</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>● Auto-Filled by AI</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Design Title:</span>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontWeight: 600, marginTop: '2px' }}>
                    Vintage Retro Sunset Japanese Samurai Cat
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Main Tag:</span>
                  <div style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)', padding: '0.4rem 0.75rem', borderRadius: '6px', fontWeight: 700, marginTop: '2px', display: 'inline-block' }}>
                    samurai cat
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Supporting Tags (15 Tags):</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '4px' }}>
                    {['japanese cat', 'retro samurai', 'vintage anime', 'ukiyo-e', 'cat lover', 'funny cat', 'sunset vibes', 'ninja kitty', 'tokyo art', 'aesthetic'].map(t => (
                      <span key={t} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>#{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Pillars Section */}
      <section className="container" style={{ marginBottom: '90px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.25rem', fontWeight: 800, marginBottom: '45px', letterSpacing: '-0.02em' }}>
          Mengapa Kreator TeePublic Memilih Keyword Pro?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
          
          <div className="card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Target size={32} color="var(--accent)" style={{ marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>AI Layered SEO</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Menggabungkan kata kunci subjek, gaya visual, niche audiens, dan sentimen pembeli agar produk Anda muncul di halaman pertama pencarian TeePublic dan Google Shopping.
            </p>
          </div>
          
          <div className="card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Zap size={32} color="#f59e0b" style={{ marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1-Click Fast Auto-Fill</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Tinggalkan cara lama membuka Excel atau mengetik tag satu demi satu. Ekstensi ini otomatis mengisi seluruh formulir upload Anda hanya dengan 1 klik tombol.
            </p>
          </div>
          
          <div className="card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Sliders size={32} color="#10b981" style={{ marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Kustomisasi Penuh</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Atur jumlah tag (hingga 15 tags), batas maksimal karakter judul, serta bahasa deskripsi sesuai preferensi toko Anda untuk hasil penjualan yang maksimal.
            </p>
          </div>
          
          <div className="card" style={{ padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <ShieldCheck size={32} color="#ec4899" style={{ marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Aman & Sesuai Aturan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Bekerja murni di sisi browser Anda tanpa meminta kata sandi akun TeePublic. Ekstensi mematuhi pedoman SEO TeePublic untuk menghindari tag spam.
            </p>
          </div>

        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="container" style={{ marginBottom: '90px' }}>
        <div style={{ background: 'var(--glass-strong)', borderRadius: '24px', padding: '40px', border: '1px solid var(--border)', overflowX: 'auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '35px' }}>
            Perbandingan Efisiensi Waktu Upload
          </h2>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '15px', color: 'var(--text-secondary)', fontWeight: 700 }}>Aktivitas Upload POD</th>
                <th style={{ padding: '15px', color: 'var(--text-secondary)', fontWeight: 700 }}>Upload Manual (Tanpa Ekstensi)</th>
                <th style={{ padding: '15px', color: 'var(--accent)', fontWeight: 800, fontSize: '1.05rem' }}>Dengan TeePublic Keyword Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '18px 15px', fontWeight: 600 }}>Menulis Judul & Deskripsi</td>
                <td style={{ padding: '18px 15px', color: 'var(--text-secondary)' }}>3 - 5 Menit per desain</td>
                <td style={{ padding: '18px 15px', color: 'var(--success)', fontWeight: 700 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> 1 Detik (Dibuat otomatis oleh AI)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '18px 15px', fontWeight: 600 }}>Riset Main Tag & Supporting Tags</td>
                <td style={{ padding: '18px 15px', color: 'var(--text-secondary)' }}>Ketik manual 15 tags</td>
                <td style={{ padding: '18px 15px', color: 'var(--success)', fontWeight: 700 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Terisi instan 15 tags relevan</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '18px 15px', fontWeight: 600 }}>Kecepatan Upload 50 Desain</td>
                <td style={{ padding: '18px 15px', color: 'var(--text-secondary)' }}>3 - 4 Jam (Melelahkan)</td>
                <td style={{ padding: '18px 15px', color: 'var(--success)', fontWeight: 700 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Selesai dalam 15 Menit</td>
              </tr>
              <tr>
                <td style={{ padding: '18px 15px', fontWeight: 600 }}>Visibilitas Penjualan Organik</td>
                <td style={{ padding: '18px 15px', color: 'var(--text-secondary)' }}>Tag sering kali kurang akurat</td>
                <td style={{ padding: '18px 15px', color: 'var(--success)', fontWeight: 700 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Tag Niche dengan ranking tinggi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Install Section */}
      <section className="container" style={{ marginBottom: '90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            3 Langkah Mudah Memulai
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Mulai otomatiskan toko TeePublic Anda hari ini.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.75rem' }}>
          <div className="card" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.08, position: 'absolute', top: -5, right: 15 }}>1</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent)' }}>1. Pasang Ekstensi</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Klik tombol pasang dan tambahkan TeePublic Keyword Pro ke browser Google Chrome atau Microsoft Edge Anda.
            </p>
          </div>
          <div className="card" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.08, position: 'absolute', top: -5, right: 15 }}>2</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent)' }}>2. Buka Halaman Upload</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Buka akun TeePublic Anda dan unggah gambar desain seperti biasa. Tombol pintar Keyword Pro akan muncul di layar.
            </p>
          </div>
          <div className="card" style={{ padding: '2rem', position: 'relative' }}>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.08, position: 'absolute', top: -5, right: 15 }}>3</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent)' }}>3. Klik & Terisi Otomatis</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Klik tombol 'Generate Tags', seluruh formulir akan terisi instan dengan tag teroptimasi. Siap langsung di-publish!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Card */}
      <section className="container" style={{ marginBottom: '90px' }}>
        <div className="hero-gradient" style={{ borderRadius: 'var(--radius-xl)', padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '1rem' }}>
            Siap Melipatgandakan Penjualan Desain Anda di TeePublic?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Hemat ratusan jam kerja repetitif dan fokuslah menciptakan karya desain terbaik Anda.
          </p>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleStoreClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              padding: '16px 36px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(99,102,241,0.4)',
            }}
          >
            <Download size={22} /> Download Ekstensi di Chrome Web Store
            <ExternalLink size={16} />
          </a>
        </div>
      </section>

    </main>
  );
}
