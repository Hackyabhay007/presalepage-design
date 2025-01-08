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
  network: string;
  explorer: string;
}

// Network configurations
const NETWORKS = {
  eth: {
    name: 'Ethereum',
    rpcUrl: 'https://rpc.flashbots.net',
    explorer: 'https://etherscan.io',
    blocksPerDay: 7200
  },
  bsc: {
    name: 'BSC',
    rpcUrl: 'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3',
    explorer: 'https://bscscan.com',
    blocksPerDay: 28800
  },
  polygon: {
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    blocksPerDay: 43200
  }
};

const CONTRACT_ADDRESS = "0x8b139E5b4Ad91E26b1c8b1445Ad488c5530EdFDC".toLowerCase();

const EVENT_SIGNATURES = {
  BoughtWithNative: "BoughtWithNative(address,uint256,uint256,uint256)",
  BoughtWithUSDT: "BoughtWithUSDT(address,uint256,uint256,uint256)"
};

// Create providers for each network
const providers = Object.entries(NETWORKS).reduce((acc, [network, config]) => ({
  ...acc,
  [network]: new ethers.providers.JsonRpcProvider(config.rpcUrl)
}), {} as { [key: string]: ethers.providers.JsonRpcProvider });

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TokenPurchaseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventsForNetwork = async (network: string, provider: ethers.providers.JsonRpcProvider) => {
    try {
      const currentBlock = await provider.getBlockNumber();
      // Fetch last 2 hours of blocks instead of 24 hours to avoid rate limiting
      const blocksPerHour = NETWORKS[network].blocksPerDay / 24;
      const fromBlock = currentBlock - (blocksPerHour * 2);

      // Fetch events in smaller chunks
      const CHUNK_SIZE = 2000; // Number of blocks per request
      const chunks = [];
      
      for (let startBlock = fromBlock; startBlock < currentBlock; startBlock += CHUNK_SIZE) {
        const endBlock = Math.min(startBlock + CHUNK_SIZE - 1, currentBlock);
        
        // Add delay between chunks to avoid rate limiting
        if (chunks.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        const [nativeLogs, usdtLogs] = await Promise.all([
          provider.getLogs({
            address: CONTRACT_ADDRESS,
            topics: [utils.id(EVENT_SIGNATURES.BoughtWithNative)],
            fromBlock: startBlock,
            toBlock: endBlock
          }).catch(error => {
            console.warn(`Error fetching native logs for ${network} chunk ${startBlock}-${endBlock}:`, error);
            return [];
          }),
          provider.getLogs({
            address: CONTRACT_ADDRESS,
            topics: [utils.id(EVENT_SIGNATURES.BoughtWithUSDT)],
            fromBlock: startBlock,
            toBlock: endBlock
          }).catch(error => {
            console.warn(`Error fetching USDT logs for ${network} chunk ${startBlock}-${endBlock}:`, error);
            return [];
          })
        ]);

        chunks.push(...nativeLogs, ...usdtLogs);
      }

      // Process all logs
      const processedLogs = chunks.map(log => ({
        id: `${network}-${log.transactionHash}-${log.logIndex}`,
        timestamp: new Date().toISOString(), // Will be updated when we fetch the block
        eventType: log.topics[0] === utils.id(EVENT_SIGNATURES.BoughtWithNative) ? 'BoughtWithNative' : 'BoughtWithUSDT',
        transactionHash: log.transactionHash,
        network,
        explorer: NETWORKS[network].explorer
      }));

      // Fetch timestamps in batches
      const BATCH_SIZE = 10;
      for (let i = 0; i < processedLogs.length; i += BATCH_SIZE) {
        const batch = processedLogs.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (log) => {
            try {
              const tx = await provider.getTransaction(log.transactionHash);
              if (tx && tx.blockNumber) {
                const block = await provider.getBlock(tx.blockNumber);
                log.timestamp = new Date(block.timestamp * 1000).toISOString();
              }
            } catch (error) {
              console.warn(`Error fetching timestamp for tx ${log.transactionHash}:`, error);
            }
          })
        );
        
        // Add small delay between batches
        if (i + BATCH_SIZE < processedLogs.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      return processedLogs;
    } catch (error) {
      console.error(`Error fetching events for ${network}:`, error);
      return [];
    }
  };

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const allEvents = await Promise.all(
        Object.entries(providers).map(([network, provider]) => 
          fetchEventsForNetwork(network, provider)
        )
      );

      // Combine and sort all events by timestamp
      const combinedEvents = allEvents
        .flat()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setTransactions(combinedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Token Purchase Transactions</h1>
        <button 
          onClick={fetchAllEvents}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.eventType === 'BoughtWithNative' ? 'Purchase with ETH' : 'Purchase with USDT'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.network}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                    <a 
                      href={`${tx.explorer}/tx/${tx.transactionHash}`}
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
