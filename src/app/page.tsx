"use client";

import HeroSection from "@/app/components/HeroSection";
import BuySection from "@/app/components/BuySection";
import VisionSection from "@/app/components/VisionSection";
import TokenomicsSection from "@/app/components/TokenomicsSection";
import RoadmapSection from "@/app/components/RoadmapSection";
import FAQSection from "@/app/components/FAQSection";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/navigation/Navbar";
import { Providers } from '@/app/providers';

//rainbowkit imports

import "@rainbow-me/rainbowkit/styles.css";

export default function Home() { 
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <HeroSection />
        <BuySection />
        <VisionSection />
        <TokenomicsSection />
        <RoadmapSection />
        <FAQSection />
        <Footer />
      </div>
    </Providers>
  );
}
