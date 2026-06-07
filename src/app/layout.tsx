import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import Link from "next/link";
import LayoutContent from "@/components/LayoutContent";

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
        <meta name="google-site-verification" content="CVocrLirD4GCYFssJ_6As5G54ScSL5oB_bC2nMM419s" />

        {/* Bing Webmaster Tools Verification */}
        <meta name="msvalidate.01" content="AEE6BD53D9CCFD7C8FEF7BD599155EF6" />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G6CDR4KMKE"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G6CDR4KMKE');
          `
        }} />

        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4495395893631932" crossOrigin="anonymous"></script>

        {/* Microsoft Clarity - Uncomment and replace ID when ready
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "CLARITY_PROJECT_ID_PLACEHOLDER");
          `
        }} />
        */}
      </head>
      <body className={outfit.className}>
        <ToastProvider>
          <AuthProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
