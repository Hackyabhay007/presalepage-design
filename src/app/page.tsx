"use client";

import HeroSection from "@/app/components/HeroSection";
import BuySection from "@/app/components/BuySection";
import VisionSection from "@/app/components/VisionSection";
import TokenomicsSection from "@/app/components/TokenomicsSection";
import RoadmapSection from "@/app/components/RoadmapSection";
import FAQSection from "@/app/components/FAQSection";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/navigation/Navbar";

//rainbowkit imports

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  sepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, bsc, polygon, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function Home() {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Navbar />
            <HeroSection />
            <BuySection />
            <VisionSection />
            <TokenomicsSection />
            <RoadmapSection />
            <FAQSection />
            <Footer />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
