import type { Metadata } from 'next';
import ClientProviders from './ClientProviders';

export const dynamic = 'force-dynamic';
import ErrorBoundary from '../components/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rendezvous Social Club',
  description: 'Rendezvous Social Club',
  manifest: '/manifest.json',
  themeColor: '#556B2F',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rendezvous',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/appicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/appicon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/appicon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/appicon.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/appicon.png" />
        <link rel="apple-touch-icon" href="/appicon.png" />
      </head>
      <body>
        <ErrorBoundary>
          <ClientProviders>{children}</ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
