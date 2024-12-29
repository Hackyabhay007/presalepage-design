import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface TransactionDocument {
  _id: ObjectId;
  address: string;
  totalNativeDeposit: number;
  totalUsdtDeposit: number;
  totalTokenAmount: number;
  lastUpdated: Date;
}

interface FormattedTransaction {
  id: string;
  type: 'buy' | 'transfer';
  tokenSymbol: string;
  amount: number;
  price: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  network: string;
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
    
    const transactions = await db
      .collection<TransactionDocument>('transactions')
      .find({ address: address })
      .sort({ lastUpdated: -1 })
      .toArray();

    // Transform the data to match our frontend Transaction interface
    const formattedTransactions: FormattedTransaction[] = transactions.map((tx: TransactionDocument) => ({
      id: tx._id.toString(),
      type: tx.totalNativeDeposit > 0 ? 'buy' : 'transfer',
      tokenSymbol: 'NXS', // Your token symbol
      amount: tx.totalTokenAmount,
      price: tx.totalNativeDeposit > 0 
        ? tx.totalNativeDeposit / tx.totalTokenAmount 
        : tx.totalUsdtDeposit / tx.totalTokenAmount,
      timestamp: new Date(tx.lastUpdated).toLocaleString(),
      status: 'completed',
      network: tx.totalNativeDeposit > 0 ? 'Ethereum' : 'BSC',
    }));

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
