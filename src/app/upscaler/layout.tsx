import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Upscaler Gratis Tanpa Upload - Perjelas Video Buram | Vidgram",
  description: "Tingkatkan kualitas dan perjelas video buram (upscale ke 2K/4K) secara gratis tanpa upload. Proses lokal di browser dengan WebGPU, hemat kuota, dan ringan untuk PC/Laptop spek pas-pasan. Sangat optimal untuk klip durasi pendek.",
  keywords: ["AI video upscaler gratis", "perjelas video buram", "upscale video tanpa aplikasi", "cara hd kan video", "upscale video webgpu lokal", "tingkatkan kualitas video", "video enhancer gratis", "upscale klip pendek", "video resolusi 4k"],
  alternates: {
    canonical: "https://vidgram.web.id/upscaler",
  },
  openGraph: {
    title: "AI Video Upscaler Gratis Tanpa Upload - Perjelas Video | Vidgram",
    description: "Perjelas video buram (upscale 2K/4K) gratis tanpa upload. Proses 100% lokal di browser dengan WebGPU, ringan & hemat kuota.",
    url: "https://vidgram.web.id/upscaler",
    siteName: "Vidgram",
    images: [
      {
        url: "https://vidgram.web.id/og-upscaler.png",
        width: 1200,
        height: 630,
        alt: "Vidgram AI Video Upscaler Gratis",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Upscaler Gratis - Perjelas Video Buram | Vidgram",
    description: "Perjelas video buram gratis tanpa upload. Proses 100% lokal di browser dengan WebGPU, ringan & hemat kuota.",
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
            "description": "Perjelas video buram dan tingkatkan resolusi hingga 4K menggunakan AI secara lokal tanpa upload.",
            "operatingSystem": "Web",
            "applicationCategory": "VideoEditor",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "IDR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1250"
            }
          })
        }}
      />
    </>
  );
}
