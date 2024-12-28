// components/TransactionDetailsModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Receipt,
  CreditCard,
  Wallet,
  Coins,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

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

  const statusIcon = {
    pending: <Clock className="w-5 h-5 text-yellow-500" />,
    successful: <CheckCircle className="w-5 h-5 text-green-500" />,
    failed: <AlertTriangle className="w-5 h-5 text-red-500" />
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
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${transaction.status === 'successful' 
                  ? 'bg-green-500/10' 
                  : transaction.status === 'pending'
                  ? 'bg-yellow-500/10'
                  : 'bg-red-500/10'
                }
              `}>
                {statusIcon[transaction.status]}
              </div>
              <div>
                <h2 className="text-lg font-semibold">Transaction Details</h2>
                <p className="text-sm text-muted-foreground">
                  ID: {transaction.id}
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
                  <div className="text-sm text-muted-foreground">Amount (Fiat)</div>
                  <div className="text-lg font-semibold">
                    ${transaction.fiatAmount.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg space-y-1">
                  <div className="text-sm text-muted-foreground">Amount (Crypto)</div>
                  <div className="text-lg font-semibold">
                    {transaction.cryptoAmount} {transaction.cryptoType}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Payment Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {transaction.paymentMethod === 'wert' 
                      ? <CreditCard className="w-4 h-4 text-accent" />
                      : <Wallet className="w-4 h-4 text-accent" />
                    }
                    <span>Method</span>
                  </div>
                  <span className="capitalize">{transaction.paymentMethod}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-4 h-4 text-accent" />
                    <span>Token Price</span>
                  </div>
                  <span>${transaction.tokenPrice}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-4 h-4 text-accent" />
                    <span>Network</span>
                  </div>
                  <span>{transaction.network}</span>
                </div>
              </div>
            </div>

            {/* Wallet & Security */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Wallet & Security
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-4 h-4 text-accent" />
                    <span>Buyer Wallet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{transaction.userWallet}</span>
                    <button
                      onClick={() => copyToClipboard(transaction.userWallet, 'wallet')}
                      className="p-1 hover:bg-accent/10 rounded-md transition-colors"
                    >
                      {copied === 'wallet' 
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <Copy className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                {transaction.paymentMethod === 'wert' && transaction.wertData && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-4 h-4 text-accent" />
                        <span>Wert Signature</span>
                      </div>
                      <span className={
                        transaction.wertData.signatureValid
                          ? 'text-green-500'
                          : 'text-red-500'
                      }>
                        {transaction.wertData.signatureValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Receipt className="w-4 h-4 text-accent" />
                        <span>Wert Order ID</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{transaction.wertData.orderId}</span>
                        <button
                          onClick={() => copyToClipboard(transaction.wertData.orderId, 'orderId')}
                          className="p-1 hover:bg-accent/10 rounded-md transition-colors"
                        >
                          {copied === 'orderId'
                            ? <CheckCircle className="w-4 h-4 text-green-500" />
                            : <Copy className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Token Distribution */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Token Distribution
              </h3>
              <div className="p-4 bg-accent/5 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span>Distribution Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${transaction.status === 'successful' 
                      ? 'bg-green-500/10 text-green-500' 
                      : transaction.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-red-500/10 text-red-500'
                    }`
                  }>
                    {transaction.status}
                  </span>
                </div>
                
                {transaction.status === 'successful' && (
                  <div className="flex items-center justify-between">
                    <span>Token Amount</span>
                    <span className="font-semibold">
                      {(transaction.fiatAmount / transaction.tokenPrice).toLocaleString()} Tokens
                    </span>
                  </div>
                )}

                {transaction.status === 'pending' && (
                  <div className="text-sm text-muted-foreground">
                    Tokens will be distributed after transaction confirmation
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Actions
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.open(
                    `https://${transaction.network.toLowerCase()}.etherscan.io/tx/${transaction.id}`,
                    '_blank'
                  )}
                  className="flex-1 flex items-center justify-center space-x-2 
                    px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg 
                    transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </button>

                {transaction.status === 'pending' && (
                  <button
                    onClick={() => {
                      // Handle transaction verification/update
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 
                      px-4 py-2 bg-accent text-white rounded-lg 
                      hover:bg-accent/90 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Update Status</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
