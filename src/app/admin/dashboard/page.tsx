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

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  isLoading?: boolean;
}

const StatsCard = ({ title, value, change, trend, icon: Icon, isLoading }: StatsCardProps) => (
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

interface AdminStats {
  totalSalesUSD: number;
  activeUsers: number;
  conversionRate: number;
  netRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        // Set default values on error
        setStats({
          totalSalesUSD: 0,
          activeUsers: 0,
          conversionRate: 0,
          netRevenue: 0
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor token sales and user activity</p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sales"
            value={isLoading ? "" : formatCurrency(stats?.totalSalesUSD || 0)}
            icon={DollarSign}
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Users"
            value={isLoading ? "" : (stats?.activeUsers || 0).toLocaleString()}
            icon={Users}
            isLoading={isLoading}
          />
          <StatsCard
            title="Conversion Rate"
            value={isLoading ? "" : `${(stats?.conversionRate || 0).toFixed(2)}%`}
            icon={Activity}
            isLoading={isLoading}
          />
          <StatsCard
            title="Net Revenue"
            value={isLoading ? "" : formatCurrency(stats?.netRevenue || 0)}
            icon={TrendingUp}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-8">
          <RecentActivity />
        </div>
      </motion.div>
    </div>
  );
}
