'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Shield,
  ChevronDown, 
  ExternalLink, 
  Copy, 
  LogOut
} from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useAppKitWallet } from '@reown/appkit-wallet-button/react';
import { toast } from 'sonner'; // Add this import for notifications

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { open } = useAppKit({
    appId: process.env.NEXT_PUBLIC_APPKIT_APP_ID,
    onError: (error) => {
      console.error('AppKit Error:', error);
      toast.error('Failed to initialize AppKit');
    }
  });
  const { address, isConnected } = useAppKitAccount({
    onDisconnect: () => {
      console.log('Wallet disconnected');
      toast.info('Wallet disconnected');
    }
  });
  const { isPending } = useAppKitWallet({
    onSuccess() {
      console.log('Wallet connected successfully');
      setIsConnecting(false);
      toast.success('Wallet connected successfully');
    },
    onError(error) {
      console.error('Wallet connection error:', error);
      setIsConnecting(false);
      
      // More specific error messages
      if (error.message?.includes('provider not found')) {
        toast.error('MetaMask not detected. Please install MetaMask extension');
      } else if (error.message === 'Connection declined') {
        toast.error('Connection was declined. Please try again.');
      } else {
        toast.error(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
      }
    }
  });

  const handleConnect = async () => {
    if (isConnecting) {
      toast.error('Please wait for the previous connection request to complete');
      return;
    }
    
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed. Please install MetaMask extension first.');
      return;
    }
    
    setIsConnecting(true);
    try {
      await open({ view: 'Connect' });
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
      toast.error('Failed to initiate wallet connection');
    }
  };

  const handleDisconnect = () => {
    // Implementation will be handled by AppKit
    setIsDropdownOpen(false);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address || '');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const viewOnEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
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
                        src="https://SwingFi.org/_next/static/media/Logo.4ffd2ef6.svg" 
                        alt="SwingFi Logo"
                        width={120}  // Increased from 100
                        height={120}  // Increased from 40
                      />
                </motion.div>
              </div>
            
            </motion.div>

            {/* Wallet Section */}
            <div className="relative">
              {isConnected ? (
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
                      {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
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
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                              Connected Wallet
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
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

                          {/* Disconnect Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDisconnect}
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
                  onClick={handleConnect}
                  disabled={isPending || isConnecting}
                  className="px-4 py-2 rounded-lg flex items-center space-x-2 
                    bg-accent/10 text-accent border border-accent/20 
                    hover:bg-accent/20 transition-all disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  <Shield className="w-4 h-4" />
                  <span>
                    {isPending || isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </header>
  );
}
