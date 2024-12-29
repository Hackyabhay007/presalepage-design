'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp,  
  Users, 
  DollarSign, 
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

const StatsCard = ({ title, value, change, trend, icon: Icon }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="p-6 bg-card border border-border/50 rounded-xl"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="p-2 bg-accent/10 rounded-lg">
        <Icon className="w-5 h-5 text-accent" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend === 'up' ? (
        <ArrowUp className="w-4 h-4 text-green-500" />
      ) : (
        <ArrowDown className="w-4 h-4 text-red-500" />
      )}
      <span className={`ml-1 text-sm ${
        trend === 'up' ? 'text-green-500' : 'text-red-500'
      }`}>
        {change}
      </span>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('adminSession');
    if (!auth) {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Sales"
          value="$123,456"
          change="+12.3%"
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Active Users"
          value="1,234"
          change="+5.6%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Conversion Rate"
          value="2.34%"
          change="-1.2%"
          trend="down"
          icon={Activity}
        />
        <StatsCard
          title="Net Revenue"
          value="$45,678"
          change="+8.7%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-background/50 
                  rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex 
                    items-center justify-center">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">New Transaction</p>
                    <p className="text-sm text-muted-foreground">
                      User purchased tokens
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  2 minutes ago
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
