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
import TransactionHistory from './TransactionHistory';
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

export function TokenDashboard() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDeposits, setUserDeposits] = useState<UserDeposit | null>(null);
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
        // Ensure consistent case for the address
        const userAddress = address.toLowerCase();
        
        console.log('Connected wallet address:', address);
        console.log('Normalized address for query:', userAddress);
        
        // First try exact case
        let { data: depositsData, error: fetchError } = await supabase
          .from('user_deposits')
          .select('*')
          .eq('address', userAddress)
          .single();

        if (fetchError) {
          console.error('Error fetching with lowercase:', fetchError);
          
          // Try with original case
          const result = await supabase
            .from('user_deposits')
            .select('*')
            .eq('address', address)
            .single();
            
          depositsData = result.data;
          fetchError = result.error;
          
          if (result.error) {
            console.error('Error fetching with original case:', result.error);
          }
        }

        if (fetchError) {
          console.error('Final error fetching deposits:', fetchError);
          setUserDeposits(null);
        } else {
          console.log('Found deposits:', depositsData);
          setUserDeposits(depositsData);
        }

        // Fetch ETH price
        await fetchEthPrice();
      } catch (error) {
        console.error('Error in user data flow:', error);
        setUserDeposits(null);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Value Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            {isLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">${formatCurrency(totalUsdValue)}</p>
            )}
          </div>

          {/* ETH Deposits Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">ETH Deposited</h3>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            {isLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">
                {formatCurrency(userDeposits?.total_native_deposit || 0)} ETH
              </p>
            )}
          </div>

          {/* USDT Deposits Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">USDT Deposited</h3>
              <Activity className="w-4 h-4 text-green-500" />
            </div>
            {isLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">
                ${formatCurrency(userDeposits?.total_usdt_deposit || 0)}
              </p>
            )}
          </div>

          {/* Total Tokens Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Tokens</h3>
              <Coins className="w-4 h-4 text-purple-500" />
            </div>
            {isLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">
                {formatCurrency(userDeposits?.total_token_amount || 0)} SWG
              </p>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <TransactionHistory />
      </section>

      {/* Buy Token Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <BuyTokenModal 
            isOpen={showPurchaseModal}
            onClose={() => setShowPurchaseModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
