'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { RecentActivity } from '../components/RecentActivity';
import { DashboardStats, getDashboardStats } from '@/lib/supabase';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  isLoading?: boolean;
  subtitle?: string;
}

const StatsCard = ({ title, value, change, trend, icon: Icon, isLoading, subtitle }: StatsCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-sm text-muted-foreground">{title}</span>
      <Icon className="w-4 h-4 text-accent" />
    </div>
    {isLoading ? (
      <div className="h-7 bg-accent/10 rounded animate-pulse" />
    ) : (
      <>
        <p className="text-2xl font-bold mb-2">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {change && (
          <div className={`flex items-center text-sm ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </div>
        )}
      </>
    )}
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Set default values on error
        setStats({
          totalNativeDeposit: 0,
          totalUsdtDeposit: 0,
          totalUsdValue: 0,
          activeUsers: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatEth = (value: number) => {
    return `${value.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })} ETH`;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Sales"
          value={formatCurrency(stats?.totalUsdValue || 0)}
          icon={DollarSign}
          isLoading={isLoading}
          subtitle={`${formatEth(stats?.totalNativeDeposit || 0)} + ${formatCurrency(stats?.totalUsdtDeposit || 0)}`}
        />
        
        <StatsCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={Users}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-8">
        <RecentActivity />
      </div>
    </div>
  );
}
