"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDarkAiPage = pathname === "/dark-ai";

    return (
        <>
            <Navbar />
            <main 
                className={isDarkAiPage ? "" : "container"} 
                style={{ minHeight: isDarkAiPage ? 'calc(100vh - var(--navbar-height))' : 'calc(100vh - 400px)' }}
            >
                {children}
            </main>

            {!isDarkAiPage && (
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
            )}
        </>
    );
}
