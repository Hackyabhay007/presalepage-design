// components/PaymentSuccessModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  Wallet,
  Clock
} from 'lucide-react';

// Types
interface TransactionDetails {
  hash: string;
  network: {
    name: string;
    chainId: number;
    currency: string;
    explorer: string;
  };
  token: {
    symbol: string;
    decimals: number;
    address: string;
    icon?: string;
  };
}

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash?: string;
  tokenAmount?: number;
  tokenSymbol?: string;
  tokenPrice?: number;
  totalPaid?: number;
  networkDetails?: TransactionDetails['network'];
  autoCloseDelay?: number; // in milliseconds
}

// Default Values
const DEFAULT_NETWORK = {
  name: 'Ethereum',
  chainId: 1,
  currency: 'ETH',
  explorer: 'https://etherscan.io'
};

const DEFAULT_TOKEN = {
  symbol: 'TOKEN',
  decimals: 18,
  address: '0x...',
};

const DEFAULT_VALUES = {
  transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  tokenAmount: 0,
  tokenSymbol: DEFAULT_TOKEN.symbol,
  tokenPrice: 0,
  totalPaid: 0,
  networkDetails: DEFAULT_NETWORK,
  autoCloseDelay: 15000, // 15 seconds
};

export function PaymentSuccessModal({
  isOpen,
  onClose,
  transactionHash = DEFAULT_VALUES.transactionHash,
  tokenAmount = DEFAULT_VALUES.tokenAmount,
  tokenSymbol = DEFAULT_VALUES.tokenSymbol,
  tokenPrice = DEFAULT_VALUES.tokenPrice,
  totalPaid = DEFAULT_VALUES.totalPaid,
  networkDetails = DEFAULT_VALUES.networkDetails,
  autoCloseDelay = DEFAULT_VALUES.autoCloseDelay,
}: PaymentSuccessModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState(autoCloseDelay / 1000);
  const [isAutoClosing, setIsAutoClosing] = useState(true);

  // Auto close timer
  useEffect(() => {
    if (isOpen && isAutoClosing) {
      const timer = setInterval(() => {
        setAutoCloseTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        setAutoCloseTimer(autoCloseDelay / 1000);
      };
    }
  }, [isOpen, isAutoClosing, autoCloseDelay, onClose]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setAutoCloseTimer(autoCloseDelay / 1000);
      setIsAutoClosing(true);
    }
  }, [isOpen, autoCloseDelay]);

  // Handle copy transaction hash
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transactionHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle dashboard redirect
  const handleDashboardRedirect = () => {
    router.push('/dashboard');
    onClose();
  };

  // Handle view on explorer
  const handleExplorerRedirect = () => {
    window.open(`${networkDetails.explorer}/tx/${transactionHash}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAutoClosing(false);
              onClose();
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-background border border-border/50 
              rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Success Animation Header */}
            <div className="relative h-32 bg-gradient-to-r from-accent/20 via-accent/10 
              to-accent/20 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="relative"
              >
                <div className="absolute inset-0 animate-ping-slow">
                  <div className="w-24 h-24 rounded-full bg-green-500/20" />
                </div>
                <div className="w-24 h-24 rounded-full bg-green-500/30 
                  flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title and Description */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Payment Successful!
                </h3>
                <p className="text-muted-foreground">
                  Your purchase of {tokenAmount} {tokenSymbol} was successful on {networkDetails.name}.
                </p>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <div className="bg-accent/5 rounded-xl p-4 space-y-3">
                  {/* Amount Row */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-medium">
                      {tokenAmount} {tokenSymbol}
                    </span>
                  </div>

                  {/* Price Row */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-medium">
                      ${tokenPrice.toFixed(2)} USD
                    </span>
                  </div>

                  {/* Total Row */}
                  <div className="flex justify-between items-center pt-2 
                    border-t border-border/50">
                    <span className="text-sm text-muted-foreground">Total Paid</span>
                    <span className="font-medium">
                      ${totalPaid.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Transaction Hash Section */}
                <div className="bg-accent/5 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Transaction Hash</span>
                    <div className="flex items-center space-x-2">
                      <code className="bg-background/50 px-2 py-1 rounded-md 
                        font-mono text-xs">
                        {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                      </code>
                      <button
                        onClick={copyToClipboard}
                        className="p-1.5 hover:bg-accent/10 rounded-md 
                          transition-colors"
                        title="Copy transaction hash"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={handleExplorerRedirect}
                        className="p-1.5 hover:bg-accent/10 rounded-md 
                          transition-colors"
                        title="View on explorer"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDashboardRedirect}
                  className="w-full px-6 py-3 bg-accent text-white rounded-xl
                    flex items-center justify-center space-x-2 hover:bg-accent/90 
                    transition-colors group"
                >
                  <Wallet className="w-4 h-4" />
                  <span>View in Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 
                    transition-transform" />
                </motion.button>

                <button
                  onClick={() => {
                    setIsAutoClosing(false);
                    onClose();
                  }}
                  className="w-full px-6 py-3 border border-border/50 rounded-xl
                    text-muted-foreground hover:text-foreground hover:bg-accent/5
                    transition-colors"
                >
                  Close
                </button>

                {isAutoClosing && (
                  <div className="flex items-center justify-center gap-1 
                    text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      Closing in {autoCloseTimer} seconds...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

