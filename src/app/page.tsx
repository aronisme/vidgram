import { serverVideoService } from "@/lib/serverVideoService";
import { serverImageService } from "@/lib/serverImageService";
import VideoCard from "@/components/VideoCard";
import ImagePostCard from "@/components/ImagePostCard";
import { ArrowRight, Zap, Shield, Globe, Sparkles, Instagram, Download, Video, ShieldCheck, Star, Upload, Check } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering — data is always fresh from Firestore
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [videos, imagePosts] = await Promise.all([
    serverVideoService.getVideos(8),
    serverImageService.getPublicImagePosts(8)
  ]);

  const allPosts = [...videos, ...imagePosts].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  }).slice(0, 10);

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
          🎬 Next-Gen Creator Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: '700px',
        }}>
          Grow Your Video Presence with{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
          }}>Vidgram AI</span>
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          lineHeight: 1.6,
        }}>
          The only platform combining AI video enhancement, privacy-focused downloaders, and growth tools to help creators succeed.
        </p>

        {/* Trust Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '2rem', margin: '0.5rem 0 1rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>50,000+ Creators Trust Vidgram</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="var(--accent)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Privacy-Focused Downloaders</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={18} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>4.9/5 Creator Satisfaction</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link href="/instagram" className="btn-instagram" style={{
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.9375rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Instagram size={18} /> Instagram Downloader
          </Link>
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

        {allPosts.length > 0 ? (
          <div className="video-grid stagger-children">
            {allPosts.map((post) => {
              if ('images' in post) {
                return <ImagePostCard key={`img-${post.id}`} post={post as any} />;
              } else {
                return <VideoCard key={`vid-${post.id}`} video={post as any} />;
              }
            })}
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
            <p>No posts found yet. Be the first to upload!</p>
          </div>
        )}
      </section>

      {/* Downloader Tools Section */}
      <section className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div className="section-header" style={{ marginBottom: '0.5rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Premium Downloader Tools
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Simpan video dan media berkualitas tinggi secara instan dari platform sosial terpopuler.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {/* Instagram Downloader Card */}
          <div className="card card-instagram" style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f9ce34 10%, #ee2a7b 50%, #6228d7 100%)',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(238, 42, 123, 0.3)',
              }}>
                <Instagram size={24} />
              </div>
              <span className="badge" style={{ background: 'rgba(238, 42, 123, 0.12)', color: '#ee2a7b', border: '1px solid rgba(238, 42, 123, 0.25)', fontWeight: 700 }}>
                HD & CAROUSEL
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Instagram Reels & Foto Downloader
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Simpan video Reels, foto tunggal, atau slide postingan carousel dari Instagram secara cepat dan gratis. Tanpa perlu log in akun.
              </p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
              <Link href="/instagram" className="btn-primary" style={{
                background: 'linear-gradient(135deg, #ee2a7b, #6228d7)',
                color: 'white',
                width: '100%',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 4px 12px rgba(238, 42, 123, 0.25)',
              }}>
                Coba Instagram Downloader <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* TikTok Downloader Card */}
          <div className="card card-tiktok" style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #00f2ea, #ff007f)',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0, 242, 234, 0.3)',
              }}>
                <Video size={24} />
              </div>
              <span className="badge" style={{ background: 'rgba(0, 242, 234, 0.12)', color: '#00c3bc', border: '1px solid rgba(0, 242, 234, 0.25)', fontWeight: 700 }}>
                NO WATERMARK
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                TikTok Video Downloader
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Unduh video TikTok tanpa tanda air (watermark) dalam resolusi MP4 HD. Nikmati unduhan ultra cepat tanpa batas kuota.
              </p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
              <Link href="/tiktok" className="btn-primary" style={{
                background: 'linear-gradient(135deg, #00f2ea, #00c3bc)',
                color: 'white',
                width: '100%',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 242, 234, 0.25)',
              }}>
                Coba TikTok Downloader <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
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

      {/* Enhanced CTA Section */}
      <section className="animate-slide-up" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '4rem 2rem',
        textAlign: 'center',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        marginTop: '2rem'
      }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Ready to Grow Your Video Presence?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Join 50,000+ creators using Vidgram's AI-powered tools to enhance, download, and optimize their videos.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link href="/dashboard/upload" className="btn-primary" style={{ padding: '0.75rem 2rem', textDecoration: 'none' }}>
            Start Creating <Upload size={18} />
          </Link>
          <Link href="/upscaler" className="btn-secondary" style={{ padding: '0.75rem 2rem', textDecoration: 'none' }}>
            Try AI Upscaler <Sparkles size={18} />
          </Link>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'center' }}>
          <Check size={16} color="#10b981" /> No credit card required · 100% privacy protected
        </p>
      </section>

      {/* Structured SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Vidgram",
            "url": "https://vidgram.app",
            "description": "Next-generation AI-powered video growth platform, AI enhancer, and social downloader suite.",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "All",
            "browserRequirements": "Requires HTML5 browser support.",
            "featureList": [
              "AI Video Upscaling",
              "TikTok Video Downloader No Watermark",
              "Instagram Reels & Photo Downloader",
              "AI Content Assistant"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </div >
  );
}
