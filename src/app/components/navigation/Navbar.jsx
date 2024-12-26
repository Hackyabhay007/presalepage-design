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
  Telescope
} from 'lucide-react';

const menuItems = [
  { name: 'Buy', href: '#buy', icon: Gem },
  { name: 'Vision', href: '#vision', icon: Telescope },
  { name: 'Tokenomics', href: '#tokenomics', icon: LayersIcon },
  { name: 'Roadmap', href: '#roadmap', icon: Waypoints },
  { name: 'FAQ', href: '#faq', icon: MailQuestion },
];



export default function CyberNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          {/* Logo Section */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative w-10 h-10"
              >
                <Power 
                  className="w-8 h-8 text-accent-400 absolute 
                  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-wider text-text">
                  NEXUS
                </span>
                <span className="text-xs tracking-widest text-accent-400 uppercase">
                  Blockchain
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="group relative px-4 py-2 rounded-xl flex items-center space-x-2"
                >
                  {/* Background Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-secondary-600/20 to-accent-600/20 blur-sm"
                    initial={false}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <item.icon className="w-4 h-4 text-accent-400 group-hover:text-accent-300" />
                  <span className="relative text-sm font-medium text-text-secondary 
                    group-hover:text-text transition-colors duration-200">
                    {item.name}
                  </span>
                </Link>
              </motion.div>
            ))}

            {/* Connect Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative ml-4 px-6 py-2.5 rounded-xl overflow-hidden group"
            >
              {/* Button Glow Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-accent-600"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <motion.div
                className="absolute inset-[1px] rounded-[10px] bg-background-elevated"
                whileHover={{ opacity: 0.9 }}
              />

              <motion.div className="relative flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-medium text-text">
                  Connect Wallet
                </span>
                <ChevronRightIcon className="w-4 h-4 text-accent-400 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </motion.button>
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
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl
                      hover:bg-secondary-600/10 group"
                  >
                    <item.icon className="w-5 h-5 text-accent-400" />
                    <span className="text-text-secondary group-hover:text-text
                      transition-colors duration-200">
                      {item.name}
                    </span>
                  </Link>
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
                <span className="text-accent-400">Connect Wallet</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
