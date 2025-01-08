'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { formatDistanceToNow } from 'date-fns';
import { createClient } from '@supabase/supabase-js';

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TransactionHistory() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (!address) return;

      try {
        const { data, error } = await supabase
          .from('user_transactions')
          .select('*')
          .eq('address', address.toLowerCase())
          .order('block_timestamp', { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [address]);

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

  if (!address) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please connect your wallet to view transaction history
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Network</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tokens</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {formatDistanceToNow(new Date(tx.block_timestamp), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {tx.chain_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {tx.payment_type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {parseFloat(tx.deposit_amount).toFixed(6)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {parseFloat(tx.token_amount).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <a
                  href={getExplorerUrl(tx.chain_name, tx.transaction_hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = getExplorerUrl(tx.chain_name, tx.transaction_hash);
                    if (url !== '#') {
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <ArrowSquareOut size={20} />
                </a>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
