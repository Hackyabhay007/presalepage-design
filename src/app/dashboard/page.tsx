import type { Metadata } from 'next'
import { Header } from './components/Header';
import { TokenDashboard } from './components/TokenDashboard';
import { Providers } from '../providers';

/* export const metadata: Metadata = {
  title: 'SwingFi | Next-Generation DeFi Ecosystem',
  description: 'Experience the future of DeFi with SwingFi. Trade, stake, and earn rewards in a secure and innovative blockchain ecosystem.',
  keywords: 'SwingFi, DeFi platform, cryptocurrency trading, staking rewards, blockchain technology, crypto investment',
  openGraph: {
    title: 'SwingFi | Next-Generation DeFi Ecosystem',
    description: 'Experience the future of DeFi with SwingFi. Trade, stake, and earn rewards in a secure and innovative blockchain ecosystem.',
    type: 'website',
    url: 'https://SwingFi.org',
    images: [
      {
        url: 'https://SwingFi.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SwingFi Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwingFi',
    creator: '@SwingFi',
  },
  alternates: {
    canonical: 'https://SwingFi.org',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}; */

//rainbowkit imports

import "@rainbow-me/rainbowkit/styles.css";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Providers>
        <Header />
        <TokenDashboard /> 
      </Providers>
    </main>
  );
}
