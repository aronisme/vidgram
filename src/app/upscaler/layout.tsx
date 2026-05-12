import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Upscaler - Free 4K Enhancement | Vidgram",
  description: "Enhance video resolution to 4K using AI-powered upscaling. Free online video upscaler with WebGPU acceleration for fast, high-quality results. No software installation required.",
  keywords: ["AI video upscaler", "4K video enhancer", "free video upscaling", "WebGPU video upscaler", "enhance video quality", "video resolution increase", "upscale video to 4K free"],
  alternates: {
    canonical: "https://vidgram.web.id/upscaler",
  },
  openGraph: {
    title: "AI Video Upscaler - Free 4K Enhancement | Vidgram",
    description: "Enhance video resolution to 4K using AI-powered upscaling. Free online and fast.",
    url: "https://vidgram.web.id/upscaler",
    siteName: "Vidgram",
    images: [
      {
        url: "https://vidgram.web.id/og-upscaler.png",
        width: 1200,
        height: 630,
        alt: "Vidgram AI Video Upscaler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Upscaler - Free 4K Enhancement | Vidgram",
    description: "Enhance video resolution to 4K using AI-powered upscaling. Free online and fast.",
    images: ["https://vidgram.web.id/og-upscaler.png"],
  },
};

export default function UpscalerLayout({
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
            "name": "Vidgram AI Video Upscaler",
            "description": "Enhance video resolution to 4K using AI-powered upscaling",
            "operatingSystem": "Web",
            "applicationCategory": "VideoEditor",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "850"
            }
          })
        }}
      />
    </>
  );
}
