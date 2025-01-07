'use client';
import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useAppKitWallet } from '@reown/appkit-wallet-button/react';

export default function ConnectButton({ className = '' }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { isPending, connect } = useAppKitWallet({
    onSuccess() {
      console.log('Wallet connected successfully');
      setIsDropdownOpen(false);
    },
    onError(error) {
      console.error('Wallet connection error:', error);
    }
  });

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    if (isConnected) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      open({ view: 'Connect' });
    }
  };

  const handleDisconnect = () => {
    // Implement disconnect logic here
    setIsDropdownOpen(false);
  };

  const handleViewAccount = () => {
    open({ view: 'Account' });
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleConnect}
        disabled={isPending}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl
          bg-gradient-to-r from-secondary-600/20 to-accent-600/20
          hover:from-secondary-600/30 hover:to-accent-600/30
          border border-accent-400/20 ${className}`}
      >
        <Wallet className="w-4 h-4 text-accent-400" />
        <span className="text-accent-400">
          {isPending ? 'Connecting...' : 
           isConnected ? formatAddress(address) : 'Connect Wallet'}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 rounded-xl bg-background-elevated border border-accent-500/10 shadow-lg overflow-hidden"
          >
            <div className="py-1">
              <button
                onClick={handleViewAccount}
                className="w-full px-4 py-2 text-sm text-text-secondary hover:bg-accent-400/10 flex items-center space-x-2"
              >
                <span>View Account</span>
              </button>
              <button
                onClick={() => open({ view: 'Networks' })}
                className="w-full px-4 py-2 text-sm text-text-secondary hover:bg-accent-400/10 flex items-center space-x-2"
              >
                <span>Switch Network</span>
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 flex items-center space-x-2"
              >
                <span>Disconnect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
