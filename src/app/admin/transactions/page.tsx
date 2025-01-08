'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';

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

type SortField = 'block_timestamp' | 'deposit_amount' | 'chain_name' | 'payment_type';
type SortOrder = 'asc' | 'desc';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('block_timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('user_transactions')
        .select('*');

      // Apply filters
      if (selectedChain !== 'all') {
        query = query.eq('chain_name', selectedChain);
      }
      if (selectedPaymentType !== 'all') {
        query = query.eq('payment_type', selectedPaymentType);
      }
      if (searchQuery) {
        query = query.or(`address.ilike.%${searchQuery}%,transaction_hash.ilike.%${searchQuery}%`);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === 'asc' });

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedChain, selectedPaymentType, searchQuery, sortField, sortOrder]);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Token Purchase Transactions</h1>
        <button 
          onClick={fetchTransactions}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by address or transaction hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Networks</option>
            <option value="ethereum">Ethereum</option>
            <option value="bsc">BSC</option>
            <option value="polygon">Polygon</option>
          </select>
          <select
            value={selectedPaymentType}
            onChange={(e) => setSelectedPaymentType(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payment Types</option>
            <option value="native">ETH</option>
            <option value="usdt">USDT</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading transactions...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('block_timestamp')}
                >
                  <div className="flex items-center gap-1">
                    Time {renderSortIcon('block_timestamp')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('payment_type')}
                >
                  <div className="flex items-center gap-1">
                    Type {renderSortIcon('payment_type')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('chain_name')}
                >
                  <div className="flex items-center gap-1">
                    Network {renderSortIcon('chain_name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('deposit_amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount {renderSortIcon('deposit_amount')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDistanceToNow(new Date(tx.block_timestamp), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {tx.payment_type === 'native' ? 'ETH' : 'USDT'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                    {tx.chain_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {parseFloat(tx.deposit_amount).toFixed(6)} {tx.payment_type === 'native' ? 'ETH' : 'USDT'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                    <a 
                      href={getExplorerUrl(tx.chain_name, tx.transaction_hash)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = getExplorerUrl(tx.chain_name, tx.transaction_hash);
                        if (url !== '#') {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
