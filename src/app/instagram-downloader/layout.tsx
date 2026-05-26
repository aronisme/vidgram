import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Downloader - Download Reels, Videos & Photos | Vidgram",
  description: "Download Instagram Reels, videos, and photos in high quality for free. Simple, fast, and secure Instagram media downloader. Save IG content instantly.",
  keywords: [
    "Instagram downloader",
    "Instagram Reels downloader",
    "download Instagram videos",
    "save Instagram photos",
    "IG downloader",
    "download Reels HD",
    "download instagram story",
    "download reels instagram tanpa watermark",
    "vidgram instagram"
  ],
  alternates: {
    canonical: "https://vidgram.web.id/instagram-downloader",
  },
  openGraph: {
    title: "Instagram Downloader - Download Reels, Videos & Photos | Vidgram",
    description: "Download Instagram Reels, videos, and photos in high quality for free. Fast, easy, and secure.",
    url: "https://vidgram.web.id/instagram-downloader",
    siteName: "Vidgram",
    images: [
      {
        url: "https://vidgram.web.id/og-instagram.png",
        width: 1200,
        height: 630,
        alt: "Vidgram Instagram Downloader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Downloader - Download Reels, Videos & Photos | Vidgram",
    description: "Download Instagram Reels, videos, and photos in high quality for free. Fast, easy, and secure.",
    images: ["https://vidgram.web.id/og-instagram.png"],
  },
};

export default function InstagramLayout({
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
            "name": "Vidgram Instagram Downloader Pro",
            "description": "Download Instagram Reels, videos, and photos in high quality for free.",
            "operatingSystem": "Web",
            "applicationCategory": "MultimediaApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1540"
            }
          })
        }}
      />
    </>
  );
}
