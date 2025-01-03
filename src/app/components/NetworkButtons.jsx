'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const networks = [
  {
    name: 'Ethereum',
    icon: '/eth-logo.png', // Add these images to your public folder
    chainId: '0x1'
  },
  {
    name: 'BSC',
    icon: '/bsc-logo.png',
    chainId: '0x38'
  },
  {
    name: 'Polygon',
    icon: '/polygon-logo.png',
    chainId: '0x89'
  }
];

const NetworkButtons = ({ className }) => {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  const switchNetwork = async (network) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }],
        });
        setSelectedNetwork(network);
      }
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {networks.map((network) => (
        <motion.button
          key={network.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => switchNetwork(network)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg 
            ${selectedNetwork.name === network.name 
              ? 'bg-accent-500/20 border border-accent-500/50' 
              : 'bg-background-elevated/50 hover:bg-accent-500/10 border border-accent-500/20'
            } transition-all duration-200`}
        >
          <Image
            src={network.icon}
            alt={network.name}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm font-medium hidden sm:inline">{network.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default NetworkButtons;
