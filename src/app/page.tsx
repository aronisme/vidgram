import { videoService } from "@/lib/videoService";
import VideoCard from "@/components/VideoCard";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const videos = await videoService.getVideos(6);

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

      {/* Features Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }} className="stagger-children">
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
