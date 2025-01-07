'use client'

import { wagmiAdapter, projectId } from '../config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, bsc, polygon } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const metadata = {
  name: 'SwingFi - DeFi Ecosystem',
  description: 'SwingFi: Your Gateway to Decentralized Finance. Trade, Stake, and Earn in a Secure DeFi Ecosystem.',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, bsc,polygon],
  
  defaultNetwork: mainnet,
  metadata,

  enableWalletConnect: true,
  features: {
    send: false,
    swaps: false,
    onramp: false,
    analytics: true,
 
  }
})

export const { open, close, disconnect } = modal

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
