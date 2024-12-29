// components/TokenDashboard.tsx
'use client';
import { useState, useEffect } from 'react';
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
  Percent,
  History
} from 'lucide-react';
import BuyTokenModal from './BuyTokenModal';
import { TransactionHistory } from './TransactionHistory';
import { useAccount } from 'wagmi';

interface Transaction {
  id: string;
  type: 'buy' | 'transfer';
  tokenSymbol: string;
  amount: number;
  price: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  network: string;
}

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    totalTokenAmount: 0,
    volume24h: 0,
    totalProfit: 0
  });
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch transactions
        const txResponse = await fetch(`/api/transactions?address=${address}`);
        if (!txResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const txData = await txResponse.json();
        setTransactions(txData);

        // Fetch portfolio data
        const portfolioResponse = await fetch(`/api/portfolio?address=${address}`);
        if (!portfolioResponse.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const portfolioData = await portfolioResponse.json();
        setPortfolioData(portfolioData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTransactions([]);
        setPortfolioData({
          totalValue: 0,
          totalTokenAmount: 0,
          volume24h: 0,
          totalProfit: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address]);

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
            value={isLoading ? "Loading..." : `$${portfolioData.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`}
            icon={DollarSign}
            trend={isLoading ? null : 12.5} 
          />
          <StatsCard 
            title="Active Tokens" 
            value={isLoading ? "Loading..." : portfolioData.totalTokenAmount.toLocaleString()} 
            icon={Coins} 
          />
          <StatsCard 
            title="24h Volume" 
            value={isLoading ? "Loading..." : `$${(portfolioData.volume24h / 1000000).toFixed(1)}M`}
            icon={Activity}
            trend={isLoading ? null : -5.2} 
          />
          <StatsCard 
            title="Total Profit" 
            value={isLoading ? "Loading..." : `$${portfolioData.totalProfit.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`}
            icon={TrendingUp}
            trend={isLoading ? null : (portfolioData.totalProfit > 0 ? 8.7 : -8.7)} 
          />
        </div>
      </section>

      {/* Transaction History Section */}
      <section className="mt-12">
        {isLoading && address ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : transactions.length > 0 ? (
          <TransactionHistory transactions={transactions} />
        ) : (
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Welcome to SpringFi!</h3>
              <p className="text-muted-foreground max-w-sm">
                Start your journey by buying SpringFi tokens. Once you make your first purchase, your transaction history will appear here.
              </p>
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="mt-4 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
              >
                <Coins className="w-4 h-4" />
                <span>Buy SpringFi Tokens</span>
              </button>
            </div>
          </div>
        )}
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
