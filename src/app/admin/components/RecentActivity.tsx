'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TokenPurchaseEvent, getTokenPurchaseEvents } from '@/lib/contractEvents';
import { formatDistanceToNow } from 'date-fns';
import { Coins, ExternalLink, RefreshCcw } from 'lucide-react';

export function RecentActivity() {
  const [events, setEvents] = useState<TokenPurchaseEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsRefreshing(true);
      const events = await getTokenPurchaseEvents();
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount: number, type: 'native' | 'usdt') => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: type === 'native' ? 4 : 2,
      maximumFractionDigits: type === 'native' ? 4 : 2
    });
  };

  const formatTokenAmount = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <button
          onClick={fetchEvents}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background/50 border border-border/50 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center
                    ${event.type === 'native' 
                      ? 'bg-blue-500/10 text-blue-500' 
                      : 'bg-green-500/10 text-green-500'}`}
                  >
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {event.type === 'native' ? 'ETH' : 'USDT'} Purchase
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(event.timestamp * 1000, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.buyer.slice(0, 6)}...{event.buyer.slice(-4)} bought{' '}
                      <span className="text-foreground font-medium">
                        {formatTokenAmount(event.tokenAmount)} NXS
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Amount: {formatAmount(event.amount, event.type)}{' '}
                      {event.type === 'native' ? 'ETH' : 'USDT'}
                    </p>
                  </div>
                </div>
                <a
                  href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL}/tx/${event.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No purchase events found
          </div>
        )}
      </div>
    </div>
  );
}
