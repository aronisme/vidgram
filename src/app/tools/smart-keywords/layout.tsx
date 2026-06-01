import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Keyword for Adobe Stock Contributor | AI Keyword Generator',
  description: 'Boost your sales with our AI-powered Adobe Stock keyword generator. Automate your uploads, prevent duplicate files, and generate buyer-intent SEO keywords instantly.',
  keywords: [
    'Adobe stock keyword generator', 'Smart Keyword for Adobe Stock Contributor',
    'AI Keywording Tools', 'Adobe Stock Contributor tools', 'Sell photos on Adobe Stock',
    'Adobe Stock SEO', 'Easy Keywords for Adobe Stock', 'PhotoTag.ai alternative',
    'Xpiks alternative', 'Microstock keyword tool', 'Auto fill Adobe Stock',
    'Adobe stock keyword generator free', 'best microstock keyword tool', 'automated keywording for stock photos'
  ],
  openGraph: {
    title: 'Smart Keyword for Adobe Stock Contributor',
    description: 'The ultimate Adobe Stock keyword generator extension. 1-click auto-fill, anti-duplicate sync, and SEO-optimized keywords.',
    url: 'https://vidgram.app/tools/smart-keywords',
    siteName: 'Vidgram Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adobe Stock AI Keyword Generator',
    description: 'Automate your Adobe Stock uploads with Smart Keywords. Prevent duplicates and generate SEO keywords instantly.',
  },
  alternates: {
    canonical: 'https://vidgram.app/tools/smart-keywords',
  },
};

export default function SmartKeywordsLayout({ children }: { children: React.ReactNode }) {
  // Add Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Smart Keyword for Adobe Stock Contributor',
        operatingSystem: 'Windows, macOS, Chrome OS',
        applicationCategory: 'BrowserExtension',
        browserRequirements: 'Requires Google Chrome or Microsoft Edge',
        offers: {
          '@type': 'Offer',
          price: '10000',
          priceCurrency: 'IDR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceType: 'https://schema.org/Subscription',
            billingIncrement: 'P1M'
          }
        },
        description: 'AI-powered Adobe Stock keyword generator extension that automates metadata filling and prevents duplicate uploads.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the best Adobe Stock keyword generator?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Smart Keywords for Adobe Stock Contributor is one of the best AI keywording tools. It auto-generates SEO-optimized titles and keywords directly inside the Adobe Stock contributor portal.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does it support bulk auto-fill?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, the extension features a 1-click Auto Generate & Submit button that processes all your pending uploads sequentially without manual intervention.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the anti-duplicate system work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The cloud-sync feature remembers every file you have successfully uploaded. If you accidentally re-upload the same file, the system will flag it to prevent duplicate rejections.',
            },
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to use Smart Keywords on Adobe Stock',
        step: [
          {
            '@type': 'HowToStep',
            text: 'Install the extension from the Chrome Web Store or Edge Add-ons.',
          },
          {
            '@type': 'HowToStep',
            text: 'Login to your Adobe Stock Contributor portal and navigate to the Uploaded Files section.',
          },
          {
            '@type': 'HowToStep',
            text: 'Click the "Auto Generate" button injected by the extension to start AI keywording.',
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
            name: 'Smart Keywords',
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
