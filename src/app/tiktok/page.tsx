'use client';

import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, Trash2, History, AlertCircle, CheckCircle2, Loader2, Music, User, Share2, Play, Sparkles } from 'lucide-react';
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

interface HistoryItem {
  id: string;
  title: string;
  cover: string;
  url: string;
  timestamp: number;
}

export default function TikTokDownloader() {
  const { addToast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<TikTokData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('tiktok_download_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history');
      }
    }
  }, []);

  const saveToHistory = (data: TikTokData, videoUrl: string) => {
    // Check if already in history
    if (history.some(item => item.url === videoUrl)) return;

    const newItem: HistoryItem = {
      id: data.id || Math.random().toString(36).substring(7),
      title: data.title || 'TikTok Video',
      cover: data.cover,
      url: videoUrl,
      timestamp: Date.now(),
    };

    const updatedHistory = [newItem, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    localStorage.setItem('tiktok_download_history', JSON.stringify(updatedHistory));
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Basic URL validation
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
      saveToHistory(data.data, url);
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

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('tiktok_download_history');
    addToast('History cleared', 'info');
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

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> AI Powered
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            TikTok <span style={{ color: 'var(--accent)' }}>Pro Downloader</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem', fontWeight: 500 }}>
            The fastest way to save TikTok videos <br className="desktop-only" /> without watermarks in HD quality.
          </p>

          {/* Search Form */}
          <form onSubmit={handleDownload} style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-strong" style={{ display: 'flex', borderRadius: 'var(--radius-full)', padding: '0.625rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1.25rem', color: 'var(--text-tertiary)' }}>
                <LinkIcon size={22} />
                <input
                  type="text"
                  placeholder="Paste TikTok link (e.g., https://vt.tiktok.com/...)"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--success)" /> Fast Download</div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="video-detail-layout">
        {/* Results Area */}
        <div style={{ flex: 1 }}>
          {error && (
            <div className="card animate-slide-up" style={{ padding: '3rem 2rem', border: '1px solid var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.05)', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <AlertCircle size={40} color="var(--error)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Unable to fetch video</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>{error}. Please verify the link and try again.</p>
              <button onClick={() => setError(null)} className="btn-secondary" style={{ marginTop: '2rem' }}>Try Another Link</button>
            </div>
          )}

          {result && (
            <div className="card animate-slide-up" style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div className="responsive-card-content">
                {/* Preview Section */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '100%', aspectRatio: '9/16', backgroundColor: '#000', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={result.cover}
                    alt={result.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass" style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                    <div className="glass-strong" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', backdropFilter: 'blur(12px)' }}>
                      <img src={result.author.avatar} alt={result.author.nickname} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--accent)' }} />
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>@{result.author.nickname}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>TikTok Creator</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{result.title || 'TikTok Video'}</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div className="badge badge-success"><Play size={12} /> {result.statistics?.play_count?.toLocaleString() || '0'} Views</div>
                      <div className="badge badge-accent"><Download size={12} /> {result.statistics?.download_count?.toLocaleString() || '0'} Saves</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Likes</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.digg_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Shares</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.share_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Comments</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{result.statistics?.comment_count?.toLocaleString() || '0'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
                    <button
                      onClick={() => triggerDownload(result.play, 'video')}
                      disabled={downloading}
                      className="btn-primary"
                      style={{ padding: '1.25rem', fontSize: '1.125rem', width: '100%' }}
                    >
                      {downloading ? <Loader2 className="spinner" style={{ width: '20px', height: '20px' }} /> : <><Download size={22} /> Download (No Watermark)</>}
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <button
                        onClick={() => triggerDownload(result.music, 'music')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '1rem' }}
                      >
                        <Music size={18} /> Audio MP3
                      </button>
                      <button
                        onClick={() => triggerDownload(result.wmplay, 'video')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '1rem' }}
                      >
                        <Play size={18} /> Original (WM)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center', borderStyle: 'dashed', background: 'transparent' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Download size={48} color="var(--accent)" style={{ opacity: 0.5 }} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Ready to Download?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '400px', margin: '0 auto' }}>
                Paste a TikTok video link above and we'll instantly generate a watermark-free download for you.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="video-sidebar">
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 700 }}>
                <History size={20} className="text-[var(--accent)]" /> History
              </h3>
              {mounted && history.length > 0 && (
                <button onClick={clearHistory} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                  <Trash2 size={16} /> Clear
                </button>
              )}
            </div>

            {!mounted ? (
               <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-tertiary)' }}>
                <Loader2 className="spinner" style={{ width: '24px', height: '24px', margin: '0 auto' }} />
              </div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-tertiary)' }}>
                <p style={{ fontSize: '1rem' }}>No downloads yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setUrl(item.url)}
                    className="card"
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      gap: '1rem',
                      cursor: 'pointer',
                      background: 'var(--bg-secondary)',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-glow)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  >
                    <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <img src={item.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={16} color="white" fill="white" />
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <p className="line-clamp-1" style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{item.title}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '2rem', background: 'var(--gradient-primary)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.75rem' }}>Need More Tools?</h4>
              <p style={{ fontSize: '0.9375rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Check out our AI Video Upscaler to enhance your downloaded TikToks to 4K resolution!
              </p>
              <a href="/upscaler" className="glass" style={{ display: 'inline-flex', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
                Try AI Upscaler
              </a>
            </div>
            <Sparkles size={80} style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.2, transform: 'rotate(-15deg)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
