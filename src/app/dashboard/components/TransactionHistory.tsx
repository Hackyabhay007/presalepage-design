'use client';

import { ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  type: 'buy' | 'transfer';
  tokenSymbol: string;
  amount: number;
  price: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  network: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Transaction History</h3>
        <button className="text-sm text-accent hover:text-accent/80">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            whileHover={{ scale: 1.01 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4
              hover:border-accent/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${tx.type === 'buy' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  {tx.type === 'buy' 
                    ? <ArrowDownRight className="w-5 h-5" />
                    : <ArrowUpRight className="w-5 h-5" />
                  }
                </div>
                <div>
                  <p className="font-medium">
                    {tx.type === 'buy' ? 'Bought' : 'Transferred'} {tx.tokenSymbol}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{tx.network}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {tx.timestamp}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium">
                  {tx.amount.toLocaleString()} {tx.tokenSymbol}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${(tx.amount * tx.price).toLocaleString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full
                  ${tx.status === 'completed' 
                    ? 'bg-green-500/10 text-green-500' 
                    : tx.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
