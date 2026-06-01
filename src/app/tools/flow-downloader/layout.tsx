import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google Flow Downloader - Bulk Export Images & Videos (Chrome/Edge)',
  description: 'Download Google Flow videos and bulk download Google Flow images automatically. The best Flow Auto Downloader extension to save AI-generated videos from Google Flow.',
  keywords: [
    'Google Flow downloader', 'Download Google Flow videos', 'Google Flow video downloader',
    'Bulk download Google Flow images', 'Google Flow AI media export', 
    'Save AI-generated videos from Google Flow', 'Flow Mass Downloader extension', 
    'bulk downloader for Google Flow', 'offline Google Flow project',
    'best Google Flow downloader', 'auto download flow labs', 'flow auto scroll downloader'
  ],
  openGraph: {
    title: 'Google Flow Downloader - Bulk Export Images & Videos',
    description: 'Bulk download Google Flow images and videos with this powerful Chrome and Edge extension. Auto-scroll, smart duplicates skip, and 4K resolution options.',
    url: 'https://vidgram.app/tools/flow-downloader',
    siteName: 'Vidgram Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google Flow Downloader - Bulk Export Assets',
    description: 'Download Google Flow videos and bulk download Google Flow images automatically with our powerful browser extension.',
  },
  alternates: {
    canonical: 'https://vidgram.app/tools/flow-downloader',
  },
};

export default function FlowDownloaderLayout({ children }: { children: React.ReactNode }) {
  // Add Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Flow Mass Downloader',
        operatingSystem: 'Windows, macOS, Chrome OS',
        applicationCategory: 'BrowserExtension',
        browserRequirements: 'Requires Google Chrome or Microsoft Edge',
        offers: {
          '@type': 'Offer',
          price: '50000',
          priceCurrency: 'IDR',
        },
        description: 'A powerful browser extension to bulk download images and videos from Google Labs Flow automatically.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I bulk download images from Google Flow?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Using our Flow Downloader extension, simply go to your Google Flow project, select the desired resolution (1K, 2K, 4K), and click "Start Mass Download". The extension will automatically scroll and save all images.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I download videos from Google Flow?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, the Flow Mass Downloader can export AI-generated videos from Google Flow in multiple qualities including 1080p, 4K, and GIF format.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is it safe to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolutely. The extension runs entirely in your local browser and interacts only with the Google Flow DOM. We do not collect your personal data or login credentials.',
            },
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to install Flow Downloader Extension',
        step: [
          {
            '@type': 'HowToStep',
            text: 'Extract the downloaded ZIP file.',
          },
          {
            '@type': 'HowToStep',
            text: 'Open chrome://extensions/ or edge://extensions/ in your browser.',
          },
          {
            '@type': 'HowToStep',
            text: 'Enable "Developer mode".',
          },
          {
            '@type': 'HowToStep',
            text: 'Click "Load unpacked" and select the extracted folder containing manifest.json.',
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://vidgram.web.id',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: 'https://vidgram.web.id/tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Flow Downloader',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
