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
import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useAppKitWallet } from '@reown/appkit-wallet-button/react';

const menuItems = [
  { name: 'Buy', href: '#buy', icon: Gem },
  { name: 'Vision', href: '#vision', icon: Telescope },
  { name: 'Tokenomics', href: '#tokenomics', icon: LayersIcon },
  { name: 'Roadmap', href: '#roadmap', icon: Waypoints },
  { name: 'FAQ', href: '#faqss', icon: MailQuestion },
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
  
  // Replace wallet state with AppKit hooks
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { isPending, connect } = useAppKitWallet({
    onSuccess() {
      console.log('Wallet connected successfully');
    },
    onError(error) {
      console.error('Wallet connection error:', error);
    }
  });

  // Helper function to format address
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Handle wallet connection
  const handleConnect = async () => {
    if (isConnected) {
      open({ view: 'Account' });
    } else {
      open({ view: 'Connect' });
    }
  };

  const handleMenuClick = (e, item) => {
    if (item.isExternal) {
      return;
    }
    e.preventDefault();
    
    // Close mobile menu first
    setIsOpen(false);
    
    // Add slight delay to allow menu close animation to complete
    setTimeout(() => {
      const element = document.querySelector(item.href);
      if (element) {
        const offsetTop = element.offsetTop;
        const navHeight = 80; // Height of the navbar
        
        window.scrollTo({
          top: offsetTop - navHeight,
          behavior: 'smooth'
        });
      }
    }, 300); // 300ms delay to match menu close animation
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update the wallet button JSX in both desktop and mobile views
  const WalletButton = () => (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="flex items-center space-x-2 px-4 py-2 rounded-xl
        bg-gradient-to-r from-secondary-600/20 to-accent-600/20
        hover:from-secondary-600/30 hover:to-accent-600/30
        border border-accent-400/20"
    >
      <Wallet className="w-4 h-4 text-accent-400" />
      <span className="text-accent-400">
        {isPending ? 'Connecting...' : 
         isConnected ? formatAddress(address) : 'Connect Wallet'}
      </span>
    </button>
  );

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
                      src="https://springfi.org/_next/static/media/Logo.781201c2.svg" 
                      alt="SwingFi Logo"
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
            <WalletButton />
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
                    onClick={(e) => {
                      handleMenuClick(e, item);
                      setIsOpen(false); // Close mobile menu after clicking
                    }}
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
              
              <WalletButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
