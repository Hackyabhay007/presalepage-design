import { ethers } from 'ethers';

const PRESALE_ABI = [
  "event BuyWithNative(address indexed buyer, uint256 amount, uint256 tokenAmount)",
  "event BuyWithUSDT(address indexed buyer, uint256 amount, uint256 tokenAmount)"
];

const PRESALE_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

export interface TokenPurchaseEvent {
  id: string;
  type: 'native' | 'usdt';
  buyer: string;
  amount: number;
  tokenAmount: number;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
}

export async function getTokenPurchaseEvents(
  startBlock: number = 0,
  endBlock: number | 'latest' = 'latest'
): Promise<TokenPurchaseEvent[]> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(PRESALE_ADDRESS!, PRESALE_ABI, provider);

    // Fetch both types of events
    const [nativeEvents, usdtEvents] = await Promise.all([
      contract.queryFilter(contract.filters.BuyWithNative(), startBlock, endBlock),
      contract.queryFilter(contract.filters.BuyWithUSDT(), startBlock, endBlock)
    ]);

    // Process native token purchases
    const nativePurchases = await Promise.all(
      nativeEvents.map(async (event) => {
        const block = await event.getBlock();
        return {
          id: `${event.transactionHash}-${event.logIndex}`,
          type: 'native' as const,
          buyer: event.args!.buyer,
          amount: parseFloat(ethers.utils.formatEther(event.args!.amount)),
          tokenAmount: parseFloat(ethers.utils.formatUnits(event.args!.tokenAmount, 18)),
          timestamp: block.timestamp,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        };
      })
    );

    // Process USDT purchases
    const usdtPurchases = await Promise.all(
      usdtEvents.map(async (event) => {
        const block = await event.getBlock();
        return {
          id: `${event.transactionHash}-${event.logIndex}`,
          type: 'usdt' as const,
          buyer: event.args!.buyer,
          amount: parseFloat(ethers.utils.formatUnits(event.args!.amount, 6)),
          tokenAmount: parseFloat(ethers.utils.formatUnits(event.args!.tokenAmount, 18)),
          timestamp: block.timestamp,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        };
      })
    );

    // Combine and sort all events by timestamp (newest first)
    return [...nativePurchases, ...usdtPurchases]
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching token purchase events:', error);
    return [];
  }
}
