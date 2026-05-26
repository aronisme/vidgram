import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Monitor, Smartphone, Tablet, Apple, Zap } from 'lucide-react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedArticles from '@/components/RelatedArticles';

export const metadata: Metadata = {
  title: "How to Download TikTok Videos on PC, Mac, iPhone & Android (2026) | Vidgram",
  description: "Complete device-specific guide to downloading TikTok videos on Windows PC, Mac, iPhone (iOS), and Android. Step-by-step instructions for every platform. No app or software needed.",
  keywords: ["download TikTok on PC", "download TikTok on Mac", "TikTok downloader iPhone", "save TikTok Android", "download TikTok on computer", "TikTok downloader for laptop", "save TikTok video iOS", "TikTok download Windows", "download TikTok without app"],
  alternates: { canonical: "https://vidgram.web.id/blog/download-tiktok-videos-pc-mac-iphone-android" },
  openGraph: {
    title: "How to Download TikTok Videos on PC, Mac, iPhone & Android | Vidgram",
    description: "Step-by-step TikTok download guide for every device. No app needed.",
    url: "https://vidgram.web.id/blog/download-tiktok-videos-pc-mac-iphone-android",
    siteName: "Vidgram", locale: "en_US", type: "article",
    images: [{ url: "https://vidgram.web.id/og-tiktok.png", width: 1200, height: 630, alt: "Download TikTok on Any Device" }],
  },
  twitter: { card: "summary_large_image", title: "Download TikTok on PC, Mac, iPhone & Android | Vidgram", description: "Complete device-specific TikTok download guide.", images: ["https://vidgram.web.id/og-tiktok.png"] },
};

export default function DeviceSpecificTikTokGuide() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', paddingTop: '4rem', paddingBottom: '6rem' }}>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: 'Download TikTok on Any Device' }]} />
      <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: '3rem', fontWeight: 600 }}><ArrowLeft size={18} /> Back to Blog</Link>

      <header style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <span className="badge badge-accent">TikTok</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}><Clock size={14} /> 10 min read</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
          How to Download TikTok Videos on PC, Mac, iPhone &amp; Android (2026 Guide)
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>VT</div>
            <div><p style={{ fontWeight: 700 }}>Vidgram Team</p><p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>May 27, 2026</p></div>
          </div>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Share2 size={16} /> Share</button>
        </div>
      </header>

      <div className="blog-content">
        <p>Downloading TikTok videos works slightly differently depending on your device. Whether you&apos;re on a <strong>Windows PC, Mac, iPhone, or Android phone</strong>, this guide gives you step-by-step instructions tailored specifically for your platform — all using Vidgram&apos;s free, ad-free <Link href="/tiktok-downloader">TikTok Downloader</Link>.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
          {[
            { icon: <Monitor size={24} color="var(--accent)" />, label: 'Windows PC', anchor: '#windows' },
            { icon: <Apple size={24} color="var(--accent)" />, label: 'Mac', anchor: '#mac' },
            { icon: <Smartphone size={24} color="var(--accent)" />, label: 'iPhone (iOS)', anchor: '#iphone' },
            { icon: <Tablet size={24} color="var(--accent)" />, label: 'Android', anchor: '#android' },
          ].map((d, i) => (
            <a key={i} href={d.anchor} className="card" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ marginBottom: '0.75rem' }}>{d.icon}</div>
              <strong>{d.label}</strong>
            </a>
          ))}
        </div>

        <h2 id="windows">📥 Download TikTok Videos on Windows PC</h2>
        <p>The easiest method for Windows users is via the web browser — no software installation required.</p>
        <div className="card" style={{ padding: '2rem', margin: '1.5rem 0', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--accent)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Steps for Windows (Chrome, Edge, Firefox):</h4>
          <ol style={{ margin: 0 }}>
            <li>Open TikTok in your browser at <strong>tiktok.com</strong> or use the TikTok desktop app.</li>
            <li>Navigate to the video you want to download.</li>
            <li>Click the Share button (arrow icon) and select <strong>&quot;Copy link&quot;</strong>.</li>
            <li>Open a new tab and go to <Link href="/tiktok-downloader">vidgram.web.id/tiktok-downloader</Link>.</li>
            <li>Paste the URL (Ctrl+V) into the input field and click <strong>Download</strong>.</li>
            <li>Choose your preferred quality (HD/Full HD) and click the download button.</li>
            <li>The MP4 file will save to your <strong>Downloads</strong> folder automatically.</li>
          </ol>
        </div>
        <p><strong>Pro tip:</strong> You can also right-click the TikTok video URL in your browser&apos;s address bar and select &quot;Copy&quot; directly.</p>

        <h2 id="mac">🍎 Download TikTok Videos on Mac</h2>
        <p>The process on Mac is nearly identical to Windows, using Safari, Chrome, or any browser.</p>
        <div className="card" style={{ padding: '2rem', margin: '1.5rem 0', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--accent)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Steps for macOS (Safari, Chrome):</h4>
          <ol style={{ margin: 0 }}>
            <li>Open TikTok in your browser (Safari or Chrome).</li>
            <li>Find the video and click the Share button → <strong>&quot;Copy link&quot;</strong>.</li>
            <li>Open <Link href="/tiktok-downloader">vidgram.web.id/tiktok-downloader</Link> in a new tab.</li>
            <li>Paste the URL (⌘+V) and click <strong>Download</strong>.</li>
            <li>Select quality and download. The file saves to your <strong>Downloads</strong> folder.</li>
          </ol>
        </div>
        <p><strong>Safari note:</strong> If Safari doesn&apos;t start the download automatically, try using Chrome instead. Safari sometimes blocks third-party downloads by default.</p>

        <h2 id="iphone">📱 Download TikTok Videos on iPhone (iOS)</h2>
        <p>Downloading on iPhone requires a slightly different approach due to iOS restrictions, but it&apos;s still straightforward.</p>
        <div className="card" style={{ padding: '2rem', margin: '1.5rem 0', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--accent)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Steps for iPhone (iOS 15+):</h4>
          <ol style={{ margin: 0 }}>
            <li>Open the <strong>TikTok app</strong> and find the video you want to save.</li>
            <li>Tap the <strong>Share</strong> button (arrow icon at the bottom right).</li>
            <li>Tap <strong>&quot;Copy link&quot;</strong> from the share sheet.</li>
             <li>Open <strong>Safari</strong> and navigate to <Link href="/tiktok-downloader">vidgram.web.id/tiktok-downloader</Link>.</li>
            <li>Long-press the URL field and tap <strong>&quot;Paste&quot;</strong>, then tap <strong>Download</strong>.</li>
            <li>When the download prompt appears, tap <strong>&quot;Download&quot;</strong> to confirm.</li>
            <li>Open the <strong>Files app</strong> → <strong>Downloads</strong> folder to find your video.</li>
            <li>To save to Photos: Open the video in Files, tap the Share button, and select <strong>&quot;Save Video&quot;</strong>.</li>
          </ol>
        </div>
        <p><strong>iOS tip:</strong> Starting from iOS 13+, Safari supports direct file downloads. The video will appear in your Files app under Downloads. You can then move it to your Camera Roll easily.</p>

        <h2 id="android">🤖 Download TikTok Videos on Android</h2>
        <p>Android makes downloading the easiest of all platforms thanks to its more open file system.</p>
        <div className="card" style={{ padding: '2rem', margin: '1.5rem 0', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--accent)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Steps for Android (Chrome):</h4>
          <ol style={{ margin: 0 }}>
            <li>Open the <strong>TikTok app</strong> and find the video.</li>
            <li>Tap <strong>Share</strong> → <strong>&quot;Copy link&quot;</strong>.</li>
            <li>Open <strong>Chrome</strong> and go to <Link href="/tiktok-downloader">vidgram.web.id/tiktok-downloader</Link>.</li>
            <li>Long-press the input field and tap <strong>&quot;Paste&quot;</strong>, then tap <strong>Download</strong>.</li>
            <li>Select quality and download. The file saves to your <strong>Downloads</strong> folder.</li>
            <li>The video will automatically appear in your <strong>Gallery</strong> or <strong>Google Photos</strong> app.</li>
          </ol>
        </div>
        <p><strong>Android tip:</strong> Downloaded videos appear directly in your gallery without extra steps. You can also find them in the Files app → Downloads.</p>

        <h2>Troubleshooting by Device</h2>
        <div style={{ overflowX: 'auto', margin: '2rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Issue', 'Device', 'Solution'].map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 700 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                ['Video won\'t download', 'iPhone', 'Use Safari instead of in-app browser. Check Settings → Safari → Downloads.'],
                ['Download button not working', 'All', 'Ensure the TikTok video is set to public. Private videos cannot be downloaded.'],
                ['Low quality output', 'All', 'The source video may be low quality. Try upscaling with our AI Upscaler.'],
                ['File saves as unknown format', 'Android', 'Rename the file to .mp4 extension if your browser saved it without one.'],
                ['Safari blocks download', 'Mac/iPhone', 'Go to Safari Preferences → General → File download location → set to "Downloads".'],
                ['Video has watermark', 'All', 'Ensure you\'re using the correct download button on Vidgram, not a site ad.'],
              ].map(([issue, device, solution], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{issue}</td>
                  <td style={{ padding: '0.75rem' }}>{device}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Want Audio Only? Try MP3 Download</h2>
        <p>If you only need the audio track (music, voiceover, sound effect), Vidgram can extract it as an MP3 file on any device. See our detailed guide: <Link href="/blog/tiktok-to-mp3-converter-extract-audio-free">TikTok to MP3 Converter</Link>.</p>

        <h2>Enhance Downloaded Videos with AI</h2>
         <p>Downloaded a video that looks blurry or low-resolution? Use Vidgram&apos;s <Link href="/ai-video-upscaler">AI Video Upscaler</Link> to enhance it to 2K or 4K quality — completely free and processed locally on your device. Learn more in our <Link href="/blog/free-ai-video-upscaler-enhance-to-4k-no-upload">AI Video Upscaler guide</Link>.</p>

        <h2>Frequently Asked Questions</h2>
        <h3>Do I need to install an app to download TikTok?</h3>
        <p>No. Vidgram works entirely in your web browser on all devices — PC, Mac, iPhone, and Android. No app, extension, or software installation needed.</p>
        <h3>Is the download quality the same on all devices?</h3>
        <p>Yes. Vidgram delivers the same HD quality regardless of your device. The quality depends on the original TikTok video, not your device.</p>
        <h3>Can I download TikTok videos on iPad?</h3>
        <p>Yes. Follow the same steps as iPhone. Safari on iPad works identically to Safari on iPhone for downloads.</p>
        <h3>Are downloaded videos saved without watermark?</h3>
        <p>Yes. All downloads through Vidgram are completely watermark-free in original HD quality.</p>

        <div className="card" style={{ padding: '2.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--accent)', marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Download TikTok Videos on Any Device</h3>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Works on PC, Mac, iPhone, Android, and tablets — no app needed, no watermark, completely free.</p>
          <Link href="/tiktok-downloader" className="btn-primary" style={{ display: 'inline-flex' }}>Try TikTok Downloader Now →</Link>
        </div>

        <RelatedArticles currentSlug="download-tiktok-videos-pc-mac-iphone-android" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "Article", "headline": "How to Download TikTok Videos on PC, Mac, iPhone & Android (2026 Guide)", "author": { "@type": "Organization", "name": "Vidgram Team" }, "publisher": { "@type": "Organization", "name": "Vidgram", "logo": { "@type": "ImageObject", "url": "https://vidgram.web.id/logo.png" } }, "datePublished": "2026-05-27", "dateModified": "2026-05-27", "mainEntityOfPage": "https://vidgram.web.id/blog/download-tiktok-videos-pc-mac-iphone-android" },
        { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "Do I need to install an app to download TikTok?", "acceptedAnswer": { "@type": "Answer", "text": "No. Vidgram works in your browser on all devices." } }, { "@type": "Question", "name": "Is the download quality the same on all devices?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Same HD quality regardless of device." } }, { "@type": "Question", "name": "Can I download TikTok on iPad?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, follow the same iPhone steps." } }, { "@type": "Question", "name": "Are downloads saved without watermark?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all downloads are watermark-free." } }] }
      ]) }} />
    </div>
  );
}
