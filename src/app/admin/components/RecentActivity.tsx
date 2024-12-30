'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Coins, RefreshCcw } from 'lucide-react';
import { UserDeposit, getUserDeposits } from '@/lib/supabase';

export function RecentActivity() {
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDeposits = async () => {
    try {
      setIsRefreshing(true);
      const deposits = await getUserDeposits();
      setDeposits(deposits);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchDeposits, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount: number) => {
    return Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Deposits</h2>
        <button
          onClick={fetchDeposits}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {deposits.length > 0 ? (
          deposits.map((deposit) => (
            <motion.div
              key={deposit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background/50 border border-border/50 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate max-w-[200px]">
                        {deposit.address}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(deposit.last_updated), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 space-y-1">
                      <p>Native: <span className="text-foreground">{formatAmount(deposit.total_native_deposit)} ETH</span></p>
                      <p>USDT: <span className="text-foreground">{formatAmount(deposit.total_usdt_deposit)} USDT</span></p>
                      <p>Tokens: <span className="text-foreground">{formatAmount(deposit.total_token_amount)} NXS</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No deposits found
          </div>
        )}
      </div>
    </div>
  );
}
