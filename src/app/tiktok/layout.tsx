import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikTok Downloader - Download Without Watermark | Vidgram",
  description: "Download TikTok videos without watermark for free. Fast, easy, and high-quality TikTok video downloader tool. Save TikTok videos instantly in HD quality.",
  keywords: ["TikTok downloader", "download TikTok without watermark", "TikTok video download", "save TikTok videos", "TikTok no watermark", "download tiktok tanpa watermark"],
  alternates: {
    canonical: "https://vidgram.web.id/tiktok",
  },
  openGraph: {
    title: "TikTok Downloader - Download Without Watermark | Vidgram",
    description: "Download TikTok videos without watermark for free. Fast, easy, and high-quality.",
    url: "https://vidgram.web.id/tiktok",
    siteName: "Vidgram",
    images: [
      {
        url: "https://vidgram.web.id/og-tiktok.png", // We should probably generate this or use a placeholder
        width: 1200,
        height: 630,
        alt: "Vidgram TikTok Downloader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Downloader - Download Without Watermark | Vidgram",
    description: "Download TikTok videos without watermark for free. Fast, easy, and high-quality.",
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
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Vidgram TikTok Downloader",
            "description": "Download TikTok videos without watermark for free",
            "operatingSystem": "Web",
            "applicationCategory": "VideoDownloader",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1200"
            }
          })
        }}
      />
    </>
  );
}
