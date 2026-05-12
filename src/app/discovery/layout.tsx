import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Amazing Videos - Vidgram Video Platform",
  description: "Discover and watch amazing videos from creators around the world. Browse trending content and find your favorite videos on Vidgram. Join the community of creators.",
  keywords: ["video discovery", "watch videos online", "trending videos", "video platform", "discover content", "browse videos", "platform video Indonesia"],
  alternates: {
    canonical: "https://vidgram.web.id/discovery",
  },
  openGraph: {
    title: "Discover Amazing Videos - Vidgram Video Platform",
    description: "Discover and watch amazing videos from creators around the world on Vidgram.",
    url: "https://vidgram.web.id/discovery",
    siteName: "Vidgram",
    images: [
      {
        url: "https://vidgram.web.id/og-discovery.png",
        width: 1200,
        height: 630,
        alt: "Vidgram Video Discovery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Amazing Videos - Vidgram Video Platform",
    description: "Discover and watch amazing videos from creators around the world on Vidgram.",
    images: ["https://vidgram.web.id/og-discovery.png"],
  },
};

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Vidgram Video Discovery",
            "description": "Discover and watch amazing videos from creators around the world",
            "publisher": {
              "@type": "Organization",
              "name": "Vidgram",
              "logo": {
                "@type": "ImageObject",
                "url": "https://vidgram.web.id/logo.png"
              }
            }
          })
        }}
      />
    </>
  );
}
