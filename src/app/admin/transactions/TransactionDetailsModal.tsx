'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  X, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  Clock,
  Receipt,
  Wallet,
  Coins,
} from 'lucide-react';

interface Transaction {
  id: number;
  address: string;
  transaction_hash: string;
  chain_name: string;
  event_name: string;
  payment_type: 'native' | 'usdt';
  deposit_amount: string;
  token_amount: string;
  block_number: number;
  block_timestamp: Date;
  created_at: Date;
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailsModal({ 
  transaction, 
  onClose 
}: TransactionDetailsModalProps) {
  const [copied, setCopied] = useState('');

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!transaction) return null;

  const getExplorerUrl = (chainName: string, hash: string) => {
    const explorers: { [key: string]: string } = {
      'ethereum': 'https://etherscan.io',
      'bsc': 'https://bscscan.com',
      'polygon': 'https://polygonscan.com'
    };
    
    const baseUrl = explorers[chainName.toLowerCase()];
    if (!baseUrl) return '#';
    return `${baseUrl}/tx/${hash}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
          flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-background border border-border/50 rounded-xl 
            shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10">
                <Receipt className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Transaction Details</h2>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(transaction.block_timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Transaction Overview */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/5 rounded-lg space-y-1">
                  <div className="text-sm text-muted-foreground">Deposit Amount</div>
                  <div className="text-lg font-semibold">
                    {parseFloat(transaction.deposit_amount).toFixed(6)} {transaction.payment_type.toUpperCase()}
                  </div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg space-y-1">
                  <div className="text-sm text-muted-foreground">Token Amount</div>
                  <div className="text-lg font-semibold">
                    {parseFloat(transaction.token_amount).toFixed(2)} SWG
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Transaction Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-4 h-4 text-accent" />
                    <span>Payment Type</span>
                  </div>
                  <span className="capitalize">{transaction.payment_type}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-4 h-4 text-accent" />
                    <span>Network</span>
                  </div>
                  <span className="capitalize">{transaction.chain_name}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>Block Number</span>
                  </div>
                  <span>{transaction.block_number}</span>
                </div>
              </div>
            </div>

            {/* Wallet & Transaction Hash */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Wallet & Transaction Hash
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-4 h-4 text-accent" />
                    <span>Wallet Address</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm truncate max-w-[200px]">
                      {transaction.address}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transaction.address, 'address')}
                      className="p-1 hover:bg-accent/10 rounded-md transition-colors"
                    >
                      {copied === 'address' 
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <Copy className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-4 h-4 text-accent" />
                    <span>Transaction Hash</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm truncate max-w-[200px]">
                      {transaction.transaction_hash}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transaction.transaction_hash, 'hash')}
                      className="p-1 hover:bg-accent/10 rounded-md transition-colors"
                    >
                      {copied === 'hash'
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <Copy className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Actions
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const url = getExplorerUrl(transaction.chain_name, transaction.transaction_hash);
                    if (url !== '#') {
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 
                    px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg 
                    transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
