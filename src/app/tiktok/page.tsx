'use client';

import React, { useState, useEffect } from 'react';
import { Download, Link as LinkIcon, Trash2, History, AlertCircle, CheckCircle2, Loader2, Music, User, Share2 } from 'lucide-react';

interface TikTokData {
  title: string;
  cover: string;
  play: string;
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
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TikTokData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
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
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(7),
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
        throw new Error(data.error || 'Failed to download video');
      }

      setResult(data.data);
      saveToHistory(data.data, url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('tiktok_download_history');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ borderRadius: 'var(--radius-xl)', padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>
            <Download size={14} /> TikTok Downloader
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Download TikToks <br />
            <span style={{ color: 'var(--accent)' }}>Without Watermark</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Save your favorite TikTok videos in high quality with just one click. Paste the link below to get started.
          </p>

          {/* Search Form */}
          <form onSubmit={handleDownload} style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="glass-strong" style={{ display: 'flex', borderRadius: 'var(--radius-full)', padding: '0.5rem', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1rem', color: 'var(--text-tertiary)' }}>
                <LinkIcon size={20} />
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
                    padding: '0.75rem',
                    width: '100%',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="btn-secondary desktop-only"
                  style={{ border: 'none', background: 'var(--bg-tertiary)' }}
                >
                  Paste
                </button>
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="btn-primary"
                  style={{ minWidth: '140px' }}
                >
                  {loading ? <Loader2 className="spinner" style={{ width: '20px', height: '20px' }} /> : 'Download'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="video-detail-layout">
        {/* Results / Error Area */}
        <div style={{ flex: 1 }}>
          {error && (
            <div className="card animate-slide-up" style={{ padding: '2rem', border: '1px solid var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.05)', textAlign: 'center' }}>
              <AlertCircle size={48} color="var(--error)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Something went wrong</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          )}

          {result && (
            <div className="card animate-slide-up" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '9/16', backgroundColor: '#000', overflow: 'hidden' }}>
                  <img
                    src={result.cover}
                    alt={result.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                    <div className="glass" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={result.author.avatar} alt={result.author.nickname} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>@{result.author.nickname}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>{result.title}</h2>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Likes</p>
                      <p style={{ fontWeight: 700 }}>{result.statistics.digg_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shares</p>
                      <p style={{ fontWeight: 700 }}>{result.statistics.share_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comments</p>
                      <p style={{ fontWeight: 700 }}>{result.statistics.comment_count.toLocaleString()}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
                    <a
                      href={result.play}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: '1rem', fontSize: '1rem' }}
                      download
                    >
                      <Download size={20} /> Download No Watermark
                    </a>
                    <a
                      href={result.music}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '1rem', fontSize: '1rem' }}
                    >
                      <Music size={20} /> Download Music
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <LinkIcon size={32} color="var(--text-tertiary)" />
              </div>
              <h3>Ready to download?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Enter a TikTok video link above and we'll handle the rest.</p>
            </div>
          )}
        </div>

        {/* Sidebar / History Area */}
        <div className="video-sidebar">
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} /> Recent Downloads
              </h3>
              {history.length > 0 && (
                <button onClick={clearHistory} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-tertiary)' }}>
                <p style={{ fontSize: '0.875rem' }}>No recent downloads yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setUrl(item.url)}
                    className="glass"
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent',
                    }}
                  >
                    <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p className="line-clamp-1" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.5rem', background: 'var(--accent-light)', border: '1px solid var(--accent-glow)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent)' }}>Pro Tip</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              You can download TikTok videos from your profile or feed by copying the share link and pasting it here. Works for both mobile and desktop links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
