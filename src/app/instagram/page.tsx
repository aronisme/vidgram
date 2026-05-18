'use client';

import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, AlertCircle, CheckCircle2, Loader2, Play, Sparkles, Image as ImageIcon, Instagram, Heart, MessageCircle, Eye, FileDown } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface InstagramAuthor {
  username: string;
  fullName: string;
  avatar: string;
}

interface InstagramStats {
  likeCount: number;
  commentCount: number;
  viewCount: number;
}

interface CarouselMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  preview: string;
}

interface InstagramData {
  id: string;
  type: 'video' | 'image' | 'carousel';
  author: InstagramAuthor;
  statistics: InstagramStats;
  caption: string;
  url?: string;
  preview?: string;
  mediaList?: CarouselMedia[];
}

export default function InstagramDownloader() {
  const { addToast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [result, setResult] = useState<InstagramData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const resultRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!url.includes('instagram.com')) {
      addToast('Please enter a valid Instagram URL', 'error');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch Instagram media');
      }

      setResult(data.data);
      addToast('Media fetched successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = async (targetUrl: string, type: 'video' | 'image', itemId: string) => {
    if (!result) return;
    setDownloadingId(itemId);
    addToast(`Preparing your ${type} download...`, 'info');

    try {
      const fileName = `vidgram-ig-${result.author.username}-${itemId}`;
      const proxyUrl = `/api/instagram/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(fileName)}&type=${type}`;
      
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.setAttribute('download', `${fileName}.${type === 'video' ? 'mp4' : 'jpg'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} download started successfully!`, 'success');
    } catch (err) {
      addToast('Failed to download media. Please try again.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(''); // Clear the old textbox content first
        const trimmedText = text.trim();
        if (trimmedText.includes('instagram.com')) {
          setUrl(trimmedText);
          addToast('Instagram URL pasted from clipboard!', 'success');
        } else {
          addToast('Clipboard does not contain an Instagram link', 'info');
        }
      }
    } catch (err) {
      addToast('Please paste the link manually', 'info');
    }
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ borderRadius: 'var(--radius-xl)', padding: '5rem 2rem', textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-accent" style={{ marginBottom: '1.5rem', background: 'rgba(225, 48, 108, 0.15)', color: '#e1306c', border: '1px solid rgba(225, 48, 108, 0.3)' }}>
            <Sparkles size={14} style={{ color: '#e1306c' }} /> Instagram Downloader Pro
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.05em', lineHeight: 1.1 }}>
            Download Reels & Foto <br />
            <span style={{ background: 'linear-gradient(135deg, #f9ce34 10%, #ee2a7b 50%, #6228d7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Instagram Kualitas HD
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', fontWeight: 500, lineHeight: 1.5 }}>
            Simpan Reels, video, foto tunggal, atau slide carousel dari Instagram secara cepat, gratis, dan tanpa tanda air.
          </p>

          {/* Search Form */}
          <form onSubmit={handleFetch} style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="glass-strong" style={{ display: 'flex', borderRadius: 'var(--radius-full)', padding: '0.75rem', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1.5rem', color: 'var(--text-tertiary)' }}>
                <LinkIcon size={24} />
                <input
                  type="text"
                  placeholder="Tempel tautan Reels, Video, atau Foto Instagram..."
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
                  style={{
                    minWidth: '180px',
                    fontSize: '1.125rem',
                    padding: '0 2.5rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ee2a7b, #6228d7)',
                    border: 'none',
                  }}
                >
                  {loading ? <Loader2 className="spinner" style={{ width: '24px', height: '24px' }} /> : 'UNDUH'}
                </button>
              </div>
            </div>
          </form>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem', color: 'var(--text-tertiary)', fontSize: '0.9375rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><CheckCircle2 size={18} color="#e1306c" /> Reels & Video HD</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><CheckCircle2 size={18} color="#e1306c" /> Foto HD</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><CheckCircle2 size={18} color="#e1306c" /> Dukungan Carousel</div>
          </div>
        </div>
      </section>

      {/* Results & Preview Area */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        {error && (
          <div className="card animate-slide-up" style={{ padding: '3rem 2rem', border: '1px solid var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.05)', textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <AlertCircle size={40} color="var(--error)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Gagal Mengambil Konten</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>{error}</p>
          </div>
        )}

        {result && (
          <div ref={resultRef} className="card animate-slide-up shadow-2xl" style={{ overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '6rem', scrollMarginTop: '100px' }}>
            
            {/* Standard Single Post (Image/Video) */}
            {result.type !== 'carousel' && (
              <div className="responsive-card-content">
                {/* Preview Frame */}
                <div className="preview-container" style={{ maxWidth: '380px', width: '100%', aspectRatio: '9/16', backgroundColor: '#050505', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  <img src={`/api/instagram/download?url=${encodeURIComponent(result.preview || '')}&name=preview&type=image`} referrerPolicy="no-referrer" alt="Instagram Media Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {result.type === 'video' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ 
                        width: '64px', 
                        height: '64px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white',
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)'
                      }}>
                        <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />
                      </div>
                    </div>
                  )}
                  {/* Floating User Card */}
                  <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                    <div className="glass-strong" style={{ padding: '0.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem', backdropFilter: 'blur(12px)' }}>
                      <img src={result.author.avatar} referrerPolicy="no-referrer" alt={result.author.username} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #e1306c' }} />
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>@{result.author.username}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details and Actions Column */}
                <div style={{ padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div className="badge badge-success" style={{ marginBottom: '1rem', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                      <CheckCircle2 size={12} /> Media Ditemukan
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.3 }}>
                      {result.type === 'video' ? 'Instagram Reel / Video' : 'Instagram Photo'}
                    </h2>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem', maxHeight: '100px', overflowY: 'auto' }}>
                      {result.caption || 'Tidak ada deskripsi caption.'}
                    </p>

                    {/* Stats Display */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                      <div className="stat-card" style={{ padding: '1rem', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', color: '#e1306c', marginBottom: '0.25rem' }}><Heart size={14} /></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Likes</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.likeCount?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="stat-card" style={{ padding: '1rem', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', color: '#3b82f6', marginBottom: '0.25rem' }}><MessageCircle size={14} /></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Komentar</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.commentCount?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="stat-card" style={{ padding: '1rem', textAlign: 'center', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', color: '#10b981', marginBottom: '0.25rem' }}><Eye size={14} /></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Views</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.viewCount?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <button
                      onClick={() => triggerDownload(result.url || '', result.type as 'video' | 'image', result.id)}
                      disabled={downloadingId !== null}
                      className="btn-primary"
                      style={{
                        padding: '1.5rem',
                        fontSize: '1.25rem',
                        width: '100%',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        background: 'linear-gradient(135deg, #ee2a7b, #6228d7)',
                        border: 'none',
                      }}
                    >
                      {downloadingId === result.id ? (
                        <Loader2 className="spinner" style={{ width: '24px', height: '24px' }} />
                      ) : (
                        <>
                          <FileDown size={22} style={{ marginRight: '0.5rem', display: 'inline' }} /> UNDUH HD ({result.type.toUpperCase()})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Carousel Slide Post */}
            {result.type === 'carousel' && (
              <div style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={result.author.avatar} referrerPolicy="no-referrer" alt={result.author.username} style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2.5px solid #e1306c' }} />
                    <div>
                      <div className="badge badge-success" style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', marginBottom: '0.25rem' }}>
                        Carousel Ditemukan
                      </div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>@{result.author.username}</h2>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Slides</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{result.mediaList?.length || '0'}</p>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem', textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Likes</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{result.statistics?.likeCount?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '3rem' }}>
                  {result.caption || 'Tidak ada deskripsi caption.'}
                </p>

                {/* Grid of Slide elements */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Pilih Media yang Ingin Diunduh:</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                  {result.mediaList?.map((media, index) => (
                    <div key={media.id} className="card animate-slide-up" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                      
                      {/* Media Image Preview */}
                      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative', background: '#050505' }}>
                        <img src={`/api/instagram/download?url=${encodeURIComponent(media.preview)}&name=preview&type=image`} referrerPolicy="no-referrer" alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                        {/* Slide type badge */}
                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                          <span style={{ 
                            padding: '0.375rem 0.625rem', 
                            borderRadius: 'var(--radius-sm)', 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.25rem', 
                            backdropFilter: 'blur(8px)', 
                            backgroundColor: 'rgba(15, 23, 42, 0.75)', 
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                          }}>
                            {media.type === 'video' ? <Play size={12} fill="white" /> : <ImageIcon size={12} />}
                            {media.type.toUpperCase()}
                          </span>
                        </div>

                        {/* Slide counter */}
                        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: 'var(--radius-sm)', 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            backgroundColor: 'rgba(15, 23, 42, 0.75)', 
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(8px)'
                          }}>
                            SLIDE {index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Download Action */}
                      <div style={{ padding: '1.25rem', marginTop: 'auto' }}>
                        <button
                          onClick={() => triggerDownload(media.url, media.type, media.id)}
                          disabled={downloadingId !== null}
                          className="btn-primary"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.9375rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: 'linear-gradient(135deg, #ee2a7b, #6228d7)',
                            border: 'none',
                          }}
                        >
                          {downloadingId === media.id ? (
                            <Loader2 className="spinner" style={{ width: '16px', height: '16px' }} />
                          ) : (
                            <>
                              <Download size={16} /> UNDUH
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Instructional Section */}
        <div className="animate-fade-in">
          
          {/* Service Feature Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginBottom: '8rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="glass" style={{ width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#e1306c', background: 'rgba(225, 48, 108, 0.05)' }}>
                <Sparkles size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Ekstraksi Cepat HD</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Layanan proxy serverless kami menarik media langsung dalam kualitas tertinggi yang tersedia di server Instagram.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="glass" style={{ width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#e1306c', background: 'rgba(225, 48, 108, 0.05)' }}>
                <ImageIcon size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Dukungan Slide / Carousel</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Punya post beruntun? Pengekstraksi kami mendeteksi postingan slide dan menyajikannya secara terpisah sehingga Anda bisa memilih.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="glass" style={{ width: '72px', height: '72px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#e1306c', background: 'rgba(225, 48, 108, 0.05)' }}>
                <Instagram size={36} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Unduhan Tanpa Log In</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Kemanan Anda prioritas kami. Simpan video dan foto dari Instagram tanpa perlu memasukkan kredensial akun Anda.
              </p>
            </div>
          </div>

          {/* How to use Section */}
          <section style={{ marginBottom: '8rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Cara Unduh Media Instagram</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>3 langkah mudah untuk menyimpan konten ke perangkat Anda.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: '#e1306c', opacity: 0.05, position: 'absolute', top: -10, right: 20 }}>1</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#e1306c' }}>Salin Link Postingan</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Buka Instagram, pilih Reels, Video, atau Foto, klik tanda 'Bagikan' dan pilih 'Salin Tautan'.</p>
              </div>
              <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: '#e1306c', opacity: 0.05, position: 'absolute', top: -10, right: 20 }}>2</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#e1306c' }}>Tempel di Vidgram</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Gunakan tombol 'Tempel' atau tempel tautan yang disalin di bagian kolom input atas.</p>
              </div>
              <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, color: '#e1306c', opacity: 0.05, position: 'absolute', top: -10, right: 20 }}>3</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#e1306c' }}>Mulai Download</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Tekan 'UNDUH' dan klik opsi file yang didapatkan untuk menyimpan media secara instan.</p>
              </div>
            </div>
          </section>

          {/* Interactive Accordion FAQs */}
          <section style={{ marginBottom: '8rem', maxWidth: '800px', margin: '0 auto 8rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '3rem', textAlign: 'center' }}>Pertanyaan Umum (FAQ)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                {
                  q: "Apakah saya perlu login menggunakan akun Instagram?",
                  a: "Tidak perlu! Vidgram tidak pernah menanyakan kredensial login atau kata sandi akun Instagram Anda. Layanan ini sepenuhnya aman dan dapat digunakan secara anonim."
                },
                {
                  q: "Bisa untuk download foto slide (carousel)?",
                  a: "Ya, tentu saja. Sistem kami mendeteksi postingan bertipe carousel dan menyajikan slide foto/video secara terpisah di antarmuka Anda sehingga Anda bisa memilih item yang Anda inginkan secara mandiri."
                },
                {
                  q: "Apakah ada batasan jumlah file yang dapat diunduh?",
                  a: "Tidak ada batasan. Anda dapat menggunakan Instagram Downloader Vidgram sepuasnya tanpa ada limitasi harian, mingguan, atau kuota tersembunyi."
                },
                {
                  q: "Di mana file unduhan Instagram saya disimpan?",
                  a: "Semua file yang diunduh secara default akan masuk ke folder 'Unduhan' atau 'Downloads' pada PC, Mac, Android, atau iPhone Anda, tergantung pada setelan browser Anda."
                },
                {
                  q: "Kenapa unduhan Reels saya gagal?",
                  a: "Pastikan akun pemilik postingan tersebut adalah akun publik. Sesuai kebijakan keamanan Instagram, media dari akun privat tidak dapat diakses oleh API extractor kami."
                }
              ].map((faq, i) => (
                <details key={i} className="card" style={{ padding: '0', cursor: 'pointer' }}>
                  <summary style={{ padding: '1.75rem 2rem', fontWeight: 700, fontSize: '1.125rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {faq.q}
                    <span style={{ color: '#e1306c', fontSize: '1.5rem' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 2rem 2rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.0625rem' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Structured SEO Marketing Description */}
          <section style={{ borderTop: '1px solid var(--border)', paddingTop: '5rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Download Reels Instagram Tanpa Watermark Kualitas HD</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  Vidgram adalah alat terbaik di internet untuk menyimpan Reels Instagram berkualitas tinggi. Reels merupakan salah satu media video vertikal terpopuler saat ini. Menggunakan pemroses cloud handal kami, Anda bisa menyimpan video Reels terbersih langsung ke penyimpanan lokal untuk keperluan edukasi, kompilasi, maupun referensi konten pribadi.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  Tidak seperti aplikasi download video lain yang seringkali mengharuskan instalasi aplikasi rumit yang membawa malware atau adware, Vidgram bekerja 100% di web browser modern secara aman dan responsif.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Kompatibilitas Penuh Lintas Perangkat</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  Aplikasi web Vidgram dirancang responsif dan kompatibel untuk semua sistem operasi. Anda bisa menggunakan alat unduh Instagram kami dengan sempurna di Android, iOS (iPhone/iPad), macOS (MacBook/iMac), Windows PC, maupun sistem Linux.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  Cukup buka Chrome, Safari, Firefox, Edge, atau browser bawaan Anda, tempel tautan yang diinginkan, dan rasakan kemudahan menyimpan media dengan kenyamanan maksimal dan loading super cepat.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
