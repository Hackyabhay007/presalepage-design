// app/(admin)/admin/transactions/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import { utils } from 'ethers';

// Event types and interfaces
interface TokenPurchaseEvent {
  id: string;
  timestamp: string;
  eventType: 'BoughtWithNative' | 'BoughtWithUSDT';
  transactionHash: string;
}

const CONTRACT_ADDRESS = "0x3bFF294B158e2a809A3adC952315eF65e47B7344".toLowerCase();
const GETBLOCK_ENDPOINT = process.env.NEXT_PUBLIC_GETBLOCK_ENDPOINT;

const EVENT_SIGNATURES = {
  BoughtWithNative: "BoughtWithNative(address,uint256,uint256,uint256)",
  BoughtWithUSDT: "BoughtWithUSDT(address,uint256,uint256,uint256)"
};

const provider = new ethers.providers.JsonRpcProvider(GETBLOCK_ENDPOINT);

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TokenPurchaseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const currentBlock = await provider.getBlockNumber();
      const fromBlock = currentBlock - 7200; // Last 24 hours approximately

      // Get logs for BoughtWithNative events
      const nativeEventTopic = utils.id(EVENT_SIGNATURES.BoughtWithNative);
      const nativeLogs = await provider.getLogs({
        address: CONTRACT_ADDRESS,
        topics: [nativeEventTopic],
        fromBlock,
        toBlock: 'latest'
      });

      // Get logs for BoughtWithUSDT events
      const usdtEventTopic = utils.id(EVENT_SIGNATURES.BoughtWithUSDT);
      const usdtLogs = await provider.getLogs({
        address: CONTRACT_ADDRESS,
        topics: [usdtEventTopic],
        fromBlock,
        toBlock: 'latest'
      });

      console.log('Native logs:', nativeLogs);
      console.log('USDT logs:', usdtLogs);

      const processedEvents: TokenPurchaseEvent[] = [];

      // Process native events
      for (const log of nativeLogs) {
        try {
          const block = await provider.getBlock(log.blockNumber);
          processedEvents.push({
            id: `${log.transactionHash}-${log.logIndex}`,
            timestamp: new Date(block.timestamp * 1000).toLocaleString(),
            eventType: 'BoughtWithNative',
            transactionHash: log.transactionHash
          });
        } catch (error) {
          console.error('Error processing native log:', error, log);
        }
      }

      // Process USDT events
      for (const log of usdtLogs) {
        try {
          const block = await provider.getBlock(log.blockNumber);
          processedEvents.push({
            id: `${log.transactionHash}-${log.logIndex}`,
            timestamp: new Date(block.timestamp * 1000).toLocaleString(),
            eventType: 'BoughtWithUSDT',
            transactionHash: log.transactionHash
          });
        } catch (error) {
          console.error('Error processing USDT log:', error, log);
        }
      }

      // Sort by timestamp, most recent first
      const sortedEvents = processedEvents.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setTransactions(sortedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch transaction events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Token Purchase Transactions</h1>
        <button 
          onClick={fetchEvents}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading transactions...</p>
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
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.eventType === 'BoughtWithNative' ? 'Purchase with ETH' : 'Purchase with USDT'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-4)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
