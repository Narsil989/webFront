import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('home.title'),
  description: t('home.subtitle'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body className="bg-gray-50 min-h-screen">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
