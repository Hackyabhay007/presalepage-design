import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import ContextProvider from '../context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SwingFi - DeFi Ecosystem',
  description: 'SwingFi: Your Gateway to Decentralized Finance. Trade, Stake, and Earn in a Secure DeFi Ecosystem.',
  keywords: 'SwingFi, DeFi, Cryptocurrency, Blockchain, Staking, Trading, Yield Farming',
  authors: [{ name: 'SwingFi Team' }],
  openGraph: {
    title: 'SwingFi - DeFi Ecosystem',
    description: 'SwingFi: Your Gateway to Decentralized Finance. Trade, Stake, and Earn in a Secure DeFi Ecosystem.',
    url: 'https://SwingFi.org',
    siteName: 'SwingFi',
    images: [
      {
        url: 'https://springfi.org/_next/static/media/Logo.781201c2.svg', // Make sure to add your actual OG image path
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SwingFi - DeFi Ecosystem',
    description: 'SwingFi: Your Gateway to Decentralized Finance. Trade, Stake, and Earn in a Secure DeFi Ecosystem.',
    images: ['https://SwingFi.org/twitter-image.png'], // Make sure to add your actual Twitter image path
  },
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0D0D0D] text-white`}>
        <ContextProvider cookies={cookies}>
          <main className="min-h-screen max-w-[1440px] mx-auto">
            {children}
          </main>
        </ContextProvider>
      </body>
    </html>
  )
}
