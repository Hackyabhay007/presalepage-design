// components/layout/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Wallet, 
  ChevronDown, 
  ExternalLink, 
  Copy, 
  LogOut,
  Shield
} from 'lucide-react';

// Rainbow components imports
import { ConnectButton } from '@rainbow-me/rainbowkit';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

export function Header() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Handle account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsWalletConnected(false);
          setWalletAddress('');
        } else {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

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

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    setIsDropdownOpen(false);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const viewOnEtherscan = () => {
    window.open(`https://etherscan.io/address/${walletAddress}`, '_blank');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient Border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      {/* Header Content */}
      <div className="bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <motion.div
              
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className=" flex items-center justify-center"
                >
                     <Image 
                        src="https://springfi.org/_next/static/media/Logo.4ffd2ef6.svg" 
                        alt="SpringFi Logo"
                        width={120}  // Increased from 100
                        height={120}  // Increased from 40
                      />
                </motion.div>
              </div>
            
            </motion.div>

            {/* Wallet Section */}
       
            <ConnectButton/>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </header>
  );
}


//wallet 
 /*<div className="relative">
{isWalletConnected ? (
  <>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="px-4 py-2 rounded-lg flex items-center space-x-2 
        bg-accent/10 text-accent border border-accent/20 
        hover:bg-accent/20 transition-all"
    >
      <Shield className="w-4 h-4" />
      <span>
        {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
      </span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 
        ${isDropdownOpen ? 'rotate-180' : ''}`} />
    </motion.button>

    <AnimatePresence>
      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-72 rounded-xl bg-card 
            border border-border/50 shadow-lg overflow-hidden"
        >
          <div className="p-4 space-y-4">
            {/* Wallet Info */}
         /*   <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
               {/** Connected Wallets */} /*
              < ConnectButton/>

              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </span>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyAddress}
                    className="p-2 rounded-lg hover:bg-accent/10 
                      text-accent transition-colors"
                  >
                    {copySuccess ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-500"
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={viewOnEtherscan}
                    className="p-2 rounded-lg hover:bg-accent/10 
                      text-accent transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-border/50" />

            {/* Disconnect Button */} /*
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={disconnectWallet}
              className="w-full px-4 py-2 rounded-lg flex items-center 
                justify-center space-x-2 bg-red-500/10 text-red-500 
                hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
) : (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={connectWallet}
    className="px-6 py-2 rounded-lg flex items-center space-x-2 
      bg-accent text-white hover:bg-accent/90 transition-colors"
  >
    <Wallet className="w-4 h-4" />
    <span>{/*Connect Wallet*/} /*
    < ConnectButton/>
    </span>
  </motion.button>
)}
</div>  */