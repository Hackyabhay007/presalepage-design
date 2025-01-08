'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { Users, DollarSign, ArrowUpDown } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  created_at: Date;
}

interface TokenPrices {
  [key: string]: {
    usd: number;
  };
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [totalSalesUSD, setTotalSalesUSD] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({
    ethereum: { usd: 0 },
    bsc: { usd: 0 },
    polygon: { usd: 0 },
    usdt: { usd: 1 }
  });

  const fetchTokenPrices = async () => {
    try {
      console.log('Fetching token prices from CoinGecko...');
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network&vs_currencies=usd'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }

      const data = await response.json();
      console.log('CoinGecko Response:', data);

      if (!data.ethereum?.usd || !data.binancecoin?.usd || !data['matic-network']?.usd) {
        throw new Error('Missing price data from CoinGecko');
      }

      const newPrices = {
        ethereum: { usd: Number(data.ethereum.usd) },
        bsc: { usd: Number(data.binancecoin.usd) },
        polygon: { usd: Number(data['matic-network'].usd) },
        usdt: { usd: 1 }
      };

      console.log('Setting new token prices:', newPrices);
      setTokenPrices(newPrices);

      return newPrices; // Return the prices for immediate use
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return null;
    }
  };

  const calculateUSDValue = (amount: string, chain: string, paymentType: 'native' | 'usdt', prices: TokenPrices) => {
    console.log('Calculating USD value for:', {
      originalAmount: amount,
      chain,
      paymentType,
      availablePrices: prices
    });

    let numericAmount;
    try {
      numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        console.error('Invalid amount:', amount);
        return 0;
      }
    } catch (error) {
      console.error('Error converting amount:', error);
      return 0;
    }

    if (paymentType === 'usdt') {
      console.log('USDT transaction value:', numericAmount);
      return numericAmount;
    }
    
    const chainLower = chain.toLowerCase();
    let price = 0;

    if (chainLower === 'bsc') {
      price = prices.bsc?.usd || 0;
    } else {
      price = prices[chainLower]?.usd || 0;
    }

    console.log('Price lookup:', {
      chain: chainLower,
      price,
      pricesState: prices
    });

    const usdValue = numericAmount * price;
    console.log('USD calculation:', {
      amount: numericAmount,
      price,
      usdValue
    });

    return usdValue;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch prices first and wait for them
      const prices = await fetchTokenPrices();
      if (!prices) {
        throw new Error('Failed to fetch token prices');
      }

      console.log('Using token prices:', prices);

      // Fetch transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('user_transactions')
        .select('*')
        .order('block_timestamp', { ascending: false });

      if (transactionError) throw transactionError;

      console.log('Fetched transactions:', transactionData);

      const uniqueUsers = new Set(transactionData?.map(tx => tx.address) || []);
      setActiveUsers(uniqueUsers.size);

      let totalUSD = 0;
      if (transactionData && transactionData.length > 0) {
        for (const tx of transactionData) {
          const usdValue = calculateUSDValue(tx.deposit_amount, tx.chain_name, tx.payment_type, prices);
          if (!isNaN(usdValue) && isFinite(usdValue)) {
            totalUSD += usdValue;
            console.log('Transaction processed:', {
              id: tx.id,
              usdValue,
              runningTotal: totalUSD
            });
          }
        }
      }

      console.log('Final calculations:', {
        totalUSD,
        transactionCount: transactionData?.length || 0,
        uniqueUsers: uniqueUsers.size
      });

      setTotalSalesUSD(totalUSD);
      setTransactions(transactionData || []);

    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getExplorerUrl = (chainName: string, hash: string) => {
    const explorers: { [key: string]: string } = {
      'ethereum': 'https://etherscan.io',
      'bsc': 'https://bscscan.com',
      'polygon': 'https://polygonscan.com'
    };
    
    const baseUrl = explorers[chainName.toLowerCase()];
    if (!baseUrl) return '#';
    return `${baseUrl}/tx/${hash}`;
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-500 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</h3>
              <p className="text-2xl font-bold">${totalSalesUSD.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}</p>
              <p className="text-xs text-gray-500 mt-1">Live prices from CoinGecko</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Users className="w-6 h-6 text-green-500 dark:text-green-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
              <p className="text-2xl font-bold">{activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Recent Transfers</h2>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {error && (
          <div className="p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Network</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">USD Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {transactions.map((tx) => {
                  const usdValue = calculateUSDValue(tx.deposit_amount, tx.chain_name, tx.payment_type, tokenPrices);
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDistanceToNow(new Date(tx.block_timestamp), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tx.address.slice(0, 6)}...{tx.address.slice(-4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tx.payment_type === 'native' ? getNativeToken(tx.chain_name) : 'USDT'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                        {tx.chain_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {parseFloat(tx.deposit_amount).toFixed(6)} {tx.payment_type === 'native' ? getNativeToken(tx.chain_name) : 'USDT'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                        <a 
                          href={getExplorerUrl(tx.chain_name, tx.transaction_hash)}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const getNativeToken = (chain: string): string => {
  const chainLower = chain.toLowerCase();
  switch (chainLower) {
    case 'ethereum':
      return 'ETH';
    case 'bsc':
      return 'BNB';
    case 'polygon':
      return 'MATIC';
    default:
      return chain;
  }
};
