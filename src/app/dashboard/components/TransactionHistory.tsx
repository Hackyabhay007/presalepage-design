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
  network: string;
}

const NETWORK_CONFIGS = {
  ethereum: {
    address: "0x8b139E5b4Ad91E26b1c8b1445Ad488c5530EdFDC".toLowerCase(),
    endpoint: process.env.NEXT_PUBLIC_ETH_GRAPHQL_ENDPOINT || "",
    name: "ethereum"
  },
  bsc: {
    address: "0x8b139E5b4Ad91E26b1c8b1445Ad488c5530EdFDC".toLowerCase(), // Replace with BSC address
    endpoint: process.env.NEXT_PUBLIC_BSC_GRAPHQL_ENDPOINT || "",
    name: "bsc"
  },
  polygon: {
    address: "0x8b139E5b4Ad91E26b1c8b1445Ad488c5530EdFDC".toLowerCase(), // Replace with Polygon address
    endpoint: process.env.NEXT_PUBLIC_POLYGON_GRAPHQL_ENDPOINT || "",
    name: "polygon"
  }
};

// GraphQL query for events
const EVENT_QUERY = `
  query GetEvents($contract: String!, $fromBlock: Int!, $toBlock: Int!) {
    logs(
      filter: {
        address: { is: $contract }
        fromBlock: { ge: $fromBlock }
        toBlock: { le: $toBlock }
      }
    ) {
      items {
        data
        topics
        transactionHash
        blockNumber
        logIndex
        blockTimestamp
      }
    }
  }
`;

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<(Transaction & { network: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !address) {
        setIsLoading(false);
        return;
      }

      try {
        const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        setIsLoading(true);
        const allTransactions = await Promise.all(
          Object.entries(NETWORK_CONFIGS).map(async ([networkKey, config]) => {
            try {
              const response = await fetch(config.endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': config.endpoint.split('/').pop() || '',
                },
                body: JSON.stringify({
                  query: EVENT_QUERY,
                  variables: {
                    contract: config.address,
                    fromBlock: thirtyDaysAgo,
                    toBlock: currentTimestamp
                  }
                })
              });

              const data = await response.json();
              const logs = data.data?.logs?.items || [];

              // Event signatures
              const nativeEventSig = ethers.utils.id("BoughtWithNative(address,uint256,uint256,uint256)");
              const usdtEventSig = ethers.utils.id("BoughtWithUSDT(address,uint256,uint256,uint256)");

              return logs
                .filter((log: any) => {
                  const eventSig = log.topics[0];
                  return (eventSig === nativeEventSig || eventSig === usdtEventSig) &&
                         log.topics[1]?.toLowerCase().includes(address.toLowerCase().slice(2));
                })
                .map((log: any) => {
                  const isNative = log.topics[0] === nativeEventSig;
                  const decodedData = ethers.utils.defaultAbiCoder.decode(
                    ['uint256', 'uint256', 'uint256'],
                    log.data
                  );

                  return {
                    id: `${log.transactionHash}-${log.logIndex}`,
                    timestamp: log.blockTimestamp,
                    type: isNative ? 'native' : 'usdt',
                    amount: ethers.utils.formatEther(decodedData[0]),
                    tokenAmount: ethers.utils.formatEther(decodedData[1]),
                    hash: log.transactionHash,
                    network: config.name
                  };
                });
            } catch (error) {
              console.error(`Error fetching from ${networkKey}:`, error);
              return [];
            }
          })
        );

        const combinedTransactions = allTransactions
          .flat()
          .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

        setTransactions(combinedTransactions);
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
                  {tx.type === 'native' ? 'ETH Purchase' : 'USDT Purchase'} on {tx.network}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(tx.timestamp * 1000), { addSuffix: true })}
                </p>
              </div>
              <a
                href={`https://${tx.network === 'ethereum' ? '' : tx.network + '.'}etherscan.io/tx/${tx.hash}`}
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
                {formatCurrency(tx.tokenAmount)} SWG
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
