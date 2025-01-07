'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer/';

const BuywithCard = ({ onSuccess }) => {
    const { address, isConnected } = useAccount();
    const [ethAmount, setEthAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.Buffer = Buffer;
        }
    }, []);

    const handleBuyWithCard = async () => {
        if (!isConnected || !ethAmount || loading) return;
        
        try {
            setError('');
            setLoading(true);
            
            // Get signed data from API
            const response = await fetch('/api/wert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address,
                    ethAmount: parseFloat(ethAmount),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to get signed data');
            }

            const signedData = await response.json();
            console.log('Signed data:', signedData);

            const otherWidgetOptions = {
                partner_id: '01JGKNQ2NVBRQ0YBQWFX7TPJQD',
                click_id: uuidv4(),
                origin: 'https://sandbox.wert.io',
                width: 440,
                height: 595,
                theme: 'dark',
                currency: 'USD',
                commodities: ['ETH'],
                listeners: {
                    loaded: () => {
                        console.log('Widget loaded');
                        setLoading(false);
                    },
                    'payment-status': (status) => {
                        console.log('Payment status:', status);
                        if (status === 'success' && onSuccess) {
                            onSuccess();
                            setEthAmount('');
                        }
                    },
                    error: (error) => {
                        console.error('Wert widget error:', error);
                        setError(error.message || 'Widget error occurred');
                        setLoading(false);
                    },
                    'payment-error': (error) => {
                        console.error('Payment error:', error);
                        setError(error.message || 'Payment error occurred');
                        setLoading(false);
                    }
                },
            };

            console.log('Widget options:', { ...signedData, ...otherWidgetOptions });

            const wertWidget = new WertWidget({
                ...signedData,
                ...otherWidgetOptions,
            });

            wertWidget.open();
        } catch (error) {
            console.error('Error initializing Wert widget:', error);
            setError(error.message || 'Failed to initialize widget');
            setLoading(false);
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
            setEthAmount(value);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-xs">
                <input
                    type="number"
                    value={ethAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter ETH amount"
                    className="w-full p-2 text-black text-lg border border-gray-300 rounded"
                    min="0.001"
                    step="0.001"
                    disabled={!isConnected || loading}
                />
            </div>
            {error && (
                <div className="w-full max-w-xs text-red-500 text-sm">
                    {error}
                </div>
            )}
            <button
                onClick={handleBuyWithCard}
                disabled={!isConnected || !ethAmount || loading}
                className={`w-full max-w-xs p-2 rounded font-bold ${
                    isConnected && ethAmount && !loading
                    ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
            >
                {!isConnected 
                    ? 'Connect Wallet to Buy' 
                    : loading 
                    ? 'Loading...' 
                    : !ethAmount 
                    ? 'Enter Amount' 
                    : 'Buy with Card'}
            </button>
        </div>
    );
};

export default BuywithCard;
