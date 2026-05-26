'use client';

import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, AlertCircle, CheckCircle2, Loader2, Music, Play, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface TikTokData {
  id: string;
  title: string;
  cover: string;
  play: string;
  wmplay: string;
  music: string;
  author: {
    nickname: string;
    avatar: string;
  };
  statistics: {
    play_count: number;
    download_count: number;
    share_count: number;
    comment_count: number;
    digg_count: number;
  };
}

export default function TikTokDownloader() {
  const { addToast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<TikTokData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!url.includes('tiktok.com')) {
      addToast('Please enter a valid TikTok URL', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video data');
      }

      setResult(data.data);
      addToast('Video information fetched successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = async (targetUrl: string, type: 'video' | 'music') => {
    if (!result) return;
    setDownloading(true);
    addToast(`Preparing ${type} for download...`, 'info');

    try {
      const fileName = `${result.author.nickname}-${result.id || Date.now()}`;
      const proxyUrl = `/api/tiktok/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(fileName)}&type=${type}`;
      
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.setAttribute('download', `${fileName}${type === 'video' ? '.mp4' : '.mp3'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} download started!`, 'success');
    } catch (err) {
      addToast('Failed to start download. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('tiktok.com')) {
        setUrl(text);
        addToast('Link pasted!', 'success');
      } else {
        addToast('Clipboard does not contain a TikTok link', 'info');
      }
    } catch (err) {
      addToast('Please paste the link manually', 'info');
    }
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ borderRadius: 'var(--radius-xl)', padding: 'clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 2rem)', textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> TikTok Downloader Pro
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.05em', lineHeight: 1.0 }}>
            Download Video TikTok <br />
            <span style={{ color: 'var(--accent)' }}>Tanpa Watermark HD</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', fontWeight: 500, lineHeight: 1.5 }}>
            Simpan video TikTok favorit Anda dalam kualitas tinggi secara gratis. Cepat, aman, dan tanpa perlu instalasi aplikasi.
          </p>

          {/* Search Form */}
          <form onSubmit={handleDownload} style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="glass-strong" style={{ display: 'flex', borderRadius: 'var(--radius-full)', padding: '0.75rem', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1.5rem', color: 'var(--text-tertiary)' }}>
                <LinkIcon size={24} />
                <input
                  type="text"
                  placeholder="Tempel tautan video TikTok di sini..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    padding: '1rem',
                    width: '100%',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="btn-secondary desktop-only"
                  style={{ border: 'none', background: 'var(--bg-tertiary)', padding: '0 2rem', fontSize: '1rem' }}
                >
                  Tempel
                </button>
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="btn-primary"
                  style={{ fontSize: '1.125rem', padding: '0 1.5rem', fontWeight: 700 }}
                >
                  {loading ? <Loader2 className="spinner" style={{ width: '24px', height: '24px' }} /> : 'UNDUH'}
                </button>
              </div>
            </div>
          </form>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem', color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><CheckCircle2 size={18} color="var(--success)" /> Tanpa Watermark</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><CheckCircle2 size={18} color="var(--success)" /> Kualitas HD MP4</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><CheckCircle2 size={18} color="var(--success)" /> Format MP3</div>
          </div>
        </div>
      </section>

      {/* Results & Content Area */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        {error && (
          <div className="card animate-slide-up" style={{ padding: '3rem 2rem', border: '1px solid var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.05)', textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <AlertCircle size={40} color="var(--error)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Gagal Mengambil Video</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>{error}</p>
          </div>
        )}

        {result && (
          <div className="card animate-slide-up shadow-2xl" style={{ overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '6rem' }}>
            <div className="responsive-card-content">
              {/* Preview Section */}
              <div className="preview-container" style={{ maxWidth: '380px', width: '100%', aspectRatio: '9/16', backgroundColor: '#000', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={result.cover} alt={result.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="glass" style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                  <div className="glass-strong" style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem', backdropFilter: 'blur(12px)' }}>
                    <img src={result.author.avatar} alt={result.author.nickname} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent)' }} />
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>@{result.author.nickname}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div style={{ padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <div className="badge badge-success" style={{ marginBottom: '1rem' }}>
                    <CheckCircle2 size={12} /> Video Ditemukan
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.3 }}>{result.title || 'TikTok Video'}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Suka</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.digg_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Bagikan</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.share_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Tayang</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.play_count?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <button
                      onClick={() => triggerDownload(result.play, 'video')}
                      disabled={downloading}
                      className="btn-primary"
                      style={{ padding: '1.5rem', fontSize: '1.25rem', width: '100%', fontWeight: 800, letterSpacing: '0.02em' }}
                    >
                      {downloading ? <Loader2 className="spinner" style={{ width: '24px', height: '24px' }} /> : 'UNDUH TANPA WATERMARK'}
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                      <button
                        onClick={() => triggerDownload(result.music, 'music')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '1rem', fontWeight: 600 }}
                      >
                        <Music size={18} /> Audio MP3
                      </button>
                      <button
                        onClick={() => triggerDownload(result.wmplay, 'video')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '1rem', fontWeight: 600 }}
                      >
                        <Play size={18} /> Dengan Watermark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informational Content - Inspired by ssstik.io but Premium */}
        <div className="animate-fade-in">
          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2.5rem', marginBottom: '8rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="glass" style={{ width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--accent)' }}>
                <Sparkles size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Unduhan Tak Terbatas</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Gunakan layanan kami sepuasnya. Tidak ada batasan jumlah video yang dapat Anda unduh setiap harinya.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="glass" style={{ width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--accent)' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Kualitas HD Bersih</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Kami memastikan setiap video yang Anda unduh memiliki kualitas tertinggi tanpa tanda air atau logo TikTok.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="glass" style={{ width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--accent)' }}>
                <Music size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Konversi MP3 Cepat</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Ingin hanya musiknya saja? Ekstrak audio dari video TikTok favorit Anda ke format MP3 berkualitas tinggi.
              </p>
            </div>
          </div>

          {/* How to Download Section */}
          <section style={{ marginBottom: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Cara Unduh Video TikTok</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>3 langkah mudah untuk menyimpan video ke perangkat Anda.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '2rem' }}>
              <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.05, position: 'absolute', top: -10, right: 20 }}>1</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent)' }}>Salin Tautan</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Buka aplikasi TikTok, pilih video, klik 'Bagikan' dan pilih 'Salin Tautan'.</p>
              </div>
              <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.05, position: 'absolute', top: -10, right: 20 }}>2</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent)' }}>Tempel di Vidgram</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Tempel tautan yang sudah disalin ke kolom input di bagian atas halaman ini.</p>
              </div>
              <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.05, position: 'absolute', top: -10, right: 20 }}>3</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent)' }}>Mulai Unduh</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Klik tombol 'Unduh' dan pilih opsi format yang Anda inginkan (MP4 atau MP3).</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section style={{ marginBottom: '8rem', maxWidth: '800px', margin: '0 auto 8rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '3rem', textAlign: 'center' }}>Pertanyaan Umum</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                {
                  q: "Apakah layanan unduhan ini benar-benar gratis?",
                  a: "Ya, Vidgram TikTok Downloader sepenuhnya gratis untuk digunakan. Kami tidak mengenakan biaya atau membatasi jumlah unduhan Anda."
                },
                {
                  q: "Dapatkah saya mengunduh video di Android atau iPhone?",
                  a: "Tentu saja! Vidgram adalah alat berbasis web yang kompatibel dengan semua perangkat seluler termasuk Android, iPhone (iOS), dan tablet."
                },
                {
                  q: "Mengapa saya harus menggunakan Vidgram daripada aplikasi lain?",
                  a: "Vidgram menawarkan kecepatan unduh maksimal, kualitas HD asli, tanpa iklan yang mengganggu, dan menjamin privasi Anda karena tidak menyimpan riwayat unduhan."
                },
                {
                  q: "Bagaimana cara mengunduh lagu TikTok dalam format MP3?",
                  a: "Setelah menempel tautan dan menekan tombol unduh, pilih opsi 'Audio MP3'. Sistem kami akan mengekstrak suara dari video secara otomatis."
                }
              ].map((faq, i) => (
                <details key={i} className="card" style={{ padding: '0', cursor: 'pointer' }}>
                  <summary style={{ padding: '1.75rem 2rem', fontWeight: 700, fontSize: '1.125rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {faq.q}
                    <span style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 2rem 2rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.0625rem' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Detailed SEO Content */}
          <section style={{ borderTop: '1px solid var(--border)', paddingTop: '5rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Download Video TikTok Tanpa Watermark (HD)</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  Vidgram adalah solusi terbaik bagi Anda yang ingin menyimpan video TikTok tanpa tanda air secara online. Kami memahami betapa pentingnya kualitas video yang bersih bagi para kreator maupun pengguna biasa. Oleh karena itu, teknologi kami dirancang untuk mengambil file video asli langsung dari server TikTok dengan kualitas HD tertinggi yang tersedia.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  Tidak seperti pengunduh video lainnya yang seringkali menurunkan kualitas atau menambahkan iklan pop-up yang menjengkelkan, Vidgram memberikan pengalaman yang mulus dan profesional. Cukup salin tautan, tempel, dan video Anda siap dalam hitungan detik.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Privasi dan Keamanan Terjamin</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  Kami sangat menghargai privasi Anda. Vidgram tidak memerlukan login, registrasi, atau instalasi perangkat lunak pihak ketiga yang berisiko. Semua proses pengunduhan dilakukan secara anonim dan terenkripsi.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  Alat kami bekerja secara universal di semua platform. Baik Anda menggunakan Chrome di PC Windows, Safari di Mac, atau browser seluler di smartphone, Vidgram memberikan performa yang konsisten. Jadikan Vidgram sebagai alat andalan Anda untuk koleksi konten video terbaik.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
