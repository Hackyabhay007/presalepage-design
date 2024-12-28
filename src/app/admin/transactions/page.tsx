'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Download } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  {
    id: 'TX123456',
    user: 'user@example.com',
    amount: '$1,234.56',
    status: 'completed',
    date: '2024-01-01'
  },
  // Add more mock data as needed
];

export default function TransactionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('adminSession');
    if (!auth) {
      router.push('/admin/login');
    }
  }, [router]);

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border 
              border-border/50 rounded-lg focus:outline-none 
              focus:border-accent/50"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 
            -translate-y-1/2 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-accent/10">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-accent/10">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent/5">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredTransactions.map((tx, index) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-accent/5"
              >
                <td className="px-6 py-4 text-sm">{tx.id}</td>
                <td className="px-6 py-4 text-sm">{tx.user}</td>
                <td className="px-6 py-4 text-sm">{tx.amount}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${tx.status === 'completed' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{tx.date}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
