'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';

interface Transaction {
  id: string;
  timestamp: string;
  type: 'native' | 'usdt';
  amount: string;
  tokenAmount: string;
  hash: string;
}

const CONTRACT_ADDRESS = "0x3bFF294B158e2a809A3adC952315eF65e47B7344".toLowerCase();
const GETBLOCK_ENDPOINT = process.env.NEXT_PUBLIC_GETBLOCK_ENDPOINT;

// ABI fragments for events
const ABI = [
  "event BoughtWithNative(address user, uint256 tokenDeposit, uint256 amount, uint256 timestamp)",
  "event BoughtWithUSDT(address user, uint256 tokenDeposit, uint256 amount, uint256 timestamp)"
];

const provider = new ethers.providers.JsonRpcProvider(GETBLOCK_ENDPOINT);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userAddress = address.toLowerCase();

        console.log('Fetching transactions for address:', userAddress);

        // Get current block and calculate fromBlock (30 days ago approximately)
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - (6500 * 30); // ~30 days of blocks

        // Get event signatures
        const nativeEventSig = "BoughtWithNative(address,uint256,uint256,uint256)";
        const usdtEventSig = "BoughtWithUSDT(address,uint256,uint256,uint256)";

        // Create filter for both event types
        const filter = {
          address: CONTRACT_ADDRESS,
          fromBlock,
          toBlock: 'latest',
          topics: [
            [ethers.utils.id(nativeEventSig), ethers.utils.id(usdtEventSig)]
          ]
        };

        console.log('Using filter:', filter);

        // Fetch logs
        const logs = await provider.getLogs(filter);
        console.log('Found logs:', logs);

        // Process logs into transactions
        const processedTx: Transaction[] = [];

        for (const log of logs) {
          try {
            const parsedLog = contract.interface.parseLog(log);
            const block = await provider.getBlock(log.blockNumber);
            
            // Check if this event is for our address
            if (parsedLog.args.user.toLowerCase() === userAddress) {
              const isNativeEvent = log.topics[0] === ethers.utils.id(nativeEventSig);
              const tokenDeposit = ethers.utils.formatEther(parsedLog.args.tokenDeposit);
              const amount = ethers.utils.formatEther(parsedLog.args.amount);

              processedTx.push({
                id: `${log.transactionHash}-${log.logIndex}`,
                timestamp: new Date(block.timestamp * 1000).toISOString(),
                type: isNativeEvent ? 'native' : 'usdt',
                amount: tokenDeposit,
                tokenAmount: amount,
                hash: log.transactionHash
              });
            }
          } catch (error) {
            console.error('Error processing log:', error);
          }
        }

        // Sort by timestamp, most recent first
        const sortedTx = processedTx.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        console.log('Processed transactions:', sortedTx);
        setTransactions(sortedTx);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    // Refresh every minute
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
  }, [address, isConnected]);

  const formatCurrency = (value: string) => {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isConnected || !address) {
    return null;
  }

  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center">
          <p className="text-muted-foreground">No transactions found for your address</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">
                  {tx.type === 'native' ? 'ETH Purchase' : 'USDT Purchase'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                </p>
              </div>
              <a
                href={`https://etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                <ArrowSquareOut className="w-5 h-5" />
              </a>
            </div>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Amount:</span>{' '}
                {tx.type === 'native' 
                  ? `${formatCurrency(tx.amount)} ETH`
                  : `$${formatCurrency(tx.amount)}`
                }
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Tokens:</span>{' '}
                {formatCurrency(tx.tokenAmount)} SFI
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
