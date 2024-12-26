import HeroSection from '@/app/components/HeroSection'
import BuySection from '@/app/components/BuySection'
import VisionSection from '@/app/components/VisionSection'
import TokenomicsSection from '@/app/components/TokenomicsSection'
import RoadmapSection from '@/app/components/RoadmapSection'
import FAQSection from '@/app/components/FAQSection'
import Footer from '@/app/components/Footer'

export default function Home() {
  return (
    <>
      <HeroSection />
      <BuySection />
      <VisionSection/>
      <TokenomicsSection/>
      <RoadmapSection/>
      <FAQSection/>
      <Footer/>
    </>
  )
}
