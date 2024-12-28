import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navigation/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpringFi - DeFi Ecosystem",
  description:
    "SpringFi: Your Gateway to Decentralized Finance. Trade, Stake, and Earn in a Secure DeFi Ecosystem.",
  keywords:
    "SpringFi, DeFi, Cryptocurrency, Blockchain, Staking, Trading, Yield Farming",
  authors: [{ name: "SpringFi Team" }],
  openGraph: {
    title: "SpringFi - DeFi Ecosystem",
    description:
      "SpringFi: Your Gateway to Decentralized Finance. Trade, Stake, and Earn in a Secure DeFi Ecosystem.",
    url: "https://springfi.org",
    siteName: "SpringFi",
    images: [
      {
        url: "https://springfi.org/og-image.png", // Make sure to add your actual OG image path
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpringFi - DeFi Ecosystem",
    description:
      "SpringFi: Your Gateway to Decentralized Finance. Trade, Stake, and Earn in a Secure DeFi Ecosystem.",
    images: ["https://springfi.org/twitter-image.png"], // Make sure to add your actual Twitter image path
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0D0D0D] text-white`}>
        {/**  <Navbar /> */}
        <main className="min-h-screen pt-16 max-w-[1440px] mx-auto px-4 md:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
