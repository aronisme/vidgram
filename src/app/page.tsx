import { serverVideoService } from "@/lib/serverVideoService";
import VideoCard from "@/components/VideoCard";
import { ArrowRight, Zap, Shield, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering — data is always fresh from Firestore
export const dynamic = 'force-dynamic';

export default async function Home() {
  const videos = await serverVideoService.getVideos(6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '2rem' }}>

      {/* Hero Section */}
      <section className="hero-gradient animate-fade-in" style={{
        borderRadius: 'var(--radius-xl)',
        padding: '4rem 2rem',
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.5rem',
        position: 'relative',
      }}>
        <div className="badge-accent" style={{ fontSize: '0.8125rem', fontWeight: 600, padding: '0.375rem 1rem' }}>
          🎬 Next-Gen Video Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: '700px',
        }}>
          Unleash Your Creativity with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}>Vidgram</span>
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          lineHeight: 1.6,
        }}>
          The lightning-fast, beautiful video platform engineered for maximum discoverability and seamless streaming.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link href="/upscaler" style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--accent)',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.9375rem',
            border: '1.5px solid var(--accent)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.25s ease',
          }}>
            <Sparkles size={18} /> AI Video Upscaler
          </Link>
          <Link href="/dashboard/upload" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.9375rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
            transition: 'all 0.25s ease',
          }}>
            Start Sharing <ArrowRight size={18} />
          </Link>
          <Link href="/discovery" style={{
            background: 'transparent',
            color: 'var(--text-primary)',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.9375rem',
            border: '1.5px solid var(--border)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.25s ease',
          }}>
            Browse Videos
          </Link>
        </div>
      </section>

      {/* Trending Section */}
      <section className="animate-slide-up">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <Link href="/discovery" style={{
            color: 'var(--accent)',
            fontWeight: 600,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease',
          }}>
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className="video-grid stagger-children">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '3rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}>
            <p>No videos found yet. Be the first to upload!</p>
          </div>
        )}
      </section>

      {/* Dark Ai Section */}
      <section className="animate-slide-up" style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2rem',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Tanya Dark Ai</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
            Butuh ide konten atau bantuan teknis? Asisten cerdas kami siap membantu Anda 24/7.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '800px'
        }}>
          <Link href="/dark-ai?q=Bantu saya buat skrip video viral" className="card" style={{
            padding: '1.5rem',
            textDecoration: 'none',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'var(--bg-primary)'
          }}>
            <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '0.75rem', borderRadius: '12px' }}>
              <Zap size={20} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>Skrip Video Viral</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Buat konsep konten dalam hitungan detik.</p>
            </div>
          </Link>

          <Link href="/dark-ai?q=Optimasi judul dan deskripsi video saya" className="card" style={{
            padding: '1.5rem',
            textDecoration: 'none',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'var(--bg-primary)'
          }}>
            <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '0.75rem', borderRadius: '12px' }}>
              <Globe size={20} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>Optimasi SEO</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Judul & deskripsi yang menarik penonton.</p>
            </div>
          </Link>
        </div>

        <Link href="/dark-ai" className="btn-primary">
          Coba Dark Ai Sekarang <ArrowRight size={18} />
        </Link>
      </section>

      {/* Features Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
      }} className="stagger-children">
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--gradient-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Upscaling</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Enhance your videos to 1080p and 4K quality using WebGPU power directly in your browser.</p>
        </div>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--gradient-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
            <Zap size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Blazing Fast</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Instant playback and optimized streaming anywhere.</p>
        </div>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--gradient-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
            <Shield size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Creator First</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Built to help you grow your audience and protect your content.</p>
        </div>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--gradient-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
            <Globe size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Global Reach</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Automated SEO metadata helps your videos get discovered.</p>
        </div>
      </section >
    </div >
  );
}
