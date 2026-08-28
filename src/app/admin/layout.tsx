import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Control Center & Global Analytics | Vidgram',
  description: 'Private Admin Dashboard for Vidgram platform monitoring and management.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '1rem', paddingBottom: '5rem' }}>
      {children}
    </div>
  );
}
