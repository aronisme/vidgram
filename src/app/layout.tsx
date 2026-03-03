import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
    description: "The fastest way to share and discovery amazing videos.",
    url: "https://vidgram.vercel.app",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="container min-h-screen">
              {children}
            </main>
            <footer className="container py-8 text-center text-sm text-[var(--text-secondary)]">
              <p>© {new Date().getFullYear()} Vidgram. Built for speed and SEO.</p>
            </footer>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
