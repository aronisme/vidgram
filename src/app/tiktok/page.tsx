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
    <div className="animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> AI Powered
          </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            TikTok <span style={{ color: 'var(--accent)' }}>Downloader Pro</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem', fontWeight: 500 }}>
            Save TikTok videos without watermarks instantly.
          </p>

          {/* Search Form */}
          <form onSubmit={handleDownload} style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-strong" style={{ display: 'flex', borderRadius: 'var(--radius-full)', padding: '0.625rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1.25rem', color: 'var(--text-tertiary)' }}>
                <LinkIcon size={22} />
                <input
                  type="text"
                  placeholder="Paste TikTok link here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    padding: '0.875rem',
                    width: '100%',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="btn-secondary desktop-only"
                  style={{ border: 'none', background: 'var(--bg-tertiary)', padding: '0 1.5rem' }}
                >
                  Paste
                </button>
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="btn-primary"
                  style={{ minWidth: '160px', fontSize: '1rem', padding: '0 2rem' }}
                >
                  {loading ? <Loader2 className="spinner" style={{ width: '24px', height: '24px' }} /> : 'Get Video'}
                </button>
              </div>
            </div>
          </form>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--success)" /> No Watermark</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--success)" /> HD Quality</div>
          </div>
        </div>
      </section>

      {/* Results Area - Centered and Contained */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {error && (
          <div className="card animate-slide-up" style={{ padding: '3rem 2rem', border: '1px solid var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.05)', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <AlertCircle size={40} color="var(--error)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Unable to fetch video</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>{error}</p>
          </div>
        )}

        {result && (
          <div className="card animate-slide-up" style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div className="responsive-card-content">
              {/* Preview Section - Capped width */}
              <div className="preview-container" style={{ maxWidth: '100%', aspectRatio: '9/16', backgroundColor: '#000', overflow: 'hidden', flexShrink: 0, maxHeight: '600px' }}>
                <img
                  src={result.cover}
                  alt={result.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
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
              <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <div className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
                    <CheckCircle2 size={12} /> Video Found Successfully
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>{result.title || 'TikTok Video'}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div className="stat-card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Likes</p>
                      <p style={{ fontSize: '1rem', fontWeight: 800 }}>{result.statistics?.digg_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Shares</p>
                      <p style={{ fontSize: '1rem', fontWeight: 800 }}>{result.statistics?.share_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Plays</p>
                      <p style={{ fontSize: '1rem', fontWeight: 800 }}>{result.statistics?.play_count?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <Download size={18} /> DOWNLOAD OPTIONS:
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      onClick={() => triggerDownload(result.play, 'video')}
                      disabled={downloading}
                      className="btn-primary"
                      style={{ padding: '1.25rem', fontSize: '1.125rem', width: '100%', boxShadow: 'var(--shadow-lg)' }}
                    >
                      {downloading ? <Loader2 className="spinner" style={{ width: '20px', height: '20px' }} /> : 'DOWNLOAD VIDEO (NO WATERMARK)'}
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <button
                        onClick={() => triggerDownload(result.music, 'music')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '0.875rem' }}
                      >
                        <Music size={16} /> Audio MP3
                      </button>
                      <button
                        onClick={() => triggerDownload(result.wmplay, 'video')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '0.875rem' }}
                      >
                        <Play size={16} /> With Watermark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && !error && !loading && (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed', background: 'transparent' }}>
            <Download size={48} color="var(--accent)" style={{ opacity: 0.3, margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ready to Download?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Paste a link above to see the download options.</p>
          </div>
        )}
      </div>
    </div>
  );
}
