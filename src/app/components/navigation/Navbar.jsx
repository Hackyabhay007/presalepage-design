'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RocketIcon, 
  LayersIcon, 
  CpuIcon, 
  NetworkIcon, // Changed from Blockchain
  PowerIcon, 
  MenuIcon, 
  XIcon, 
  ChevronRightIcon,
  WalletIcon,
  Power,
  Wallet,
  Menu,
  Gem,
  MailQuestion,
  Waypoints,
  Telescope,
  X,
  FileText, // Add this import for whitepaper icon
} from 'lucide-react';

import Image from 'next/image'

const menuItems = [
  { name: 'Buy', href: '#buy', icon: Gem },
  { name: 'Vision', href: '#vision', icon: Telescope },
  { name: 'Tokenomics', href: '#tokenomics', icon: LayersIcon },
  { name: 'Roadmap', href: '#roadmap', icon: Waypoints },
  { name: 'FAQ', href: '#faq', icon: MailQuestion },
  { 
    name: 'Litepaper', 
    href: '/whitepaper', // Update this with your actual whitepaper URL
    icon: FileText,
    isExternal: true 
  },
];

export default function CyberNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const handleMenuClick = (e, item) => {
    if (item.isExternal) {
      // For external links like whitepaper, let the default behavior happen
      return;
    }
    e.preventDefault();
    const element = document.querySelector(item.href);
    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: offsetTop - 80, // Adjust for navbar height
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        fixed top-0 w-full z-50 
        ${scrolled 
          ? 'bg-background-elevated/80 backdrop-blur-2xl border-b border-accent-500/10' 
          : 'bg-transparent'
        }
      `}
    >
      {/* Cyber Line Decoration */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
         
                <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
                >
                  <Link href="/" className="flex items-center space-x-3">
                    <motion.div
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="relative" // Increased from w-10 h-10
                    >
                      <Image 
                      src="https://springfi.org/_next/static/media/Logo.4ffd2ef6.svg" 
                      alt="SpringFi Logo"
                      width={120}  // Increased from 100
                      height={90}  // Increased from 40
                      />
                    </motion.div>
                  
                  </Link>
                </motion.div>

                {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleMenuClick(e, item)}
                target={item.isExternal ? "_blank" : "_self"}
                rel={item.isExternal ? "noopener noreferrer" : ""}
                className="text-gray-300 hover:text-accent-400 px-3 py-2 text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            ))}
            <button
              onClick={connectWallet}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span>{isWalletConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative p-2 rounded-xl hover:bg-secondary-600/10"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <X className="w-6 h-6 text-accent-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Menu className="w-6 h-6 text-accent-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-elevated/95 backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleMenuClick(e, item)}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel={item.isExternal ? "noopener noreferrer" : ""}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl
                      hover:bg-secondary-600/10 group"
                  >
                    <item.icon className="w-5 h-5 text-accent-400" />
                    <span className="text-text-secondary group-hover:text-text
                      transition-colors duration-200">
                      {item.name}
                    </span>
                  </a>
                </motion.div>
              ))}
              
              <motion.button
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full px-4 py-3 mt-4 rounded-xl
                  bg-gradient-to-r from-secondary-600/20 to-accent-600/20
                  hover:from-secondary-600/30 hover:to-accent-600/30
                  border border-accent-400/20 flex items-center justify-center space-x-2"
              >
                <Wallet className="w-4 h-4 text-accent-400" />
                <span className="text-accent-400">{isWalletConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
