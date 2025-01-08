// components/PaymentSuccessModal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
  tokenAmount: number;
  tokenSymbol: string;
}

export function PaymentSuccessModal({ 
  isOpen,
  onClose,
  transactionHash,
  tokenAmount,
  tokenSymbol
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white rounded-lg p-6 max-w-md w-full space-y-4"
        >
          <div className="flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <h3 className="text-xl font-bold text-center">
            Payment Successful!
          </h3>
          
          <p className="text-center text-gray-600">
            You have successfully purchased {tokenAmount} {tokenSymbol}
          </p>

          <div className="pt-4 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-accent text-white rounded-lg 
                hover:bg-accent/90 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>  
    </AnimatePresence>
  );
}

