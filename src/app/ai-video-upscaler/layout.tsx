import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Upscaler Gratis Tanpa Upload - Perjelas Video Buram | Vidgram",
  description: "Tingkatkan kualitas dan perjelas video buram (upscale ke 2K/4K) secara gratis tanpa upload. Proses lokal di browser dengan WebGPU, hemat kuota, dan ringan untuk PC/Laptop spek pas-pasan. Sangat optimal untuk klip durasi pendek.",
  keywords: ["AI video upscaler gratis", "perjelas video buram", "upscale video tanpa aplikasi", "cara hd kan video", "upscale video webgpu lokal", "tingkatkan kualitas video", "video enhancer gratis", "upscale klip pendek", "video resolusi 4k"],
  alternates: {
    canonical: "https://vidgram.web.id/ai-video-upscaler",
  },
  openGraph: {
    title: "AI Video Upscaler Gratis Tanpa Upload - Perjelas Video | Vidgram",
    description: "Perjelas video buram (upscale 2K/4K) gratis tanpa upload. Proses 100% lokal di browser dengan WebGPU, ringan & hemat kuota.",
    url: "https://vidgram.web.id/ai-video-upscaler",
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
          __html: JSON.stringify([
            {
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
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Apakah data video saya aman?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sangat aman. Proses AI upscaling berjalan 100% lokal di browser Anda menggunakan WebGPU. File video Anda tidak pernah dikirim atau di-upload ke server luar."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Apakah butuh PC atau laptop spek tinggi?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tidak harus spesifikasi rata kanan. Anda bisa memproses video dengan laptop spek pas-pasan, namun disarankan untuk hanya melakukan upscale pada klip durasi pendek (contoh: di bawah 15 detik) untuk menghindari memori penuh."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Berapa batas ukuran dan durasi videonya?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Karena pemrosesan terjadi di perangkat lokal (Local AI), tidak ada batasan ukuran kuota upload internet. Batasan satu-satunya adalah kapasitas RAM dan VRAM pada GPU perangkat komputer Anda."
                  }
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "Cara Memperjelas Video Buram Tanpa Aplikasi",
              "description": "Langkah-langkah meningkatkan kualitas resolusi video (upscale) langsung di web browser menggunakan AI.",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Pilih Klip Video",
                  "text": "Klik area upload dan pilih file MP4 durasi pendek dari galeri atau folder Anda."
                },
                {
                  "@type": "HowToStep",
                  "name": "Atur Kualitas",
                  "text": "Pilih pengaturan kualitas jaringan, gaya visual (anime/real-life), dan target resolusi (2K/4K)."
                },
                {
                  "@type": "HowToStep",
                  "name": "Mulai Proses Upscale",
                  "text": "Klik tombol 'Mulai Upscale'. AI akan merender frame-demi-frame memanfaatkan WebGPU secara langsung."
                },
                {
                  "@type": "HowToStep",
                  "name": "Simpan Hasil",
                  "text": "Setelah proses AI selesai 100%, klik tombol 'Simpan Video' untuk mendownload hasilnya."
                }
              ]
            }
          ])
        }}
      />
    </>
  );
}
