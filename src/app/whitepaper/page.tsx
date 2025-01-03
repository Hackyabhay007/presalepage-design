"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  Shield,
  Gift,
  Lock,
  Gavel,
  Users,
  Heart,
  Coins,
  Layers,
  ChevronRight,
  Wallet,
  ArrowLeft,
  Home,
  ExternalLink
} from 'lucide-react';

export default function Whitepaper() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(false);
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const keyFeatures = [
    {
      title: "Fair Access with $SWG",
      icon: Shield,
      points: [
        "Burn for Private Sales: Users can burn $SWG tokens to access exclusive private sales.",
        "Stake for Pre-Sales and Dutch Auctions: Users stake $SWG tokens to participate in pre-sales and Dutch auctions."
      ]
    },
    {
      title: "Airdrop Mechanism",
      icon: Gift,
      points: [
        "Reward early adopters and incentivize participation in the SwingFi ecosystem.",
        "Distribute tokens efficiently using advanced tools like MultiSender."
      ]
    },
    {
      title: "Private Sales",
      icon: Lock,
      points: [
        "Early-stage fundraising for strategic participants.",
        "Includes token lock-ups to stabilize prices and ensure long-term commitment."
      ]
    },
    {
      title: "Dutch Auctions",
      icon: Gavel,
      points: [
        "Dynamic price discovery model where token prices decrease over time.",
        "Encourages fair participation by allowing buyers to acquire tokens at market value."
      ]
    },
    {
      title: "FairLaunch",
      icon: Users,
      points: [
        "A truly fair and decentralized approach to token sales.",
        "Provides equal opportunities for all participants."
      ]
    },
    {
      title: "Community Incentives",
      icon: Heart,
      points: [
        "Loyalty programs to reward long-term $SWG holders.",
        "Community rewards allocated to engage and grow the ecosystem sustainably."
      ]
    }
  ];

  const tokenomics = [
    { title: "Initial Coin Offering", percentage: 40, amount: "2 Billion $SWG", color: "bg-blue-500" },
    { title: "Staking Rewards", percentage: 25, amount: "1.25 Billion $SWG", color: "bg-purple-500" },
    { title: "Liquidity", percentage: 15, amount: "750 Million $SWG", color: "bg-green-500" },
    { title: "Community Rewards", percentage: 10, amount: "500 Million $SWG", color: "bg-yellow-500" },
    { title: "Team", percentage: 10, amount: "500 Million $SWG", color: "bg-pink-500" }
  ];

  const howItWorks = [
    {
      title: "Stake or Burn $SWG",
      points: [
        "Burn $SWG for private sale participation, permanently removing tokens from circulation.",
        "Stake $SWG to participate in pre-sales and Dutch auctions, earning rewards."
      ]
    },
    {
      title: "Participate in Token Sales",
      points: [
        "Access a curated selection of Web3 startups with innovative tokenomics.",
        "Benefit from transparent, smart contract-driven processes."
      ]
    },
    {
      title: "Earn Rewards",
      points: [
        "$SWG staking rewards incentivize long-term commitment.",
        "Community rewards further enrich the participant experience."
      ]
    }
  ];

  const handleNavigation = (path: string) => {
   
      router.push(path);
    
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-purple-500 z-50"
        style={{ width: `${progress}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Floating Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 bg-gray-800/90 backdrop-blur-sm text-white p-3 
          rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200 
          group flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="opacity-0 group-hover:opacity-100 absolute left-12 
          bg-gray-800 px-2 py-1 rounded text-sm whitespace-nowrap transition-opacity">
          Go Back
        </span>
      </motion.button>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-4"
      >
        <Rocket className="w-16 h-16 text-purple-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 
          bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          SwingFi Litepaper
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Empowering Retail Investors for a Fair Web3 Future
        </p>
      </motion.header>

      <main className="container mx-auto px-4 max-w-7xl">
        {/* Introduction */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-6">Introduction</h2>
          <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
            <p className="text-gray-300 leading-relaxed">
              SwingFi is a decentralized, fair-for-all crypto launchpad designed to bridge the gap 
              between retail investors and high-potential Web3 startups. By leveraging innovative 
              staking and burning mechanisms through our native token, $SWG, SwingFi provides an 
              equitable platform where everyone has a chance to participate in token sales, fostering 
              innovation and creating opportunities for retail investors to be part of the next big 
              success stories in blockchain.
            </p>
          </div>
        </motion.section>

        {/* Key Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 
                  transition-colors cursor-pointer group"
              >
                <feature.icon className="w-8 h-8 text-purple-500 mb-4 
                  group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400">
                      <ChevronRight className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="space-y-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 
                  transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex 
                    items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <ul className="space-y-3 ml-12">
                  {step.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400">
                      <ChevronRight className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tokenomics */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10">Tokenomics</h2>
          <div className="bg-gray-800/50 rounded-xl p-6 text-center mb-8 
            hover:bg-gray-800/70 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-2">Total Supply</h3>
            <p className="text-4xl font-bold text-purple-500">5 Billion $SWG</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tokenomics.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 rounded-xl p-4 text-center hover:bg-gray-800/70 
                  transition-all duration-300"
              >
                <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-2`} />
                <p className="text-gray-400 text-sm mb-1">{item.title}</p>
                <p className="text-2xl font-bold mb-1">{item.percentage}%</p>
                <p className="text-sm text-gray-400">{item.amount}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Join Movement */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-20"
        >
          <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            SwingFi aims to redefine fairness in the Web3 space, empowering retail investors 
            to access and fuel the growth of groundbreaking blockchain projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/')}
              className="bg-purple-500 text-white px-8 py-3 rounded-xl flex items-center 
                gap-2 hover:bg-purple-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/launch')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 
                py-3 rounded-xl flex items-center gap-2 hover:from-purple-600 
                hover:to-pink-600 transition-colors"
            >
              <Wallet className="w-5 h-5" />
              Launch App
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {progress > 20 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 bg-purple-500 text-white p-3 
              rounded-full shadow-lg hover:bg-purple-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 
          rounded-full animate-spin" />
        <p className="text-purple-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
