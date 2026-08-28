'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Music, 
  Play, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Zap, 
  Star, 
  Flame, 
  Bot, 
  ExternalLink,
  ArrowRight,
  Shield,
  Smartphone,
  Layers,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { statsService, PlatformStats } from '@/lib/statsService';

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

  // Live Statistics State (Murni Data Real Firestore)
  const [stats, setStats] = useState<PlatformStats>({
    tiktokDownloads: 0,
    instagramDownloads: 0,
    mp3Downloads: 0,
    totalUsers: 0,
    telegramUsers: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    setMounted(true);
    // Fetch live statistics from Firestore initially
    const loadStats = () => {
      statsService.getDownloadStats().then(data => {
        if (data) setStats(data);
      });
    };

    loadStats();
    // Live update stats every 5 seconds
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!url.includes('tiktok.com')) {
      addToast('Harap masukkan tautan video TikTok yang valid', 'error');
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
        throw new Error(data.error || 'Gagal mengambil data video');
      }

      setResult(data.data);
      addToast('Informasi video berhasil diambil!', 'success');
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
    addToast(`Menyiapkan ${type === 'video' ? 'video MP4' : 'audio MP3'}...`, 'info');

    try {
      const fileName = `${result.author.nickname}-${result.id || Date.now()}`;
      const proxyUrl = `/api/tiktok/download?url=${encodeURIComponent(targetUrl)}&name=${encodeURIComponent(fileName)}&type=${type}`;
      
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.setAttribute('download', `${fileName}${type === 'video' ? '.mp4' : '.mp3'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update stats in Firestore & local state
      statsService.incrementMetric(type === 'video' ? 'tiktok' : 'mp3');
      setStats(prev => ({
        ...prev,
        tiktokDownloads: type === 'video' ? prev.tiktokDownloads + 1 : prev.tiktokDownloads,
        mp3Downloads: type === 'music' ? prev.mp3Downloads + 1 : prev.mp3Downloads,
        totalRequests: prev.totalRequests + 1,
      }));

      addToast(`Unduhan ${type === 'video' ? 'Video HD' : 'Audio MP3'} dimulai!`, 'success');
    } catch (err) {
      addToast('Gagal memulai unduhan. Silakan coba lagi.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('tiktok.com')) {
        setUrl(text);
        addToast('Tautan berhasil ditempel!', 'success');
      } else {
        addToast('Clipboard tidak berisi tautan TikTok', 'info');
      }
    } catch (err) {
      addToast('Silakan tempel tautan secara manual', 'info');
    }
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <section className="hero-gradient" style={{ 
        borderRadius: 'var(--radius-xl)', 
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1.25rem, 5vw, 2rem)', 
        textAlign: 'center', 
        marginBottom: '2.5rem', 
        position: 'relative' 
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          
          {/* Live Download Counter Pill */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'rgba(16, 185, 129, 0.12)', 
            border: '1px solid rgba(16, 185, 129, 0.35)', 
            padding: '0.45rem 1.25rem', 
            borderRadius: '9999px', 
            color: '#10b981', 
            fontSize: '0.875rem', 
            fontWeight: 700, 
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} className="animate-pulse"></span>
            <Flame size={15} />
            <span>{stats.tiktokDownloads.toLocaleString()} Video Berhasil Diunduh</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4.25rem)', fontWeight: 900, marginBottom: '1.25rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Download Video TikTok <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Tanpa Watermark HD
            </span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto 2.5rem', fontWeight: 500, lineHeight: 1.6 }}>
            Alat pengunduh video TikTok tercepat & gratis. Simpan video Full HD asli tanpa logo, ekstrak lagu MP3 320kbps, atau gunakan <b>Telegram Bot resmi kami</b> untuk download instan.
          </p>

          {/* Search Form */}
          <form onSubmit={handleDownload} style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="glass-strong" style={{ display: 'flex', borderRadius: 'var(--radius-full)', padding: '0.625rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 1.25rem', color: 'var(--text-tertiary)' }}>
                <LinkIcon size={22} />
                <input
                  type="text"
                  placeholder="Tempel tautan video TikTok di sini (cth: https://vt.tiktok.com/...)"
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
                  style={{ border: 'none', background: 'var(--bg-tertiary)', padding: '0 1.75rem', fontSize: '0.9375rem', borderRadius: '9999px' }}
                >
                  Tempel
                </button>
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="btn-primary"
                  style={{ fontSize: '1rem', padding: '0 1.75rem', fontWeight: 700, borderRadius: '9999px' }}
                >
                  {loading ? <Loader2 className="spinner" style={{ width: '20px', height: '20px' }} /> : 'UNDUH'}
                </button>
              </div>
            </div>
          </form>
          
          {/* Trust Highlights */}
          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.75rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--success)" /> Tanpa Watermark</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--success)" /> Kualitas Asli HD MP4</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--success)" /> Ekstrak Musik MP3</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--success)" /> 100% Gratis & Anonim</div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>

        {/* 📊 LIVE PLATFORM ANALYTICS / STATS DASHBOARD 📊 */}
        <section style={{
          marginBottom: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          {/* Stat 1: Total Downloads */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Download size={20} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Unduhan</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.tiktokDownloads.toLocaleString()}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem', fontWeight: 600 }}>● Live Updating</p>
          </div>

          {/* Stat 2: Active Users */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Users size={20} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Pengguna Aktif</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.totalUsers.toLocaleString()}+
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Web & Bot Telegram</p>
          </div>

          {/* Stat 3: MP3 Converted */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Music size={20} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Musik MP3 Diekstrak</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {stats.mp3Downloads.toLocaleString()}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Audio Jernih 320kbps</p>
          </div>

          {/* Stat 4: Speed & Success Rate */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(34, 158, 217, 0.1)', color: '#229ED9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Zap size={20} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Kecepatan Konversi</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              ~0.8s
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem', fontWeight: 600 }}>99.9% Uptime</p>
          </div>
        </section>

        {/* 🌟 TELEGRAM BOT PROMO CARD BANNER 🌟 */}
        <section className="card" style={{
          background: 'linear-gradient(135deg, rgba(34, 158, 217, 0.12) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '1.5px solid rgba(34, 158, 217, 0.35)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.5rem',
          marginBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(34, 158, 217, 0.12)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.75rem' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#229ED9', color: '#ffffff', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>
                <Bot size={14} /> Telegram Bot Resmi ({stats.telegramUsers.toLocaleString()}+ Pengguna)
              </div>
              <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, marginBottom: '0.625rem', color: 'var(--text-primary)' }}>
                Download TikTok Lebih Cepat Lewat Telegram! 🤖⚡
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Malas buka browser? Cukup kirimkan link TikTok ke bot Telegram <b>@TiktokDownloader22bot</b>. Video Full HD tanpa watermark & audio MP3 akan langsung terkirim ke chat Anda dalam hitungan detik!
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>✅ Gratis 24/7 Nonstop</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>✅ Support Video & MP3</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>✅ Support TikTok & Instagram</span>
              </div>
            </div>

            <div style={{ flexShrink: 0 }}>
              <a
                href="https://t.me/TiktokDownloader22bot"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  background: 'linear-gradient(135deg, #229ED9, #0088cc)',
                  color: '#ffffff',
                  padding: '1rem 2rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(34, 158, 217, 0.35)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Send size={18} />
                Buka @TiktokDownloader22bot
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* Results & Error Section */}
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
          <div className="card animate-slide-up shadow-2xl" style={{ overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '5rem' }}>
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
              <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <div className="badge badge-success" style={{ marginBottom: '1rem' }}>
                    <CheckCircle2 size={12} /> Video Siap Diunduh
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.3 }}>{result.title || 'TikTok Video'}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div className="stat-card" style={{ padding: '0.875rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Suka</p>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800 }}>{result.statistics?.digg_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '0.875rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Bagikan</p>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800 }}>{result.statistics?.share_count?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="stat-card" style={{ padding: '0.875rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Tayang</p>
                      <p style={{ fontSize: '1.125rem', fontWeight: 800 }}>{result.statistics?.play_count?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      onClick={() => triggerDownload(result.play, 'video')}
                      disabled={downloading}
                      className="btn-primary"
                      style={{ padding: '1.25rem', fontSize: '1.125rem', width: '100%', fontWeight: 800, borderRadius: 'var(--radius-lg)' }}
                    >
                      {downloading ? <Loader2 className="spinner" style={{ width: '22px', height: '22px' }} /> : 'UNDUH VIDEO TANPA WATERMARK (HD)'}
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <button
                        onClick={() => triggerDownload(result.music, 'music')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '0.875rem', fontWeight: 600, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <Music size={16} /> Unduh Audio MP3
                      </button>
                      <button
                        onClick={() => triggerDownload(result.wmplay, 'video')}
                        disabled={downloading}
                        className="btn-secondary"
                        style={{ padding: '0.875rem', fontWeight: 600, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <Play size={16} /> Dengan Watermark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informational & Features Grid */}
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', marginBottom: '6rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
              <div className="glass" style={{ width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent)' }}>
                <Sparkles size={30} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>Tanpa Batasan Unduhan</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Nikmati akses unduhan video TikTok sepuasnya tanpa kuota harian, tanpa registrasi, dan 100% gratis selamanya.
              </p>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
              <div className="glass" style={{ width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#229ED9' }}>
                <Bot size={30} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>Tersedia Telegram Bot</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Akses downloader langsung dari aplikasi Telegram melalui <a href="https://t.me/TiktokDownloader22bot" target="_blank" rel="noopener noreferrer" style={{ color: '#229ED9', fontWeight: 700 }}>@TiktokDownloader22bot</a> untuk kecepatan maksimal.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.75rem' }}>
              <div className="glass" style={{ width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
                <Music size={30} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem' }}>Konversi MP3 Jernih</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Ekstrak background music atau sound viral TikTok ke file audio MP3 berkualitas tinggi dengan satu klik.
              </p>
            </div>
          </div>

          {/* How to Download Section */}
          <section style={{ marginBottom: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Cara Mudah Unduh Video TikTok</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Simpan video ke perangkat Anda dalam 3 langkah singkat.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.75rem' }}>
              <div className="card" style={{ padding: '2rem', position: 'relative' }}>
                <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.08, position: 'absolute', top: -5, right: 15 }}>1</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent)' }}>1. Salin Tautan</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Buka aplikasi TikTok, pilih video yang Anda sukai, klik tombol <b>Bagikan (Share)</b> lalu pilih <b>Salin Tautan</b>.</p>
              </div>
              <div className="card" style={{ padding: '2rem', position: 'relative' }}>
                <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.08, position: 'absolute', top: -5, right: 15 }}>2</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent)' }}>2. Tempel di Vidgram</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Tempelkan link ke kolom input di atas atau kirimkan ke bot Telegram <b>@TiktokDownloader22bot</b>.</p>
              </div>
              <div className="card" style={{ padding: '2rem', position: 'relative' }}>
                <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.08, position: 'absolute', top: -5, right: 15 }}>3</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent)' }}>3. Unduh Video HD</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Pilih format yang diinginkan (MP4 No Watermark atau Audio MP3), file langsung tersimpan di galeri perangkat Anda.</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section style={{ marginBottom: '6rem', maxWidth: '850px', margin: '0 auto 6rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '2.5rem', textAlign: 'center' }}>Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  q: "Bagaimana cara menggunakan Telegram Bot TikTok Downloader?",
                  a: "Sangat mudah! Buka aplikasi Telegram Anda, cari bot @TiktokDownloader22bot (atau klik tautan di halaman ini), lalu kirimkan link TikTok ke ruang obrolan bot. Bot akan langsung mengirimkan video MP4 tanpa watermark & audio MP3 ke chat Anda."
                },
                {
                  q: "Apakah layanan download video TikTok di Vidgram ini gratis?",
                  a: "Ya, layanan pengunduhan di Vidgram (baik melalui website maupun Telegram Bot) 100% gratis tanpa biaya tersembunyi dan tanpa batasan jumlah unduhan harian."
                },
                {
                  q: "Apakah video yang diunduh benar-benar bebas watermark?",
                  a: "Ya! Sistem kami mengambil stream video mentah beresolusi HD langsung dari server CDN tanpa logo atau watermark mengambang TikTok."
                },
                {
                  q: "Apakah saya bisa mendownload lagu TikTok saja dalam format MP3?",
                  a: "Bisa. Klik tombol 'Unduh Audio MP3' setelah menempelkan tautan, dan sistem akan mengonversi audio video menjadi file MP3 murni berkualitas jernih."
                },
                {
                  q: "Apakah Vidgram menyimpan video yang saya unduh?",
                  a: "Tidak. Vidgram sangat mengutamakan privasi pengguna. Kami tidak menyimpan arsip video unduhan Anda di server kami; semua unduhan diproses secara aman dan langsung ke perangkat Anda."
                }
              ].map((faq, i) => (
                <details key={i} className="card" style={{ padding: '0', cursor: 'pointer', borderRadius: 'var(--radius-lg)' }}>
                  <summary style={{ padding: '1.5rem 1.75rem', fontWeight: 700, fontSize: '1.05rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {faq.q}
                    <span style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>+</span>
                  </summary>
                  <div style={{ padding: '0 1.75rem 1.75rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Deep SEO Content & Promotion */}
          <section style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem', paddingBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '3.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  Pengunduh Video TikTok No Watermark Terpercaya
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                  Vidgram adalah platform pengunduh video TikTok generasi terbaru yang dirancang untuk memberikan kemudahan, kecepatan, dan kualitas terbaik bagi kreator konten maupun penikmat video. Dengan arsitektur serverless modern, proses konversi dan pengunduhan berlangsung tanpa jeda bahkan di saat jam sibuk.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  Kini, dengan hadirnya integrasi <b>Telegram Bot @TiktokDownloader22bot</b>, Anda memiliki fleksibilitas penuh untuk mengunduh konten favorit kapan saja, baik melalui browser desktop maupun langsung dari smartphone via aplikasi Telegram.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  Dukungan Penuh Semua Perangkat & Privasi Total
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                  Situs dan bot kami kompatibel 100% dengan perangkat Android, iOS (iPhone/iPad), Windows PC, MacOS, dan Linux tanpa memerlukan instalasi aplikasi tambahan atau ekstensi browser yang mencurigakan.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  Nikmati pengalaman bebas watermark, tanpa iklan pop-up berbahaya, dan didukung oleh komitmen perlindungan privasi tertinggi di industri. Coba sekarang dan buktikan kecepatannya!
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
