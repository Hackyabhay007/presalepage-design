// components/BuyTokenModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wallet, 
  CaretLeft, 
  CheckCircle,
  WarningCircle,
  CaretRight,
  CurrencyDollar,
  CopySimple,
  ArrowSquareOut,
  Spinner
} from '@phosphor-icons/react';
import { Icon } from '@iconify/react';

interface BuyTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Network {
  id: string;
  name: string;
  symbol: string;
  chainId: number;
  icon: string;
  explorerUrl: string;
}

interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  icon: string;
  decimals: number;
  minAmount?: number;
  maxAmount?: number;
}

// Network definitions
const networks: Network[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: 1,
    icon: 'cryptocurrency:eth',
    explorerUrl: 'https://etherscan.io'
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    chainId: 56,
    icon: 'cryptocurrency:bnb',
    explorerUrl: 'https://bscscan.com'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    chainId: 137,
    icon: 'cryptocurrency:matic',
    explorerUrl: 'https://polygonscan.com'
  }
];

// Token definitions with icons
const tokens: Record<string, Token[]> = {
  eth: [
    { 
    id: 'eth', 
    symbol: 'ETH', 
    name: 'Ethereum', 
    price: 2000, 
    icon: 'cryptocurrency:eth', 
    decimals: 18 
    },
    { 
    id: 'usdt', 
    symbol: 'USDT', 
    name: 'Tether USD', 
    price: 1, 
    icon: 'cryptocurrency:usdt', 
    decimals: 6 
    }
  ],
  bsc: [
    { 
    id: 'bnb', 
    symbol: 'BNB', 
    name: 'BNB', 
    price: 300, 
    icon: 'cryptocurrency:bnb', 
    decimals: 18 
    },
    { 
    id: 'usdt', 
    symbol: 'USDT', 
    name: 'Tether USD', 
    price: 1, 
    icon: 'cryptocurrency:usdt', 
    decimals: 6 
    }
  ],
  polygon: [
    { 
    id: 'matic', 
    symbol: 'MATIC', 
    name: 'Polygon', 
    price: 1.5, 
    icon: 'cryptocurrency:matic', 
    decimals: 18 
    },
    { 
    id: 'usdt', 
    symbol: 'USDT', 
    name: 'Tether USD', 
    price: 1, 
    icon: 'cryptocurrency:usdt', 
    decimals: 6 
    }
  ]
};
  

export function BuyTokenModal({ isOpen, onClose }: BuyTokenModalProps) {
  const [step, setStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<number | null>(null);


  const NetworkItem = ({ network }: { network: Network }) => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => handleNetworkSelect(network)}
      className="flex items-center justify-between p-4 rounded-xl 
        border border-border/50 hover:border-accent/50 
        hover:bg-accent/5 transition-all w-full group"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 relative flex items-center justify-center">
          <Icon icon={network.icon} width={40} height={40} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold group-hover:text-accent transition-colors">
            {network.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Chain ID: {network.chainId}
          </p>
        </div>
      </div>
      <CaretRight 
        className="w-5 h-5 text-muted-foreground 
          group-hover:text-accent transition-colors" 
      />
    </motion.button>
  );
  
  const TokenItem = ({ token }: { token: Token }) => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => handleTokenSelect(token)}
      className="flex items-center justify-between p-4 rounded-xl 
        border border-border/50 hover:border-accent/50 
        hover:bg-accent/5 transition-all w-full group"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 relative flex items-center justify-center">
          <Icon icon={token.icon} width={40} height={40} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold group-hover:text-accent transition-colors">
            {token.name}
          </h3>
          <p className="text-sm text-muted-foreground">{token.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold group-hover:text-accent transition-colors">
          ${token.price.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground">Current Price</p>
      </div>
    </motion.button>
  );
  // Handle network selection
  const handleNetworkSelect = async (network: Network) => {
    try {
      setError(null);
      setSelectedNetwork(network);
      // Here you could add network switching logic for web3 wallets
      setStep(2);
    } catch (err) {
      setError('Failed to switch network. Please try again.');
    }
  };
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetAndClose();
    }
  }, [isOpen]);

  // Reset all states and close modal
  const resetAndClose = () => {
    setStep(1);
    setSelectedNetwork(null);
    setSelectedToken(null);
    setAmount('');
    setIsProcessing(false);
    setError(null);
    setTransactionHash(null);
    setEstimatedGas(null);
    onClose();
  };

  // Handle back navigation
  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
      if (step === 3) {
        setSelectedToken(null);
        setAmount('');
        setEstimatedGas(null);
      }
      if (step === 2) {
        setSelectedNetwork(null);
      }
    } else {
      resetAndClose();
    }
  };


  // Handle token selection
  const handleTokenSelect = (token: Token) => {
    setError(null);
    setSelectedToken(token);
    setStep(3);
  };

  // Validate amount input
  const validateAmount = (value: string): string | null => {
    if (!value) return 'Amount is required';
    if (isNaN(Number(value))) return 'Invalid amount';
    if (Number(value) <= 0) return 'Amount must be greater than 0';
    
    if (selectedToken?.minAmount && Number(value) < selectedToken.minAmount) {
      return `Minimum amount is ${selectedToken.minAmount} ${selectedToken.symbol}`;
    }
    
    if (selectedToken?.maxAmount && Number(value) > selectedToken.maxAmount) {
      return `Maximum amount is ${selectedToken.maxAmount} ${selectedToken.symbol}`;
    }
    
    return null;
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const value = e.target.value;
    
    // Remove non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) return;
    
    // Limit decimal places based on token decimals
    if (parts[1] && selectedToken && parts[1].length > selectedToken.decimals) return;
    
    setAmount(sanitizedValue);
    
    // Estimate gas when amount changes
    if (sanitizedValue && Number(sanitizedValue) > 0) {
      estimateGas(sanitizedValue);
    }
  };

  // Estimate gas fee
  const estimateGas = async (value: string) => {
    try {
      // Here you would typically call your blockchain's estimateGas method
      // This is a mock implementation
      setEstimatedGas(2.5);
    } catch (err) {
      console.error('Failed to estimate gas:', err);
      setEstimatedGas(null);
    }
  };

  // Calculate total with fees
  const calculateTotal = (): number => {
    if (!amount || !selectedToken) return 0;
    const subtotal = Number(amount) * selectedToken.price;
    return estimatedGas ? subtotal + estimatedGas : subtotal;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle purchase
  const handlePurchase = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      // Validate amount
      const amountError = validateAmount(amount);
      if (amountError) {
        setError(amountError);
        setIsProcessing(false);
        return;
      }

      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate transaction hash
      const hash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setTransactionHash(hash);

      // Show success for 3 seconds before closing
      setTimeout(() => {
        resetAndClose();
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy transaction hash
  const copyTransactionHash = async () => {
    if (transactionHash) {
      try {
        await navigator.clipboard.writeText(transactionHash);
        // Here you could add a toast notification
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // View transaction on explorer
  const viewTransaction = () => {
    if (transactionHash && selectedNetwork) {
      window.open(`${selectedNetwork.explorerUrl}/tx/${transactionHash}`, '_blank');
    }
  };

  // Render transaction details
  const renderTransactionDetails = () => {
    if (!transactionHash) return null;

    return (
      <div className="mt-4 p-4 bg-accent/10 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="font-medium">Transaction Submitted</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="truncate flex-1 font-mono text-sm">
            {transactionHash}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyTransactionHash}
              className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
            >
              <CopySimple className="w-4 h-4" />
            </button>
            <button
              onClick={viewTransaction}
              className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
            >
              <ArrowSquareOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && resetAndClose()}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
            flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full max-w-lg rounded-2xl shadow-xl 
              border border-border/50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative border-b border-border/50 p-6">
              <h2 className="text-2xl font-bold">Buy Tokens</h2>
              <p className="text-muted-foreground mt-1">
                {step === 1 && "Select a network to continue"}
                {step === 2 && "Choose your preferred token"}
                {step === 3 && "Enter the amount to purchase"}
              </p>
              <button
                onClick={resetAndClose}
                className="absolute right-4 top-4 p-2 rounded-full 
                  hover:bg-background/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Network Selection */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {networks.map((network) => (
                    <NetworkItem key={network.id} network={network} />
                  ))}
                </motion.div>
              )}

              {/* Token Selection */}
              {step === 2 && selectedNetwork && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {tokens[selectedNetwork.id].map((token) => (
                    <TokenItem key={token.id} token={token} />
                  ))}
                </motion.div>
              )}

              {/* Amount Input */}
              {step === 3 && selectedToken && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Amount to Buy
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <CurrencyDollar 
                            weight="bold"
                            className="w-5 h-5 text-muted-foreground" 
                          />
                        </div>
                        <input
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          className="w-full pl-12 pr-20 py-3 rounded-lg bg-background 
                            border border-border/50 focus:outline-none 
                            focus:border-accent/50 transition-colors"
                          placeholder="0.00"
                          disabled={isProcessing}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 
                          text-sm text-muted-foreground">
                          {selectedToken.symbol}
                        </div>
                      </div>
                    </div>

                    <div className="bg-background/50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price per token</span>
                        <span>{formatCurrency(selectedToken.price)}</span>
                      </div>
                      {estimatedGas && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network Fee</span>
                          <span>{formatCurrency(estimatedGas)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold pt-2 
                        border-t border-border/50">
                        <span>Total</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center space-x-2 text-red-500 text-sm">
                        <WarningCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    {renderTransactionDetails()}
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing || !amount || Number(amount) <= 0}
                    className="w-full bg-accent text-white py-3 rounded-lg 
                      hover:bg-accent/90 transition-colors flex items-center 
                      justify-center space-x-2 disabled:opacity-50 
                      disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Spinner className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Confirm Purchase</span>
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 p-4">
              <button
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground 
                  transition-colors flex items-center space-x-2"
              >
                <CaretLeft className="w-4 h-4" />
                <span>{step === 1 ? 'Close' : 'Back'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
