import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TeePublic Keyword Pro - Ekstensi Chrome AI Generator Tag & SEO TeePublic POD | Vidgram',
  description: 'TeePublic Keyword Pro adalah ekstensi Chrome bertenaga AI untuk kreator Print-on-Demand (POD). Otomatiskan pengisian judul, deskripsi, main tag, dan supporting tags di TeePublic dalam 3 detik untuk melipatgandakan penjualan.',
  keywords: [
    'TeePublic Keyword Pro',
    'teepublic tag generator',
    'teepublic seo tool',
    'teepublic chrome extension',
    'print on demand keywords',
    'pod tag generator',
    'teepublic uploader tool',
    'teepublic ai keywords',
    'ekstensi teepublic',
    'cara jualan di teepublic'
  ],
  alternates: {
    canonical: 'https://www.vidgram.web.id/tools/teepublic-keyword-pro',
  },
  openGraph: {
    title: 'TeePublic Keyword Pro - Ekstensi Chrome AI Generator Tag & SEO TeePublic POD',
    description: 'Otomatiskan pengisian judul, deskripsi, main tag, dan supporting tags di TeePublic dalam 3 detik dengan AI Vision.',
    url: 'https://www.vidgram.web.id/tools/teepublic-keyword-pro',
    siteName: 'Vidgram',
    images: [
      {
        url: 'https://www.vidgram.web.id/og-teepublic.png',
        width: 1200,
        height: 630,
        alt: 'TeePublic Keyword Pro Chrome Extension',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeePublic Keyword Pro - Ekstensi Chrome AI POD',
    description: 'Otomatiskan pengisian judul, deskripsi, dan tag TeePublic dalam 3 detik dengan AI Vision.',
    images: ['https://www.vidgram.web.id/og-teepublic.png'],
  },
};

export default function TeePublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "TeePublic Keyword Pro",
                "operatingSystem": "Google Chrome, Microsoft Edge, Brave, Opera",
                "applicationCategory": "BusinessApplication",
                "url": "https://chromewebstore.google.com/detail/teepublic-keyword-pro/icgacnoaolgljkidedpcganocmmpinnd",
                "softwareVersion": "1.2.1",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "5.0",
                  "reviewCount": "142"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Apa itu TeePublic Keyword Pro?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "TeePublic Keyword Pro adalah ekstensi browser Google Chrome yang dirancang khusus untuk mempermudah kreator Print-on-Demand (POD) mengisi judul, deskripsi, dan tag SEO di TeePublic secara otomatis menggunakan AI."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Bagaimana cara kerja AI di ekstensi ini?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ekstensi membaca file desain yang Anda unggah ke halaman uploader TeePublic, menganalisis objek, gaya visual, dan konsepnya, lalu secara otomatis menghasilkan tag niche dan deskripsi yang dicari oleh pembeli organik."
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
