import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Link from "next/link";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Vidgram",
    default: "Unleash Your Creativity with Vidgram",
  },
  description: "The lightning-fast, beautiful video platform engineered for maximum discoverability and seamless streaming. Share, discover, and enjoy amazing videos.",
  keywords: ["video sharing", "watch videos", "upload videos", "vidgram", "creators", "video platform", "streaming"],
  authors: [{ name: "Vidgram" }],
  creator: "Vidgram",
  publisher: "Vidgram",
  metadataBase: new URL('https://vidgram.web.id'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE_PLACEHOLDER" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID_PLACEHOLDER"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID_PLACEHOLDER');
          `
        }} />

        {/* Microsoft Clarity */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "CLARITY_PROJECT_ID_PLACEHOLDER");
          `
        }} />
      </head>
      <body className={outfit.className}>
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            <main className="container" style={{ minHeight: 'calc(100vh - 400px)' }}>
              {children}
            </main>
            <footer className="site-footer">
              <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                  {/* Brand Column */}
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Vidgram</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      Premium video tools for creators. Fast, free, and optimized for HD quality.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <a href="https://facebook.com/vidgram" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
                      <a href="https://twitter.com/vidgram" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a>
                      <a href="https://instagram.com/vidgram" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
                    </div>
                  </div>

                  {/* Tools Column */}
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Tools</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li><Link href="/tiktok" className="footer-link">TikTok Downloader Pro</Link></li>
                      <li><Link href="/upscaler" className="footer-link">AI Video Upscaler</Link></li>
                      <li><Link href="/discovery" className="footer-link">Video Discovery</Link></li>
                    </ul>
                  </div>

                  {/* Company Column */}
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Company</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li><Link href="/about" className="footer-link">About Us</Link></li>
                      <li><Link href="/blog" className="footer-link">Blog & Guides</Link></li>
                      <li><Link href="/help" className="footer-link">Help Center</Link></li>
                      <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                    </ul>
                  </div>

                  {/* Legal Column */}
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                      <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
                      <li><Link href="/cookies" className="footer-link">Cookie Policy</Link></li>
                    </ul>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                    © {new Date().getFullYear()} Vidgram. All rights reserved.
                  </p>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Developed in Indonesia for Global Creators.</span>
                  </div>
                </div>
              </div>

              {/* Global Organization Structured Data */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Vidgram",
                    "url": "https://vidgram.web.id",
                    "logo": "https://vidgram.web.id/logo.png",
                    "description": "Premium video tools and platform for creators.",
                    "sameAs": [
                      "https://facebook.com/vidgram",
                      "https://twitter.com/vidgram",
                      "https://instagram.com/vidgram"
                    ]
                  })
                }}
              />
            </footer>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
