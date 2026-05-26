import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const baseUrl = 'https://vidgram.web.id';

  // Build JSON-LD BreadcrumbList schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.label,
      ...(item.href ? { "item": `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap' }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {i > 0 && <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
              {item.href && i < items.length - 1 ? (
                <Link href={item.href} style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 500 }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
