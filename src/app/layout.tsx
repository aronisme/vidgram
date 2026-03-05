import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Vidgram",
    default: "Vidgram | The Modern Video Platform",
  },
  description: "Share, discover, and enjoy amazing videos with the world on Vidgram. Fast, secure, and built for creators.",
  keywords: ["video sharing", "watch videos", "upload videos", "vidgram", "creators"],
  authors: [{ name: "Vidgram Inc." }],
  creator: "Vidgram",
  publisher: "Vidgram",
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
  openGraph: {
    title: "Vidgram | The Modern Video Platform",
    description: "The fastest way to share and discover amazing videos.",
    url: "https://vidgram.web.id",
    siteName: "Vidgram",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidgram | The Modern Video Platform",
    description: "Share, discover, and enjoy amazing videos with the world on Vidgram.",
    creator: "@vidgram",
  },
  appleWebApp: {
    title: "Vidgram",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="container" style={{ minHeight: 'calc(100vh - var(--navbar-height) - 120px)', paddingTop: '1rem' }}>
              {children}
            </main>
            <footer className="site-footer">
              <div className="container">
                <p style={{ fontWeight: 500 }}>© {new Date().getFullYear()} Vidgram. Crafted for creators.</p>
              </div>
            </footer>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
