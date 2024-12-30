import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserDeposit {
  id: number;
  address: string;
  total_native_deposit: number;
  total_usdt_deposit: number;
  total_token_amount: number;
  last_updated: string;
}

export interface DashboardStats {
  totalNativeDeposit: number;
  totalUsdtDeposit: number;
  totalUsdValue: number;
  activeUsers: number;
}

export async function getUserDeposits() {
  const { data, error } = await supabase
    .from('user_deposits')
    .select('*')
    .order('last_updated', { ascending: false });

  if (error) {
    throw error;
  }

  return data as UserDeposit[];
}

async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    // Fallback price if API fails
    return 2200;
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [deposits, ethPrice] = await Promise.all([
    supabase
      .from('user_deposits')
      .select('total_native_deposit, total_usdt_deposit, address')
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
    getEthPrice()
  ]);

  const totalNativeDeposit = deposits.reduce((sum, deposit) => sum + Number(deposit.total_native_deposit), 0);
  const totalUsdtDeposit = deposits.reduce((sum, deposit) => sum + Number(deposit.total_usdt_deposit), 0);
  const totalUsdValue = (totalNativeDeposit * ethPrice) + totalUsdtDeposit;
  const activeUsers = new Set(deposits.map(deposit => deposit.address)).size;

  return {
    totalNativeDeposit,
    totalUsdtDeposit,
    totalUsdValue,
    activeUsers
  };
}
