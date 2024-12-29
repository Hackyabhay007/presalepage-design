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
import { parseEther, parseUnits } from "viem";
import { encodeFunctionData } from 'viem';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWalletClient,
  usePublicClient,
} from "wagmi";
import { type Hash } from 'viem';

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
  rpcUrl: string;
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
    name: 'Sepolia',
    symbol: 'ETH',
    chainId: 11155111,
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo'
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    chainId: 56,
    icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
    explorerUrl: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    chainId: 137,
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    explorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com'
  }
];

// Network-specific token definitions
const networkTokens: { [key: string]: Token[] } = {
  eth: [
    {
      id: 'eth',
      symbol: "ETH",
      name: "Sepolia ETH",
      price: 2000,
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
      decimals: 18,
      minAmount: 0.01,
      maxAmount: 10,
    },
    {
      id: 'usdt',
      symbol: "USDT",
      name: "Tether USD",
      price: 1,
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
      decimals: 6,
      minAmount: 10,
      maxAmount: 20000,
    }
  ],
  bsc: [
    {
      id: 'bnb',
      symbol: "BNB",
      name: "BNB",
      price: 300,
      icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
      decimals: 18,
      minAmount: 0.1,
      maxAmount: 100,
    },
    {
      id: 'usdt',
      symbol: "USDT",
      name: "Tether USD",
      price: 1,
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
      decimals: 18,
      minAmount: 10,
      maxAmount: 20000,
    }
  ],
  polygon: [
    {
      id: 'matic',
      symbol: "MATIC",
      name: "Polygon",
      price: 1,
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
      decimals: 18,
      minAmount: 10,
      maxAmount: 10000,
    },
    {
      id: 'usdt',
      symbol: "USDT",
      name: "Tether USD",
      price: 1,
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
      decimals: 6,
      minAmount: 10,
      maxAmount: 20000,
    }
  ]
};

// Contract ABI
const abi = [
  {
    inputs: [
      { internalType: "address", name: "_admin", type: "address" },
      { internalType: "uint256", name: "_TokenPriceInUSDT", type: "uint256" },
      { internalType: "address", name: "_ethpriceFeed", type: "address" },
      { internalType: "address", name: "_USDT", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BuyWithNative",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "BuyWithUSDT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
];

export default function BuyTokenModal({ isOpen, onClose }: BuyTokenModalProps) {
  const [step, setStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('eth');
  const [selectedToken, setSelectedToken] = useState<Token>(networkTokens['eth'][0]);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [estimatedGas, setEstimatedGas] = useState<number | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { 
    writeContract: approveUSDT,
    data: approveHash,
    isPending: isApproving,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useWriteContract();

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Watch for successful confirmation
  useEffect(() => {
    if (isConfirmed) {
      console.log("USDT approval confirmed!");
      setIsApproved(true);
      setError(null);
      setIsProcessing(false);
    }
  }, [isConfirmed]);

  // Watch for errors
  useEffect(() => {
    if (approveError || confirmError) {
      console.error("Error:", approveError || confirmError);
      setError((approveError || confirmError)?.message || 'Transaction failed. Please try again.');
      setIsApproved(false);
      setIsProcessing(false);
    }
  }, [approveError, confirmError]);

  const handleApproveUSDT = async () => {
    if (!amount) {
      setError("Amount is required");
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      console.log("Starting USDT approval...");
      
      const spenderAddress = "0xC414436B424318808069A9ec5B65C52A7523c743";
      const maxApproval = parseUnits("115792089237316195423570985008687907853269984665640564039457", 6);

      console.log("Preparing approval transaction...");
      console.log("Spender:", spenderAddress);
      console.log("Amount:", maxApproval.toString());

      await approveUSDT({
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        abi: [
          {
            inputs: [
              { name: "_spender", type: "address" },
              { name: "_value", type: "uint256" }
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        functionName: "approve",
        args: [spenderAddress, maxApproval],
      });
      
    } catch (error: any) {
      console.error("Error in USDT approval:", error);
      setError(error.message || 'USDT approval failed. Please try again.');
      setIsApproved(false);
      setIsProcessing(false);
    }
  };

  const handleNative = async () => {
    if (!amount || !walletClient) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      console.log("Starting native token purchase...");
      
      const value = parseEther(amount); 
      console.log("Amount in wei:", value.toString());

      const hash = await walletClient.sendTransaction({
        to: "0xC414436B424318808069A9ec5B65C52A7523c743",
        data: encodeFunctionData({
          abi: abi,
          functionName: 'BuyWithNative',
          args: [],
        }),
        value: value,
      });
      
      setTransactionHash(hash);
      console.log("Native Payment transaction submitted:", hash);
      
      setTimeout(() => {
        resetAndClose();
      }, 3000);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUSDT = async () => {
    if (!amount || !walletClient) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      const usdtAmount = amount;
      
      const hash = await walletClient.sendTransaction({
        to: '0xC414436B424318808069A9ec5B65C52A7523c743',
        data: encodeFunctionData({
          abi: abi,
          functionName: 'BuyWithUSDT',
          args: [usdtAmount],
        }),
      });
      
      setTransactionHash(hash);
      console.log("USDT Payment transaction submitted:", hash);
      
      setTimeout(() => {
        resetAndClose();
      }, 3000);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || 'Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setError(null);
      
      // Validate amount
      const amountError = validateAmount(amount);
      if (amountError) {
        setError(amountError);
        return;
      }

      if (!isConnected) {
        setError("Please connect your wallet first");
        return;
      }

      // For USDT purchases, verify approval
      if (selectedToken?.symbol === "USDT" && !isApproved) {
        await handleApproveUSDT();
        return;
      }

      setIsProcessing(true);

      if (selectedToken?.symbol === "USDT") {
        await handleUSDT();
      } else {
        await handleNative();
      }

    } catch (err: any) {
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const switchNetwork = async (networkId: string) => {
    const network = networks.find(n => n.id === networkId);
    if (!network) return;

    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${network.chainId.toString(16)}` }],
        });
        setSelectedNetwork(networkId);
      } catch (error: any) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${network.chainId.toString(16)}`,
                  chainName: network.name,
                  nativeCurrency: {
                    name: network.symbol,
                    symbol: network.symbol,
                    decimals: 18,
                  },
                  rpcUrls: [network.rpcUrl],
                  blockExplorerUrls: [network.explorerUrl],
                },
              ],
            });
            setSelectedNetwork(networkId);
          } catch (addError) {
            console.error('Error adding network:', addError);
          }
        }
        console.error('Error switching network:', error);
      }
    }
  };

  const handleNetworkChange = async (networkId: string) => {
    await switchNetwork(networkId);
    setSelectedNetwork(networkId);
    setSelectedToken(networkTokens[networkId][0]); // Set first token of selected network
    setStep(2);
  };

  const handleTokenSelect = (token: Token) => {
    try {
      setError(null);
      setSelectedToken(token);
      setStep(3);
    } catch (err) {
      console.error('Error selecting token:', err);
      setError('Failed to select token. Please try again.');
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
    setSelectedNetwork('eth');
    setSelectedToken(networkTokens['eth'][0]);
    setAmount('');
    setIsProcessing(false);
    setError(null);
    setTransactionHash(null);
    setEstimatedGas(null);
    setIsApproved(false);
    onClose();
  };

  // Handle back navigation
  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
      if (step === 3) {
        setSelectedToken(networkTokens[selectedNetwork][0]);
        setAmount('');
        setEstimatedGas(null);
      }
      if (step === 2) {
        setSelectedNetwork('eth');
      }
    } else {
      resetAndClose();
    }
  };

  // Validate amount input
  const validateAmount = (value: string): string | null => {
    if (!value) return 'Amount is required';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Invalid amount';
    if (numValue <= 0) return 'Amount must be greater than 0';
    
    if (selectedToken?.minAmount && numValue < selectedToken.minAmount) {
      return `Minimum amount is ${selectedToken.minAmount} ${selectedToken.symbol}`;
    }
    
    if (selectedToken?.maxAmount && numValue > selectedToken.maxAmount) {
      return `Maximum amount is ${selectedToken.maxAmount} ${selectedToken.symbol}`;
    }
    
    return null;
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    setAmount(value);
    const validationError = validateAmount(value);
    setError(validationError);
    
    // Calculate estimated gas if amount is valid
    if (!validationError && value) {
      try {
        const numValue = parseFloat(value);
        // Simple gas estimation based on amount
        const estimatedGasValue = Math.ceil(numValue * 2.5);
        setEstimatedGas(estimatedGasValue);
      } catch (err) {
        console.error('Error calculating gas:', err);
        setEstimatedGas(null);
      }
    } else {
      setEstimatedGas(null);
    }
  };

  // Format price display
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  // Format token amount
  const formatTokenAmount = (amount: string): string => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: selectedToken.decimals
    });
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
      const network = networks.find(n => n.id === selectedNetwork);
      if (network) {
        window.open(`${network.explorerUrl}/tx/${transactionHash}`, '_blank');
      }
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

  // Render purchase or approve button based on token type
  const renderActionButton = () => {
    if (!selectedToken) return null;

    if (selectedToken.symbol === "USDT" && !isApproved) {
      return (
        <div className="space-y-4">
          <button
            onClick={handleApproveUSDT}
            disabled={isProcessing || isApproving || isConfirming || !amount || Number(amount) <= 0}
            className="w-full bg-accent text-white py-3 rounded-lg 
              hover:bg-accent/90 transition-colors flex items-center 
              justify-center space-x-2 disabled:opacity-50 
              disabled:cursor-not-allowed"
          >
            {isProcessing || isApproving || isConfirming ? (
              <>
                <Spinner className="w-5 h-5 animate-spin" />
                <span>
                  {isConfirming 
                    ? "Waiting for Confirmation..." 
                    : "Approving USDT..."}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Approve USDT Transfer</span>
              </>
            )}
          </button>
          <p className="text-sm text-muted-foreground text-center">
            First approve USDT transfer, then you can proceed with the purchase
          </p>
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
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
              <span>Processing Purchase...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              <span>Confirm Purchase</span>
            </>
          )}
        </button>
        {selectedToken.symbol === "USDT" && isApproved && (
          <p className="text-sm text-green-500 text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            USDT Transfer Approved
          </p>
        )}
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
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-gray-200">Select Network</label>
                    <div className="grid grid-cols-3 gap-3">
                      {networks.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => handleNetworkChange(network.id)}
                          className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all ${
                            selectedNetwork === network.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-700 hover:border-primary/50 text-gray-300'
                          }`}
                        >
                          <img src={network.icon} className="w-5 h-5" />
                          <span className="text-sm font-medium">{network.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
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
                  <h2 className="text-xl font-bold mb-6">Select Token</h2>
                  {networkTokens[selectedNetwork].map((token) => (
                    <TokenItem key={token.id} token={token} onSelect={() => handleTokenSelect(token)} />
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
                          type="number"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          className="w-full pl-12 pr-20 py-3 rounded-lg bg-background 
                            border border-border/50 focus:outline-none 
                            focus:border-accent/50 transition-colors"
                          placeholder="0.00"
                          disabled={isProcessing}
                          step="any"
                          min={selectedToken.minAmount}
                          max={selectedToken.maxAmount}
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
                        <span>{formatPrice(selectedToken.price)}</span>
                      </div>
                      {estimatedGas && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network Fee</span>
                          <span>{formatPrice(estimatedGas)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold pt-2 
                        border-t border-border/50">
                        <span>Total</span>
                        <span>{formatPrice(calculateTotal())}</span>
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

                  {renderActionButton()}
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

const TokenItem = ({ token, onSelect }: { token: Token, onSelect: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onSelect}
    className="flex items-center justify-between p-4 rounded-xl 
      border border-border/50 hover:border-accent/50 
      hover:bg-accent/5 transition-all w-full group"
  >
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 relative flex items-center justify-center">
        <img src={token.icon} width={40} height={40} />
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
