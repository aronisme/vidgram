import { videoService } from "@/lib/videoService";
import VideoCard from "@/components/VideoCard";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const videos = await videoService.getVideos(6);

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto py-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
          Share Your Story with <span className="text-[var(--accent)]">Vidgram</span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)]">
          The minimalist video sharing platform designed for speed, beauty, and search engine optimization.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <Link href="/upload" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
            Start Sharing <ArrowRight size={20} />
          </Link>
          <Link href="/discovery" className="glass px-8 py-4 rounded-var(--radius-md)] font-semibold hover:bg-[var(--border)] transition-colors">
            Browse Videos
          </Link>
        </div>
      </section>

      {/* Popular Videos Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Link href="/discovery" className="text-[var(--accent)] font-semibold flex items-center gap-1.5 hover:underline">
            View all <ArrowRight size={18} />
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="glass p-12 text-center rounded-[var(--radius-lg)]">
            <p className="text-[var(--text-secondary)]">No videos found yet. Be the first to upload!</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid sm:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-[var(--radius-lg)] flex flex-col gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600">
            <Zap size={24} />
          </div>
          <h3 className="font-bold text-xl">Lightning Fast</h3>
          <p className="text-[var(--text-secondary)]">Optimized for performance with Cloudinary transformations and Next.js SSR.</p>
        </div>
        <div className="glass p-8 rounded-[var(--radius-lg)] flex flex-col gap-4">
          <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-green-600">
            <Globe size={24} />
          </div>
          <h3 className="font-bold text-xl">SEO Ready</h3>
          <p className="text-[var(--text-secondary)]">Built-in JSON-LD schemas and dynamic metadata to help your videos get discovered.</p>
        </div>
        <div className="glass p-8 rounded-[var(--radius-lg)] flex flex-col gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600">
            <Shield size={24} />
          </div>
          <h3 className="font-bold text-xl">Cloud Powered</h3>
          <p className="text-[var(--text-secondary)]">Secure video hosting on Cloudinary with global CDN for instant playback.</p>
        </div>
      </section>
    </div>
  );
}
