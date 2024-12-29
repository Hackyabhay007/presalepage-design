import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

interface PortfolioData {
  totalValue: number;
  totalTokenAmount: number;
  volume24h: number;
  totalProfit: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get user's transactions
    const transactions = await db
      .collection('transactions')
      .find({ address: address })
      .toArray();

    // Calculate portfolio metrics
    const portfolioData: PortfolioData = transactions.reduce((acc, tx) => {
      // Calculate total token amount
      acc.totalTokenAmount += tx.totalTokenAmount || 0;
      
      // Calculate total value (token amount * current price)
      // Note: Replace 0.000018 with actual current token price from your price feed
      const currentTokenPrice = 0.000018;
      acc.totalValue = acc.totalTokenAmount * currentTokenPrice;
      
      // Calculate profit/loss
      const investedAmount = tx.totalNativeDeposit || tx.totalUsdtDeposit || 0;
      acc.totalProfit = acc.totalValue - investedAmount;

      return acc;
    }, {
      totalValue: 0,
      totalTokenAmount: 0,
      volume24h: 3700000, // Replace with actual 24h volume from your data
      totalProfit: 0
    });

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}
