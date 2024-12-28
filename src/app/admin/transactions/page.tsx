// app/(admin)/admin/transactions/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  RefreshCcw,
  CreditCard,
  Wallet
} from 'lucide-react';
import { TransactionDetailsModal } from './TransactionDetailsModal';

// Transaction types and interfaces
type PaymentMethod = 'wert' | 'wallet';
type TransactionStatus = 'pending' | 'successful' | 'failed';

interface Transaction {
  id: string;
  date: string;
  userWallet: string;
  paymentMethod: PaymentMethod;
  fiatAmount: number;
  cryptoAmount: number;
  cryptoType: string;
  status: TransactionStatus;
  tokenPrice: number;
  network: string;
  wertData?: {
    signatureValid: boolean;
    orderId: string;
    commodityAmount: number;
  };
}

// Mock data - Replace with your API calls
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX123456',
    date: '2024-01-26T10:30:00',
    userWallet: '0x1234...5678',
    paymentMethod: 'wert',
    fiatAmount: 1000,
    cryptoAmount: 0.5,
    cryptoType: 'ETH',
    status: 'successful',
    tokenPrice: 2000,
    network: 'Ethereum',
    wertData: {
      signatureValid: true,
      orderId: 'WERT123',
      commodityAmount: 0.5
    }
  },
  {
    id: 'TX123457',
    date: '2024-01-26T11:30:00',
    userWallet: '0x5678...9012',
    paymentMethod: 'wallet',
    fiatAmount: 500,
    cryptoAmount: 0.25,
    cryptoType: 'BNB',
    status: 'pending',
    tokenPrice: 2000,
    network: 'BSC'
  },
  // Add more mock transactions
];

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    paymentMethod: '' as PaymentMethod | '',
    status: '' as TransactionStatus | '',
    network: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication check
  useEffect(() => {
    const auth = localStorage.getItem('adminSession');
    if (!auth) {
      router.push('/admin/login');
    }
  }, [router]);

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const searchMatch = 
      tx.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      tx.userWallet.toLowerCase().includes(filters.search.toLowerCase());
    
    const methodMatch = !filters.paymentMethod || tx.paymentMethod === filters.paymentMethod;
    const statusMatch = !filters.status || tx.status === filters.status;
    const networkMatch = !filters.network || tx.network === filters.network;
    
    const dateMatch = !filters.dateRange.start || !filters.dateRange.end || (
      new Date(tx.date) >= new Date(filters.dateRange.start) &&
      new Date(tx.date) <= new Date(filters.dateRange.end)
    );

    return searchMatch && methodMatch && statusMatch && networkMatch && dateMatch;
  });

  // Refresh transactions
  const refreshTransactions = async () => {
    setIsLoading(true);
    try {
      // Replace with your API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // setTransactions(await fetchTransactions());
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Export transactions
  const exportTransactions = () => {
    const csv = [
      ['ID', 'Date', 'Wallet', 'Method', 'Amount (Fiat)', 'Amount (Crypto)', 'Type', 'Status', 'Network'],
      ...filteredTransactions.map(tx => [
        tx.id,
        new Date(tx.date).toLocaleString(),
        tx.userWallet,
        tx.paymentMethod,
        tx.fiatAmount,
        tx.cryptoAmount,
        tx.cryptoType,
        tx.status,
        tx.network
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by TX ID or wallet..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-background border 
              border-border/50 rounded-lg focus:outline-none 
              focus:border-accent/50"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 
            -translate-y-1/2 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 rounded-lg hover:bg-accent/10 relative"
          >
            <Filter className="w-5 h-5" />
            {Object.values(filters).some(v => 
              v && typeof v === 'string' && v.length > 0
            ) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 
                bg-accent rounded-full" />
            )}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={refreshTransactions}
            className={`p-2 rounded-lg hover:bg-accent/10 
              ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCcw className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={exportTransactions}
            className="p-2 rounded-lg hover:bg-accent/10"
          >
            <Download className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Filters Panel */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 
            p-4 bg-card border border-border/50 rounded-lg"
        >
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                paymentMethod: e.target.value as PaymentMethod
              }))}
              className="mt-1 w-full p-2 bg-background border 
                border-border/50 rounded-lg"
            >
              <option value="">All Methods</option>
              <option value="wert">Wert (Card)</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                status: e.target.value as TransactionStatus
              }))}
              className="mt-1 w-full p-2 bg-background border 
                border-border/50 rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Network</label>
            <select
              value={filters.network}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                network: e.target.value
              }))}
              className="mt-1 w-full p-2 bg-background border 
                border-border/50 rounded-lg"
            >
              <option value="">All Networks</option>
              <option value="Ethereum">Ethereum</option>
              <option value="BSC">BSC</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2 mt-1">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="flex-1 p-2 bg-background border 
                  border-border/50 rounded-lg"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="flex-1 p-2 bg-background border 
                  border-border/50 rounded-lg"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Transactions Table */}
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Wallet</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Method</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Network</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTransactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-accent/5 cursor-pointer"
                  onClick={() => {
                    setSelectedTransaction(tx)
                  }}
                >
                  <td className="px-6 py-4 text-sm font-medium">{tx.id}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(tx.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">
                    {tx.userWallet}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {tx.paymentMethod === 'wert' ? (
                        <CreditCard className="w-4 h-4 mr-2 text-accent" />
                      ) : (
                        <Wallet className="w-4 h-4 mr-2 text-accent" />
                      )}
                      <span className="text-sm capitalize">
                        {tx.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p>${tx.fiatAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.cryptoAmount} {tx.cryptoType}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{tx.network}</td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${tx.status === 'successful' 
                        ? 'bg-green-500/10 text-green-500' 
                        : tx.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-red-500/10 text-red-500'
                      }
                    `}>
                      {tx.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {selectedTransaction && (
  <TransactionDetailsModal
    transaction={selectedTransaction}
    onClose={() => setSelectedTransaction(null)}
  />
)}
        </div>
      </div>
    </motion.div>
  );
}
