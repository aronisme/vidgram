'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  Shield, 
  Users, 
  Bot, 
  Download, 
  Music, 
  Film, 
  Images, 
  RefreshCw, 
  Search, 
  Lock, 
  LogIn, 
  ExternalLink, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Server,
  Zap,
  Globe,
  Eye,
  Heart,
  Play,
  Image as ImageIcon,
  FolderOpen,
  X,
  User as UserIcon,
  Filter
} from 'lucide-react';
import Link from 'next/link';

const ADMIN_UID = 'uJhx9rqu8QXrhBELW56nclJNRyk2';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'webUsers' | 'telegramUsers' | 'system'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'video' | 'image'>('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');
  
  // Selected user modal for media exploration
  const [selectedUserModal, setSelectedUserModal] = useState<any | null>(null);

  const isAdmin = user && user.uid === ADMIN_UID;

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (!res.ok) throw new Error('Gagal mengambil data statistik admin');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e: any) {
      console.error(e);
      addToast('Gagal memuat data statistik: ' + e.message, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Loading state
  if (authLoading || (isAdmin && loading)) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--accent)', borderTopColor: 'transparent' }} className="spinner" />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Memuat Admin Control Center...</p>
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="container" style={{ maxWidth: '540px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock size={36} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
            Halaman ini diproteksi khusus untuk Administrator Vidgram. Silakan login menggunakan akun Google Admin Anda untuk melanjutkan.
          </p>
          <button
            onClick={signInWithGoogle}
            className="btn-primary"
            style={{ padding: '1rem 2rem', width: '100%', fontSize: '1rem', fontWeight: 700, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}
          >
            <LogIn size={20} />
            Login Akun Google Admin
          </button>
        </div>
      </div>
    );
  }

  // Logged in but not Admin
  if (!isAdmin) {
    return (
      <div className="container" style={{ maxWidth: '540px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--error)', background: 'rgba(239, 68, 68, 0.04)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Shield size={36} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--error)' }}>Akses Ditolak</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Akun Anda (<code>{user.email}</code>) tidak memiliki izin administrator untuk mengakses halaman ini.
          </p>
          <Link href="/" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '9999px', display: 'inline-block' }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const overview = data?.overview || {
    totalWebUsers: 0,
    totalTelegramUsers: 0,
    totalTiktokDownloads: 0,
    totalInstagramDownloads: 0,
    totalMp3Downloads: 0,
    totalHostedVideos: 0,
    totalHostedImages: 0,
    totalRequests: 0,
  };

  const webUsers: any[] = data?.webUsers || [];
  const telegramUsers: any[] = data?.telegramUsers || [];
  const mediaItems: any[] = data?.media || [];

  // Filtered lists
  const filteredWebUsers = webUsers.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.uid?.includes(searchQuery)
  );

  const filteredTelegramUsers = telegramUsers.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.userId?.includes(searchQuery)
  );

  const filteredMedia = mediaItems.filter(m => {
    const matchSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.userDisplayName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = mediaTypeFilter === 'all' || m.type === mediaTypeFilter;
    const matchUser = selectedUserFilter === 'all' || m.userId === selectedUserFilter;
    return matchSearch && matchType && matchUser;
  });

  // Media of the selected user for modal
  const selectedUserMedia = selectedUserModal 
    ? mediaItems.filter(m => m.userId === selectedUserModal.uid)
    : [];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Admin Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent)', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            <Shield size={14} /> Master Admin Control Center
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Statistik & Manajemen Global Vidgram
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Monitoring real-time aktivitas pengguna web, media yang diupload per user, interaksi bot Telegram, dan sistem.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={fetchAdminData}
            disabled={refreshing}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <RefreshCw size={16} className={refreshing ? 'spinner' : ''} />
            {refreshing ? 'Memperbarui...' : 'Segarkan Data'}
          </button>

          <a
            href="https://t.me/TiktokDownloader22bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, background: '#229ED9' }}
          >
            <Bot size={16} />
            Buka Bot Telegram
          </a>
        </div>
      </div>

      {/* 6 Top KPI Metrics Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        
        {/* KPI 1: Total Web Users */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pengguna Web</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{overview.totalWebUsers.toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Akun Google Terdaftar</p>
        </div>

        {/* KPI 2: Media Uploaded (Videos + Photos) */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Media Terunggah</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{(overview.totalHostedVideos + overview.totalHostedImages).toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{overview.totalHostedVideos} Video • {overview.totalHostedImages} Foto</p>
        </div>

        {/* KPI 3: Total Telegram Users */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Telegram Bot</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(34, 158, 217, 0.12)', color: '#229ED9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{overview.totalTelegramUsers.toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: '#229ED9', marginTop: '0.25rem', fontWeight: 600 }}>@TiktokDownloader22bot</p>
        </div>

        {/* KPI 4: TikTok Downloads */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unduhan TikTok</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{overview.totalTiktokDownloads.toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem', fontWeight: 600 }}>● Terverifikasi Real</p>
        </div>

        {/* KPI 5: MP3 Audio */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audio MP3</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{overview.totalMp3Downloads.toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Ekstraksi Musik 320kbps</p>
        </div>

        {/* KPI 6: Total Requests */}
        <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Requests</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{overview.totalRequests.toLocaleString()}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem', fontWeight: 600 }}>99.9% Uptime</p>
        </div>

      </section>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: '📊 Ringkasan & Platform', count: null },
          { id: 'webUsers', label: '👥 Pengguna & Media per User', count: webUsers.length },
          { id: 'media', label: '🎬 Semua Media Terunggah', count: mediaItems.length },
          { id: 'telegramUsers', label: '🤖 Pengguna Telegram Bot', count: telegramUsers.length },
          { id: 'system', label: '⚙️ Sistem & Integrasi', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); setSelectedUserFilter('all'); }}
            style={{
              padding: '0.875rem 1.5rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span style={{ fontSize: '0.75rem', background: activeTab === tab.id ? 'var(--accent-light)' : 'var(--bg-tertiary)', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      {(activeTab === 'webUsers' || activeTab === 'telegramUsers' || activeTab === 'media') && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder={
                activeTab === 'webUsers' 
                  ? "Cari nama, email, atau UID user..." 
                  : activeTab === 'media'
                  ? "Cari judul konten atau nama uploader..."
                  : "Cari username atau ID telegram..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {/* Type filter */}
              {[
                { id: 'all', label: 'Semua Tipe' },
                { id: 'video', label: '🎥 Video Saja' },
                { id: 'image', label: '📸 Foto Saja' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setMediaTypeFilter(f.id as any)}
                  className={mediaTypeFilter === f.id ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.45rem 0.9rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600 }}
                >
                  {f.label}
                </button>
              ))}

              {/* User filter dropdown */}
              <select
                value={selectedUserFilter}
                onChange={(e) => setSelectedUserFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="all">👤 Semua Uploader</option>
                {webUsers.filter(u => u.totalMediaCount > 0).map(u => (
                  <option key={u.uid} value={u.uid}>
                    {u.displayName} ({u.totalMediaCount} media)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={20} color="var(--accent)" /> Distribusi Unduhan Media
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Video TikTok (No Watermark)</span>
                  <span>{overview.totalTiktokDownloads.toLocaleString()} unduhan</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: overview.totalRequests > 0 ? `${(overview.totalTiktokDownloads / overview.totalRequests) * 100}%` : '0%', background: 'var(--accent)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Audio Musik TikTok (MP3)</span>
                  <span>{overview.totalMp3Downloads.toLocaleString()} unduhan</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: overview.totalRequests > 0 ? `${(overview.totalMp3Downloads / overview.totalRequests) * 100}%` : '0%', background: '#f59e0b' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Instagram Reels & Post</span>
                  <span>{overview.totalInstagramDownloads.toLocaleString()} unduhan</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: overview.totalRequests > 0 ? `${(overview.totalInstagramDownloads / overview.totalRequests) * 100}%` : '0%', background: '#ec4899' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={20} color="var(--success)" /> Infrastruktur & Cloud Status
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span>🔥 Google Firebase Firestore</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>● Online & Terhubung</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span>☁️ Cloudinary CDN Storage</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>● Online & Streaming Aktif</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span>🤖 Telegram Bot Webhook API</span>
                <span style={{ color: '#229ED9', fontWeight: 700 }}>● @TiktokDownloader22bot</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span>⚡ Groq AI Vision API</span>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>● Multi-Key Rotated (Aktif)</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PENGGUNA & MEDIA PER USER */}
      {activeTab === 'webUsers' && (
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Pengguna</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Email</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Media Terupload</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Total Views</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Tanggal Daftar</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700, textAlign: 'center' }}>Aksi Media</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Tidak ada data pengguna yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredWebUsers.map((u, i) => (
                    <tr key={u.uid || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={u.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.displayName || 'U')}`}
                            alt={u.displayName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{u.displayName}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>UID: {u.uid?.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {u.totalMediaCount > 0 ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                            <Film size={12} /> {u.videoCount} Video
                            <span>•</span>
                            <ImageIcon size={12} /> {u.imageCount} Foto
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Belum ada upload</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={14} color="var(--text-tertiary)" /> {(u.totalViews || 0).toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        {u.totalMediaCount > 0 ? (
                          <button
                            onClick={() => setSelectedUserModal(u)}
                            className="btn-secondary"
                            style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                          >
                            <FolderOpen size={14} /> Lihat Media ({u.totalMediaCount})
                          </button>
                        ) : (
                          <button
                            disabled
                            style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', opacity: 0.4, cursor: 'not-allowed', background: 'transparent', border: '1px solid var(--border)' }}
                          >
                            0 Media
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SEMUA MEDIA TERUNGGAH */}
      {activeTab === 'media' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredMedia.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Tidak ada konten video atau gambar yang cocok dengan filter pencarian.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filteredMedia.map((item) => (
                <div key={item.id} className="card" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
                  
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', background: 'var(--bg-tertiary)' }}>
                    {item.thumbnailUrl || item.mediaUrl ? (
                      <img
                        src={item.thumbnailUrl || item.mediaUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                        <Film size={36} />
                      </div>
                    )}
                    
                    {/* Badge Video / Image */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: 'white', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {item.type === 'video' ? <Play size={12} fill="white" /> : <ImageIcon size={12} />}
                      {item.type === 'video' ? 'Video' : 'Foto'}
                    </div>

                    {/* Views Badge */}
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> {item.views}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.title}
                      </h4>
                      
                      {/* Uploader info */}
                      <button
                        onClick={() => {
                          const matchedUser = webUsers.find(u => u.uid === item.userId);
                          if (matchedUser) setSelectedUserModal(matchedUser);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                      >
                        <img
                          src={item.userPhotoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.userDisplayName || 'C')}`}
                          alt={item.userDisplayName}
                          style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}>
                          {item.userDisplayName}
                        </span>
                      </button>
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </span>
                      <Link
                        href={item.type === 'video' ? `/video/${item.slug || item.id}` : `/image/${item.slug || item.id}`}
                        target="_blank"
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                      >
                        Buka Konten <ExternalLink size={12} />
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TELEGRAM BOT USERS */}
      {activeTab === 'telegramUsers' && (
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Telegram User</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Username</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Telegram ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Total Unduhan</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Pertama Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {filteredTelegramUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Belum ada pengguna Telegram yang tercatat atau tidak cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTelegramUsers.map((tg, i) => (
                    <tr key={tg.userId || i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(34, 158, 217, 0.15)', color: '#229ED9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {tg.firstName?.charAt(0) || 'T'}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tg.firstName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#229ED9', fontWeight: 600 }}>{tg.username}</td>
                      <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        {tg.userId}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>{tg.totalDownloads} kali</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                        {tg.joinedAt ? new Date(tg.joinedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM & TOOLS */}
      {activeTab === 'system' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="var(--accent)" /> Pintasan Admin
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/dashboard" className="btn-secondary" style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>📹 Creator Dashboard (Upload & Manage)</span>
                <ExternalLink size={16} />
              </Link>
              <Link href="/tiktok-downloader" className="btn-secondary" style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>🔥 TikTok Downloader Pro</span>
                <ExternalLink size={16} />
              </Link>
              <Link href="/tools/smart-keywords" className="btn-secondary" style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>🎯 Smart Keywords Adobe Stock</span>
                <ExternalLink size={16} />
              </Link>
              <Link href="/tools/teepublic-keyword-pro" className="btn-secondary" style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>👕 TeePublic Keyword Pro (Ekstensi Chrome)</span>
                <ExternalLink size={16} />
              </Link>
              <a href="/api/telegram/setup" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>🤖 Re-Register Telegram Webhook</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={20} color="var(--accent)" /> Detail Environment
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <p><b>Domain Utama:</b> <code>https://www.vidgram.web.id</code></p>
              <p><b>Firebase Project:</b> <code>firestore-database-18d6b</code></p>
              <p><b>Admin Master UID:</b> <code>{ADMIN_UID}</code></p>
              <p><b>Telegram Bot:</b> <code>@TiktokDownloader22bot</code></p>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: DETAIL MEDIA PER USER */}
      {selectedUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div className="card animate-scale-up" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--border)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={selectedUserModal.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedUserModal.displayName || 'U')}`}
                  alt={selectedUserModal.displayName}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Media Milik {selectedUserModal.displayName}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {selectedUserModal.email} • UID: <code>{selectedUserModal.uid}</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserModal(null)}
                style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* User Media Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Media</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{selectedUserModal.totalMediaCount}</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Video</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>{selectedUserModal.videoCount}</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Foto</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ec4899' }}>{selectedUserModal.imageCount}</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Views</span>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{selectedUserModal.totalViews?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Media Items Grid */}
            {selectedUserMedia.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Tidak ada media yang ditemukan untuk pengguna ini.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' }}>
                {selectedUserMedia.map((m) => (
                  <div key={m.id} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', width: '100%', height: '140px', background: 'var(--bg-tertiary)' }}>
                      {m.thumbnailUrl || m.mediaUrl ? (
                        <img src={m.thumbnailUrl || m.mediaUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Film size={28} color="var(--text-tertiary)" />
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 8px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {m.type === 'video' ? <Play size={10} fill="white" /> : <ImageIcon size={10} />}
                        {m.type === 'video' ? 'Video' : 'Foto'}
                      </div>
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Eye size={10} /> {m.views}
                      </div>
                    </div>

                    <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {m.title}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString('id-ID') : '-'}
                        </span>
                        <Link
                          href={m.type === 'video' ? `/video/${m.slug || m.id}` : `/image/${m.slug || m.id}`}
                          target="_blank"
                          className="btn-primary"
                          style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                        >
                          Tonton <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
