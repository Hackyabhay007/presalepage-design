'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { WalletIcon, ArrowRightIcon, InfoIcon } from "lucide-react";
import { PaymentSuccessModal } from './PaymentSuccessModal';
import wagmigotchiABI from "../../../ABI/contractABI";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";
import {
  useReadContract,
  useWriteContract,
  useAccount,
} from "wagmi";

// abi
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
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "PreSalePayment__Erc20AmountIsZeroBalanceTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "PreSalePayment__EthAmountIsZeroBalanceTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "PreSalePayment__EthAmountIsZeroTransferFailed",
    type: "error",
  },
  { inputs: [], name: "PreSalePayment__FundTransferFailed", type: "error" },
  {
    inputs: [],
    name: "PreSalePayment__UsdtAmountIsZeroTransferFailed",
    type: "error",
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "BoughtWithNative",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "BoughtWithUSDT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
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
  },
  {
    inputs: [],
    name: "EthUSDDataFeed",
    outputs: [
      {
        internalType: "contract AggregatorV3Interface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TokenPriceInUSDT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USDT",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPriceOfETH",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newAdmin", type: "address" }],
    name: "updateAdimin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_NewTokenPriceInUSDT",
        type: "uint256",
      },
    ],
    name: "updateTokenPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "userTokenAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "withdrawERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Network configurations
const networks = {
  eth: {
    name: "Sepolia",
    symbol: "ETH",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    tokens: [
      {
        id: "eth",
        symbol: "ETH",
        icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
        decimals: 18,
        minAmount: 0.01,
        maxAmount: 10,
      },
      {
        id: "usdt",
        symbol: "USDT",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
        decimals: 6,
        minAmount: 10,
        maxAmount: 20000,
      },
    ],
    chainId: 11155111,
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
    explorerUrl: "https://sepolia.etherscan.io",
  },
  bsc: {
    name: "BSC",
    symbol: "BNB",
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",
    tokens: [
      {
        id: "bnb",
        symbol: "BNB",
        icon: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",
        decimals: 18,
        minAmount: 0.1,
        maxAmount: 100,
      },
      {
        id: "usdt",
        symbol: "USDT",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
        decimals: 18,
        minAmount: 10,
        maxAmount: 20000,
      },
    ],
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorerUrl: "https://bscscan.com",
  },
  matic: {
    name: "Polygon",
    symbol: "MATIC",
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    tokens: [
      {
        id: "matic",
        symbol: "MATIC",
        icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
        decimals: 18,
        minAmount: 10,
        maxAmount: 10000,
      },
      {
        id: "usdt",
        symbol: "USDT",
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
        decimals: 6,
        minAmount: 10,
        maxAmount: 20000,
      },
    ],
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
  },
};

const BuySection = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('eth');
  const [selectedToken, setSelectedToken] = useState(
    networks.eth.tokens[0].symbol
  );
  const [amount, setAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("0");

  console.log(selectedNetwork, selectedToken, amount, tokenAmount);

  //
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionData, setTransactionData] = useState({
    hash: '',      // Default hash value
    amount: 0,     // Default amount
    symbol: '',    // Default symbol
  });
  const handlePurchaseSuccess = (data) => {
    setTransactionData({
      hash: data.transactionHash,
      amount: data.tokenAmount,
      symbol: data.tokenSymbol
    });
    setShowSuccessModal(true);
  };

  const calculateTokens = (value) => {
    // Example rate: 1 ETH = 50000 tokens
    const rates = {
      ETH: 50000,
      BNB: 150000,
      MATIC: 300000,
      USDT: 1,
    };

    const rate = rates[selectedToken] || 1;
    return (parseFloat(value) * rate || 0).toFixed(2);
  };

  const { isConnected } = useAccount();

  const { writeContract: nativepayment, isLoading: isNaivepaymentLoading } = useWriteContract();
  
 

  const handleNative = async () => {
    if (!amount) return
    try {
      const tx = await nativepayment({
        address: "0xF4187144b589e31853471683AC676616101835Fb",
        abi: abi,
        functionName: 'BuyWithNative',
        value: parseEther(amount),
      });
      
      console.log("Native Payment successful", tx);
      
      if (tx) {
        handlePurchaseSuccess({
          transactionHash: tx,
          tokenAmount: amount,
          tokenSymbol: selectedToken
        });
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const { writeContract: USDTPAYMENT, isLoading: isUSDTPAYMENTLoading } = useWriteContract();
  
 

  const handleUSDT = async () => {
    if (!amount) return
    try {
      const tx = await USDTPAYMENT({
        address: '0xF4187144b589e31853471683AC676616101835Fb',
        abi: abi,
        functionName: 'BuyWithUSDT',
        args: [amount],
      });
      
      console.log("USDT Payment successful", tx);
      
      if (tx) {
        handlePurchaseSuccess({
          transactionHash: tx,
          tokenAmount: amount,
          tokenSymbol: selectedToken
        });
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const { writeContract: approveUSDT, isLoading: isApproveLoading } = useWriteContract();

  const handleApproveUSDT = async () => {
    if (!amount) {
      console.error("Amount is required");
      return; 
    }
    
    try {
      console.log("Starting USDT approval...");
      const usdtAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Mainnet USDT address
      const spenderAddress = "0xF4187144b589e31853471683AC676616101835Fb"; // Your contract address
      const maxApproval = "115792089237316195423570985008687907853269984665640564039457584007913129639935"; // Max uint256

      const tx = await approveUSDT({
        address: usdtAddress,
        abi: [
          {
            "inputs": [
              {"name": "_spender", "type": "address"},
              {"name": "_value", "type": "uint256"}
            ],
            "name": "approve",
            "outputs": [{"name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'approve',
        args: [spenderAddress, maxApproval],
      });

      console.log("Approval transaction submitted:", tx);
    } catch (error) {
      console.error("Error in USDT approval:", error);
    }
  };

  const handleApproveAndBuyUSDT = async () => {
    await handleApproveUSDT();
    await handleUSDT();
  };

  const handleselectTokenPayment = () => {
    if (selectedToken === "USDT") {
      handleUSDT(); // Only handle the USDT purchase
    } else {
      handleNative(); // Handle ETH purchase
    }
  };

  const switchNetwork = async (networkId) => {
    if (typeof window.ethereum !== 'undefined') {
      const network = networks[networkId];
      if (!network) return;

      const chainIdHex = `0x${network.chainId.toString(16)}`;
      
      try {
        // Try switching to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        setSelectedNetwork(networkId);
        setSelectedToken(network.tokens[0].symbol);
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chainIdHex,
                  chainName: network.name,
                  nativeCurrency: {
                    name: network.symbol,
                    symbol: network.symbol,
                    decimals: 18
                  },
                  rpcUrls: [network.rpcUrl],
                  blockExplorerUrls: [network.explorerUrl]
                },
              ],
            });
            setSelectedNetwork(networkId);
            setSelectedToken(network.tokens[0].symbol);
          } catch (addError) {
            console.error('Error adding network:', addError);
          }
        } else {
          console.error('Error switching network:', switchError);
        }
      }
    }
  };

  const handleNetworkChange = async (networkId) => {
    await switchNetwork(networkId);
  };

  return (
    <div className="relative min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div
            id="#buy"
            className="bg-background-elevated/50 backdrop-blur-xl rounded-3xl 
            border border-accent-500/20 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-accent-500/20">
              <h2 className="text-2xl font-bold text-text">Buy Tokens</h2>
              <p className="text-text-secondary mt-1">
                Select network and token to continue
              </p>
            </div>

            <div className="flex flex-col space-y-2 mb-4">
              <label className="text-sm font-medium text-gray-300">Select Network</label>
              <div className="flex space-x-2">
                {Object.entries(networks).map(([id, network]) => (
                  <button
                    key={id}
                    onClick={() => handleNetworkChange(id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                      selectedNetwork === id
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-gray-700 hover:border-accent-500/50'
                    }`}
                  >
                    <img src={network.icon} alt={network.name} className="w-5 h-5" />
                    <span className="text-sm font-medium">{network.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-b border-accent-500/20">
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Select Token
              </label>
              <div className="grid grid-cols-2 gap-4">
                {networks[selectedNetwork].tokens.map((token) => (
                  <motion.button
                    key={token.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedToken(token.symbol)}
                    className={`relative rounded-xl p-4 border transition-all duration-200
                      ${
                        selectedToken === token.symbol
                          ? "border-accent-500 bg-accent-500/10"
                          : "border-accent-500/20 hover:border-accent-500/40"
                      }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <img
                        src={`${token.icon}`}
                        alt={token.symbol}
                        className="w-6 h-6"
                      />
                      <span className="text-text font-medium">
                        {token.symbol}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Enter Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setTokenAmount(calculateTokens(e.target.value));
                    }}
                    placeholder={`Enter ${selectedToken} amount`}
                    className="w-full bg-background/50 border border-accent-500/20 rounded-xl 
                      px-4 py-3 text-text placeholder-text-secondary/50 focus:outline-none 
                      focus:border-accent-500 transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    {selectedToken}
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-accent-500/5 border border-accent-500/20 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">You will receive:</span>
                  <span className="text-xl font-bold text-accent-400">
                    {tokenAmount} $SFI
                  </span>
                </div>
              </motion.div>

              <div className="w-full max-w-md mx-auto space-y-4">
                {isConnected && selectedToken === "USDT" && (
                  <motion.button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
                    onClick={handleApproveUSDT}
                    disabled={isApproveLoading}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isApproveLoading ? (
                      <span>Approving...</span>
                    ) : (
                      <>
                        <span>Approve USDT</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 
                    rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div
                    className="relative bg-background-elevated border border-accent-500/20 
                    rounded-xl px-6 py-4 flex items-center justify-center space-x-2 
                    group-hover:bg-transparent transition-colors"
                  >
                    <WalletIcon className="w-5 h-5 text-accent-400" />
                    <span className="font-semibold text-text">
                      {isConnected ? (
                        <button
                          onClick={handleselectTokenPayment}
                        >
                          Buy
                        </button>
                      ) : (
                        <ConnectButton />
                      )}
                    </span>
                    <ArrowRightIcon
                      className="w-4 h-4 text-accent-400 
                      group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </motion.button>
              </div>

            </div>

            <div className="p-6 bg-background-elevated/50 border-t border-accent-500/20">
              <div className="flex items-start space-x-3">
                <InfoIcon className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-text-secondary">
                  Tokens will be automatically sent to your wallet after the
                  transaction is confirmed. The exact amount may vary based on
                  network fees and token price at the time of purchase.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      <PaymentSuccessModal
              isOpen={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              transactionHash={transactionData.hash}
              tokenAmount={transactionData.amount}
              tokenSymbol={transactionData.symbol}
            />

    
    </div>
  );
}

export default BuySection;
