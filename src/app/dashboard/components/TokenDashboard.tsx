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
import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useAppKitWallet } from '@reown/appkit-wallet-button/react';
import { toast } from 'sonner';
import BuyTokenModal from './BuyTokenModal';
import TransactionHistory from './TransactionHistory';
import { PaymentSuccessModal } from '@/app/components/PaymentSuccessModal';
import { supabase } from '@/lib/supabase';

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
}

interface UserStats {
  totalNativeByChain: {
    ethereum: number;
    bsc: number;
    polygon: number;
  };
  totalUsdt: number;
  totalTokens: number;
}

export function TokenDashboard() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalNativeByChain: {
      ethereum: 0,
      bsc: 0,
      polygon: 0
    },
    totalUsdt: 0,
    totalTokens: 0
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    hash: string;
    amount: number;
    symbol: string;
  }>({ hash: '', amount: 0, symbol: '' });
  
  const [tokenPrices, setTokenPrices] = useState({
    ethereum: 0,
    bsc: 0,
    polygon: 0
  });

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { isPending } = useAppKitWallet({
    onError(error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  });

  const fetchTokenPrices = async () => {
    try {
      console.log('Fetching token prices...');
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network&vs_currencies=usd'
      );
      const data = await response.json();
      
      console.log('CoinGecko response:', data);
      
      const prices = {
        ethereum: data.ethereum?.usd || 0,
        bsc: data.binancecoin?.usd || 0,
        polygon: data['matic-network']?.usd || 0
      };
      
      console.log('Setting token prices:', prices);
      setTokenPrices(prices);
      return prices;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return tokenPrices; // Return current state if fetch fails
    }
  };

  const calculateUserStats = (txs: Transaction[]) => {
    console.log('Starting calculateUserStats with transactions:', txs);
    
    const stats: UserStats = {
      totalNativeByChain: {
        ethereum: 0,
        bsc: 0,
        polygon: 0
      },
      totalUsdt: 0,
      totalTokens: 0
    };

    if (!txs || txs.length === 0) {
      console.log('No transactions found');
      return stats;
    }

    txs.forEach((tx, index) => {
      try {
        console.log(`\nProcessing transaction ${index + 1}/${txs.length}:`, {
          hash: tx.transaction_hash,
          chain: tx.chain_name,
          type: tx.payment_type,
          rawAmount: tx.deposit_amount,
          rawTokens: tx.token_amount
        });

        // Convert string amounts to numbers, ensuring proper decimal handling
        const depositAmount = parseFloat(tx.deposit_amount || '0');
        const tokenAmount = parseFloat(tx.token_amount || '0');

        console.log('Converted amounts:', {
          originalDeposit: tx.deposit_amount,
          convertedDeposit: depositAmount,
          originalToken: tx.token_amount,
          convertedToken: tokenAmount
        });

        if (isNaN(depositAmount) || isNaN(tokenAmount)) {
          console.error('Invalid amount in transaction:', tx);
          return; // Skip this transaction
        }

        // Add to total tokens
        stats.totalTokens += tokenAmount;

        // Add to appropriate total based on payment type
        if (tx.payment_type === 'usdt') {
          console.log(`Adding USDT amount: ${depositAmount}`);
          stats.totalUsdt += depositAmount;
        } else {
          const chain = tx.chain_name.toLowerCase();
          console.log(`Adding native token for chain ${chain}: ${depositAmount}`);
          
          if (chain === 'ethereum') {
            stats.totalNativeByChain.ethereum += depositAmount;
          } else if (chain === 'bsc') {
            stats.totalNativeByChain.bsc += depositAmount;
          } else if (chain === 'polygon') {
            stats.totalNativeByChain.polygon += depositAmount;
          } else {
            console.warn(`Unknown chain: ${chain}`);
          }
        }

        console.log('Updated stats:', JSON.stringify(stats, null, 2));
      } catch (error) {
        console.error('Error processing transaction:', error);
      }
    });

    console.log('Final calculated stats:', JSON.stringify(stats, null, 2));
    return stats;
  };

  const calculateTotalValue = (stats: UserStats, prices: typeof tokenPrices) => {
    console.log('\nCalculating total value with:', {
      stats: JSON.stringify(stats, null, 2),
      prices: JSON.stringify(prices, null, 2)
    });

    // Calculate values with proper decimal handling
    const ethValue = Number((stats.totalNativeByChain.ethereum * prices.ethereum).toFixed(6));
    const bnbValue = Number((stats.totalNativeByChain.bsc * prices.bsc).toFixed(6));
    const maticValue = Number((stats.totalNativeByChain.polygon * prices.polygon).toFixed(6));
    const usdtValue = Number(stats.totalUsdt.toFixed(6));

    console.log('Individual value calculations:', {
      ethereum: {
        amount: stats.totalNativeByChain.ethereum,
        price: prices.ethereum,
        value: ethValue
      },
      bsc: {
        amount: stats.totalNativeByChain.bsc,
        price: prices.bsc,
        value: bnbValue
      },
      polygon: {
        amount: stats.totalNativeByChain.polygon,
        price: prices.polygon,
        value: maticValue
      },
      usdt: {
        amount: stats.totalUsdt,
        value: usdtValue
      }
    });

    const total = ethValue + bnbValue + maticValue + usdtValue;
    console.log('Total value calculated:', total);

    return total;
  };

  const formatCurrency = (value: number) => {
    // For very small values (less than 0.01), show more decimal places
    if (value < 0.01 && value > 0) {
      return value.toFixed(6);
    }
    // For regular values, show 2 decimal places
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatTokenAmount = (value: number) => {
    // For very small values (less than 0.01), show more decimal places
    if (value < 0.01 && value > 0) {
      return value.toFixed(8);
    }
    // For regular values, show up to 4 decimal places
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected || !address) {
        console.log('No wallet connected');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userAddress = address.toLowerCase();
        console.log('Fetching data for address:', userAddress);
        
        // Fetch token prices first
        const prices = await fetchTokenPrices();
        console.log('Fetched token prices:', prices);
        
        // Fetch user transactions
        console.log('Fetching transactions from Supabase...');
        const { data: txData, error: txError } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('address', userAddress)
          .order('block_timestamp', { ascending: false });

        if (txError) {
          console.error('Error fetching transactions:', txError);
          toast.error('Failed to fetch transactions');
          return;
        }

        console.log('Fetched transactions:', txData?.length || 0, 'transactions');
        console.log('First transaction:', txData?.[0]);
        
        if (txData && txData.length > 0) {
          setTransactions(txData);
          const stats = calculateUserStats(txData);
          setUserStats(stats);
        } else {
          console.log('No transactions found for address');
        }

      } catch (error) {
        console.error('Error in user data flow:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 60000);
    return () => clearInterval(interval);
  }, [address, isConnected]);

  const totalUsdValue = calculateTotalValue(userStats, tokenPrices);

  if (!isConnected || !address) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-4">
            Connect your wallet to view your dashboard and transaction history
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => open({ view: 'Connect' })}
            disabled={isPending}
            className="px-6 py-2 rounded-lg bg-accent text-white 
              hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

          {/* Native Tokens Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Native Tokens</h3>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            {isLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">ETH:</span> {formatTokenAmount(userStats.totalNativeByChain.ethereum)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">BNB:</span> {formatTokenAmount(userStats.totalNativeByChain.bsc)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">MATIC:</span> {formatTokenAmount(userStats.totalNativeByChain.polygon)}
                </p>
              </div>
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
              <div>
                <p className="text-2xl font-bold">
                  ${formatTokenAmount(userStats.totalUsdt)}
                </p>
                {userStats.totalUsdt > 0 && userStats.totalUsdt < 0.01 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing extended decimals for small amounts
                  </p>
                )}
              </div>
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
                {formatTokenAmount(userStats.totalTokens)} SWG
              </p>
            )}
          </div>
        </div>

        <TransactionHistory />
      </section>

      <AnimatePresence>
        {showPurchaseModal && (
          <BuyTokenModal 
            isOpen={showPurchaseModal}
            onClose={() => setShowPurchaseModal(false)} 
          />
        )}
      </AnimatePresence>

      {showSuccessModal && (
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          transactionHash={transactionData.hash}
          tokenAmount={transactionData.amount}
          tokenSymbol={transactionData.symbol}
        />
      )}
    </div>
  );
}
