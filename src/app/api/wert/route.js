import { signSmartContractData } from '@wert-io/widget-sc-signer';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { address, ethAmount } = await req.json();
        
        if (!address || !ethAmount) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const privateKey = process.env.NEXT_PUBLIC_WERT_PRIVATE_KEY;
        const contractAddress = process.env.NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS;

        // Format the function call data
        const functionSignature ='0x138aa4de';// '0x9dae76ea';  // WertBuyWithNative function selector
        
        // Pad the address to 32 bytes (64 characters)
        const paddedAddress = address.toLowerCase().slice(2).padStart(64, '0');
        
        // Convert ethAmount to wei and pad to 32 bytes
        const amountInWei = (parseFloat(ethAmount) * 1e18).toString(16);
        const paddedAmount = amountInWei.padStart(64, '0');
        
        // Add extra parameter (0 for no extra data)
        const paddedExtra = '0'.padStart(64, '0');
        
        // Combine all parts of the input data
        const encodedData = `${functionSignature}${paddedAddress}${paddedAmount}${paddedExtra}`;

        console.log('Creating signed data with params:', {
            address: address.toLowerCase(),
            commodity: 'ETH',
            network: 'sepolia',
            commodity_amount: parseFloat(ethAmount),
            sc_address: contractAddress?.toLowerCase(),
            sc_input_data: encodedData,
        });

        const signedData = signSmartContractData(
            {
                address: address.toLowerCase(),
                commodity: 'ETH',
                network: 'sepolia',
                commodity_amount: parseFloat(ethAmount),
                sc_address: contractAddress?.toLowerCase(),
                sc_input_data: encodedData,
            },
            privateKey
        );

        console.log('Generated signed data:', signedData);
        console.log('Encoded contract data:', encodedData);

        return NextResponse.json(signedData);
    } catch (error) {
        console.error('Error generating signed data:', error);
        return NextResponse.json(
            { error: 'Failed to generate signed data', details: error.message },
            { status: 500 }
        );
    }
}
