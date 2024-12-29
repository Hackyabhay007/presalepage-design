import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

interface SalesStats {
  totalSalesUSD: number;
  activeUsers: number;
  conversionRate: number;
  netRevenue: number;
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get all transactions
    const transactions = await db
      .collection('transactions')
      .find({})
      .toArray();

    // Calculate total sales in USD
    const totalSalesUSD = transactions.reduce((total, tx) => {
      if (tx.totalNativeDeposit) {
        // For ETH transactions, convert to USD using current ETH price
        // Replace this with your actual ETH price
        const ETH_PRICE_USD = 2200; // You should get this from an oracle or API
        return total + (tx.totalNativeDeposit * ETH_PRICE_USD);
      } else {
        // For USDT transactions, add directly
        return total + tx.totalUsdtDeposit;
      }
    }, 0);

    // Get unique buyers (active users)
    const uniqueBuyers = new Set(transactions.map(tx => tx.address));
    const activeUsers = uniqueBuyers.size;

    // Calculate conversion rate (if you have total visitors data)
    // For now, we'll use a placeholder
    const conversionRate = (activeUsers / 1000) * 100; // Assuming 1000 total visitors

    // Net revenue (you might want to adjust this calculation based on your needs)
    const netRevenue = totalSalesUSD * 0.95; // Assuming 5% fees/costs

    const stats: SalesStats = {
      totalSalesUSD,
      activeUsers,
      conversionRate,
      netRevenue
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
