'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Activity,
  DollarSign
} from 'lucide-react';
import BuyTokenModal from './BuyTokenModal';
import { TransactionHistory } from './TransactionHistory';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';

interface UserDeposit {
  id: number;
  address: string;
  total_native_deposit: number;
  total_usdt_deposit: number;
  total_token_amount: number;
  last_updated: string;
}

interface UserTransfer {
  id: number;
  address: string;
  amount: number;
  type: 'native' | 'usdt';
  timestamp: string;
  transaction_hash: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'transfer';
  tokenSymbol: string;
  amount: number;
  price: number;
  timestamp: string;
  status: 'completed';
  network: string;
}

export function TokenDashboard() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDeposits, setUserDeposits] = useState<UserDeposit | null>(null);
  const [userTransfers, setUserTransfers] = useState<UserTransfer[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        setEthPrice(2000); // Fallback price
      }
    };

    const fetchUserData = async () => {
      if (!isConnected || !address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user deposits
        const { data: depositsData, error: depositsError } = await supabase
          .from('user_deposits')
          .select('*')
          .eq('address', address.toLowerCase())
          .single();

        if (depositsError && depositsError.code !== 'PGRST116') {
          console.error('Error fetching deposits:', depositsError);
          throw depositsError;
        }

        // Fetch user transfers
        const { data: transfersData, error: transfersError } = await supabase
          .from('user_transfers')
          .select('*')
          .eq('address', address.toLowerCase())
          .order('timestamp', { ascending: false });

        if (transfersError) {
          console.error('Error fetching transfers:', transfersError);
          throw transfersError;
        }

        setUserDeposits(depositsData);
        setUserTransfers(transfersData || []);

        // Fetch ETH price
        await fetchEthPrice();
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserDeposits(null);
        setUserTransfers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    // Refresh data every minute
    const interval = setInterval(fetchUserData, 60000);
    return () => clearInterval(interval);
  }, [address, isConnected]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const totalUsdValue = userDeposits
    ? (userDeposits.total_native_deposit * ethPrice) + userDeposits.total_usdt_deposit
    : 0;

  const transformTransfers = (transfers: UserTransfer[]): Transaction[] => {
    return transfers.map(transfer => ({
      id: transfer.id.toString(),
      type: 'transfer',
      tokenSymbol: transfer.type === 'native' ? 'ETH' : 'USDT',
      amount: transfer.amount,
      price: transfer.type === 'native' ? ethPrice : 1,
      timestamp: transfer.timestamp,
      status: 'completed',
      network: 'Ethereum'
    }));
  };

  if (!isConnected || !address) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view your dashboard and transaction history
          </p>
        </div>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <DollarSign className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">
                ${isLoading ? "Loading..." : formatCurrency(totalUsdValue)}
              </span>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-muted-foreground">Token Balance</span>
              <Coins className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatCurrency(userDeposits?.total_token_amount || 0)} NXS
              </span>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-muted-foreground">24h Activity</span>
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">
                {userTransfers.filter(tx => 
                  new Date(tx.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
                ).length} transfers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction History Section */}
      <section className="mt-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : userTransfers.length > 0 ? (
          <TransactionHistory transactions={transformTransfers(userTransfers)} />
        ) : (
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Coins className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">No Transactions Yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Start your journey by buying tokens. Your transaction history will appear here.
              </p>
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="mt-4 bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2"
              >
                <Coins className="w-4 h-4" />
                <span>Buy Tokens</span>
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
