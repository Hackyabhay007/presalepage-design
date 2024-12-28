// components/layout/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Wallet,
  ChevronDown,
  ExternalLink,
  Copy,
  LogOut,
  Shield,
} from "lucide-react";

// Rainbow components imports
//import { ConnectButton } from "@rainbow-me/rainbowkit";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (
        event: string,
        callback: (accounts: string[]) => void
      ) => void;
    };
  }
}

export function Header() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Handle account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsWalletConnected(false);
          setWalletAddress("");
        } else {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setIsDropdownOpen(false);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const viewOnEtherscan = () => {
    window.open(`https://etherscan.io/address/${walletAddress}`, "_blank");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient Border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      {/* Header Content */}
      <div className="bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <motion.div
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className=" flex items-center justify-center"
                >
                  <Image
                    src="https://springfi.org/_next/static/media/Logo.4ffd2ef6.svg"
                    alt="SpringFi Logo"
                    width={120} // Increased from 100
                    height={120} // Increased from 40
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Wallet Section */}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </header>
  );
}
