// components/TokenDashboard.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Wallet,
  Clock,
  Activity,
  DollarSign,
  BarChart3,
  Shield,
  Percent
} from 'lucide-react';
import { BuyTokenModal } from './BuyTokenModal';

const networks = [
  { id: 'eth', name: 'Ethereum', icon: '/eth.svg', color: 'blue' },
  { id: 'bsc', name: 'BSC', icon: '/bsc.svg', color: 'yellow' },
  { id: 'polygon', name: 'Polygon', icon: '/polygon.svg', color: 'purple' }
];

const tokens = {
  eth: [
    { id: 'eth', symbol: 'ETH', name: 'Ethereum' },
    { id: 'usdt', symbol: 'USDT', name: 'Tether' }
  ],
  bsc: [
    { id: 'bnb', symbol: 'BNB', name: 'BNB' },
    { id: 'busd', symbol: 'BUSD', name: 'BUSD' }
  ],
  polygon: [
    { id: 'matic', symbol: 'MATIC', name: 'Polygon' },
    { id: 'usdc', symbol: 'USDC', name: 'USD Coin' }
  ]
};

export function TokenDashboard() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [purchaseStep, setPurchaseStep] = useState(1);
  const [purchaseAmount, setPurchaseAmount] = useState('');

  const holdings = [
    {
      id: 1,
      name: 'NEXUS Token',
      symbol: 'NXS',
      purchasedAmount: 50000,
      purchasePrice: 0.00001,
      currentPrice: 0.000018,
      network: 'Ethereum',
      status: 'active',
      lastUpdate: '2 mins ago',
      volume24h: '1.2M',
      marketCap: '25M',
      circulatingSupply: '100M',
      totalSupply: '1B',
      allTimeHigh: 0.00002,
      allTimeLow: 0.000008
    },
    {
      id: 2,
      name: 'VERTEX Token',
      symbol: 'VTX',
      purchasedAmount: 75000,
      purchasePrice: 0.00002,
      currentPrice: 0.000019,
      network: 'BSC',
      status: 'active',
      lastUpdate: '5 mins ago',
      volume24h: '2.5M',
      marketCap: '45M',
      circulatingSupply: '250M',
      totalSupply: '1B',
      allTimeHigh: 0.00003,
      allTimeLow: 0.000015
    }
  ];

  interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: number | null;
  }

  const StatsCard = ({ title, value, icon: Icon, trend = null }: StatsCardProps) => (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={`flex items-center text-sm ${
            trend > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Overview Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Overview</h2>
            <p className="text-muted-foreground">Track your token investments</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPurchaseModal(true)}
            className="bg-accent text-white px-6 py-2 rounded-lg 
              hover:bg-accent/90 transition-colors flex items-center space-x-2"
          >
            <Coins className="w-4 h-4" />
            <span>Buy Tokens</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Value" 
            value="$12,450.00" 
            icon={DollarSign}
            trend={12.5} 
          />
          <StatsCard 
            title="Active Tokens" 
            value="4" 
            icon={Coins} 
          />
          <StatsCard 
            title="24h Volume" 
            value="$3.7M" 
            icon={Activity}
            trend={-5.2} 
          />
          <StatsCard 
            title="Total Profit" 
            value="$1,250.00" 
            icon={TrendingUp}
            trend={8.7} 
          />
        </div>
      </section>

      {/* Holdings Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold">Token Holdings</h3>
        
        {holdings.map((token) => (
          <motion.div
            key={token.id}
            whileHover={{ scale: 1.01 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 
              rounded-xl p-6 hover:border-accent/50 transition-all"
          >
            {/* Token Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-accent/10 
                  flex items-center justify-center">
                  <Coins className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">{token.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {token.symbol}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {token.network}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="font-semibold">${token.currentPrice}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium
                  ${token.currentPrice > token.purchasePrice 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-red-500/10 text-red-500'}`}>
                  {((token.currentPrice - token.purchasePrice) / 
                    token.purchasePrice * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Token Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-sm text-muted-foreground">Holdings</span>
                <p className="font-semibold">
                  {token.purchasedAmount.toLocaleString()} {token.symbol}
                </p>
                <span className="text-xs text-muted-foreground">
                  ≈ ${(token.purchasedAmount * token.currentPrice).toLocaleString()}
                </span>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Volume (24h)</span>
                <p className="font-semibold">${token.volume24h}</p>
                <span className="text-xs text-muted-foreground">
                  Last updated {token.lastUpdate}
                </span>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <p className="font-semibold">${token.marketCap}</p>
                <span className="text-xs text-muted-foreground">
                  Rank #123
                </span>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Supply</span>
                <p className="font-semibold">
                  {(Number(token.circulatingSupply) / 1000000).toFixed(1)}M
                </p>
                <span className="text-xs text-muted-foreground">
                  of {(Number(token.totalSupply) / 1000000000).toFixed(1)}B
                </span>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="mt-6 pt-6 border-t border-border/50 
              grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-sm text-muted-foreground">Purchase Price</span>
                <p className="font-semibold">${token.purchasePrice}</p>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">All-Time High</span>
                <p className="font-semibold">${token.allTimeHigh}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">All-Time Low</span>
                <p className="font-semibold">${token.allTimeLow}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">ROI</span>
                <p className={`font-semibold ${
                  token.currentPrice > token.purchasePrice 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {((token.currentPrice - token.purchasePrice) / 
                    token.purchasePrice * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
              flex items-center justify-center p-4"
          >
           <BuyTokenModal 
             isOpen={showPurchaseModal}
             onClose={() => setShowPurchaseModal(false)}
           />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
