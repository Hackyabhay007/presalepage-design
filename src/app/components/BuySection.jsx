'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WalletIcon, 
  ArrowRightIcon, 
  RefreshCwIcon, 
  InfoIcon,
  EthernetIcon,
  AlertCircleIcon
} from 'lucide-react';

// Network configurations
const networks = {
  eth: {
    name: 'Ethereum',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    color: '#627EEA',
    tokens: [
      {
        id: 'eth',
        symbol: 'ETH',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
      },
      {
        id: 'usdt_eth',
        symbol: 'USDT',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png'
      }
    ],
    chainId: '0x1'
  },
  bsc: {
    name: 'BSC', 
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    color: '#F3BA2F',
    tokens: [
      {
        id: 'bnb',
        symbol: 'BNB',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
      },
      {
        id: 'usdt_bsc',
        symbol: 'USDT',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png'
      }
    ],
    chainId: '0x38'
  },
  matic: {
    name: 'Polygon',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png', 
    color: '#8247E5',
    tokens: [
      {
        id: 'matic',
        symbol: 'MATIC',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'
      },
      {
        id: 'usdt_polygon',
        symbol: 'USDT',
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png'
      }
    ],
    chainId: '0x89'
  }
};

export default function BuySection() {
  const [selectedNetwork, setSelectedNetwork] = useState('eth');
  const [selectedToken, setSelectedToken] = useState(networks.eth.tokens[0].symbol);
  const [amount, setAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('0');
  
  const calculateTokens = (value) => {
    // Example rate: 1 ETH = 50000 tokens
    const rates = {
      ETH: 50000,
      BNB: 150000,
      MATIC: 300000,
      USDT: 1
    };
    
    const rate = rates[selectedToken] || 1;
    return (parseFloat(value) * rate || 0).toFixed(2);
  };

  return (
    <div className="relative min-h-screen bg-background py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.1), transparent 70%)',
            'radial-gradient(circle at 60% 60%, rgba(157, 78, 221, 0.15), transparent 70%)',
            'radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.1), transparent 70%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Buy Card */}
          <div className="bg-background-elevated/50 backdrop-blur-xl rounded-3xl 
            border border-accent-500/20 shadow-2xl overflow-hidden">
            
            {/* Card Header */}
            <div className="p-6 border-b border-accent-500/20">
              <h2 className="text-2xl font-bold text-text">Buy Tokens</h2>
              <p className="text-text-secondary mt-1">Select network and token to continue</p>
            </div>

            {/* Network Selection */}
            <div className="p-6 border-b border-accent-500/20">
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Select Network
              </label>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(networks).map(([key, network]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                      onClick={() => {
                      setSelectedNetwork(key);
                      setSelectedToken(network.tokens[0].symbol);
                    }}
                    className={`relative rounded-xl p-4 border transition-all duration-200
                      ${selectedNetwork === key 
                        ? 'border-accent-500 bg-accent-500/10' 
                        : 'border-accent-500/20 hover:border-accent-500/40'}`}
                  >
                    <div className="flex flex-col items-center">
                      <img src={network.icon} alt={network.name} className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium text-text">{network.name}</span>
                    </div>
                    {selectedNetwork === key && (
                      <motion.div
                        layoutId="networkIndicator"
                        className="absolute inset-0 border-2 border-accent-500 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Token Selection and Amount */}
            <div className="p-6 space-y-6">
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Select Token
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {networks[selectedNetwork].tokens.map((token) => (
                    <motion.button
                      key={token.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedToken(token)}
                      className={`relative rounded-xl p-4 border transition-all duration-200
                        ${selectedToken === token 
                          ? 'border-accent-500 bg-accent-500/10' 
                          : 'border-accent-500/20 hover:border-accent-500/40'}`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <img 
                          src={`${token.icon}`} 
                          alt={token.symbol} 
                          className="w-6 h-6" 
                        />
                        <span className="text-text font-medium">{token.symbol}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
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

              {/* Token Amount Display */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-accent-500/5 border border-accent-500/20 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">You will receive:</span>
                  <span className="text-xl font-bold text-accent-400">
                    {tokenAmount} TOKEN
                  </span>
                </div>
              </motion.div>

              {/* Buy Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-secondary-500 
                  rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-background-elevated border border-accent-500/20 
                  rounded-xl px-6 py-4 flex items-center justify-center space-x-2 
                  group-hover:bg-transparent transition-colors">
                  <WalletIcon className="w-5 h-5 text-accent-400" />
                  <span className="font-semibold text-text">
                    Connect Wallet to Buy
                  </span>
                  <ArrowRightIcon className="w-4 h-4 text-accent-400 
                    group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </div>

            {/* Info Section */}
            <div className="p-6 bg-background-elevated/50 border-t border-accent-500/20">
              <div className="flex items-start space-x-3">
                <InfoIcon className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-text-secondary">
                  Tokens will be automatically sent to your wallet after the transaction 
                  is confirmed. The exact amount may vary based on network fees and 
                  token price at the time of purchase.
                </div>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {Object.entries(networks).map(([key, network]) => (
              <div
                key={key}
                className="bg-background-elevated/30 backdrop-blur-sm rounded-xl 
                  border border-accent-500/20 p-4"
              >
                <div className="flex items-center space-x-3">
                  <img src={network.icon} alt={network.name} className="w-6 h-6" />
                  <div>
                    <div className="text-sm font-medium text-text">{network.name}</div>
                    <div className="text-xs text-text-secondary">
                      Chain ID: {network.chainId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
