import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikTok Downloader - Download Video TikTok Tanpa Watermark HD & Telegram Bot | Vidgram",
  description: "Download video TikTok tanpa watermark kualitas Full HD MP4 & Audio MP3 gratis. Cepat, aman, tanpa batas unduhan, dan tersedia juga di Telegram Bot @TiktokDownloader22bot.",
  keywords: [
    "TikTok downloader", 
    "download TikTok without watermark", 
    "download tiktok tanpa watermark", 
    "tiktok mp3 converter", 
    "save tiktok video hd", 
    "tiktok downloader telegram bot", 
    "unduh video tiktok hd",
    "snaptik",
    "ssstik",
    "vidgram tiktok"
  ],
  alternates: {
    canonical: "https://vidgram.web.id/tiktok-downloader",
  },
  openGraph: {
    title: "TikTok Downloader - Download Video TikTok Tanpa Watermark HD | Vidgram",
    description: "Download video TikTok tanpa watermark gratis kualitas Full HD & MP3. Akses via Web & Telegram Bot @TiktokDownloader22bot.",
    url: "https://vidgram.web.id/tiktok-downloader",
    siteName: "Vidgram",
    images: [
      {
        url: "https://vidgram.web.id/og-tiktok.png",
        width: 1200,
        height: 630,
        alt: "Vidgram TikTok Downloader & Telegram Bot",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Downloader Tanpa Watermark HD & Telegram Bot | Vidgram",
    description: "Download video TikTok tanpa watermark gratis kualitas Full HD & MP3. Akses via Web & Telegram Bot @TiktokDownloader22bot.",
    images: ["https://vidgram.web.id/og-tiktok.png"],
  },
};

export default function TikTokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Structured Data for SEO (SoftwareApplication + FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "Vidgram TikTok Downloader",
                "description": "Download TikTok videos without watermark for free in HD quality and extract MP3 audio",
                "operatingSystem": "Web, Android, iOS, Windows, macOS",
                "applicationCategory": "MultimediaApplication",
                "url": "https://vidgram.web.id/tiktok-downloader",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "18400"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Bagaimana cara download video TikTok tanpa watermark?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Salin tautan video TikTok dari aplikasi, tempelkan ke kolom input di Vidgram (atau kirim ke bot Telegram @TiktokDownloader22bot), lalu klik Unduh."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Apakah tersedia bot Telegram untuk download TikTok?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ya, Vidgram menyediakan bot Telegram resmi @TiktokDownloader22bot untuk download video TikTok Full HD dan MP3 secara langsung di chat Telegram."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
    </>
  );
}
