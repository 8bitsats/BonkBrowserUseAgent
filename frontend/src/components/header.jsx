// src/components/Header.jsx
import React from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from '../context/ThemeContext';

// Simplified version of the DOG logo (BONK)
const BonkLogo = () => (
  <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="#F7931A"/>
    <path d="M68 64C68 62.8954 68.8954 62 70 62H90C102.15 62 112 71.8497 112 84C112 96.1503 102.15 106 90 106H76V128C76 129.105 75.1046 130 74 130H70C68.8954 130 68 129.105 68 128V64Z" fill="white"/>
    <path d="M122 64C122 62.8954 122.895 62 124 62H144C156.15 62 166 71.8497 166 84C166 90.5001 163.147 96.3254 158.625 100C163.147 103.675 166 109.5 166 116C166 128.15 156.15 138 144 138H124C122.895 138 122 137.105 122 136V64Z" fill="white"/>
    <path d="M76 70V98H90C97.732 98 104 91.732 104 84C104 76.268 97.732 70 90 70H76Z" fill="#F7931A"/>
    <path d="M130 70V92H144C151.732 92 158 85.732 158 78C158 70.268 151.732 64 144 64H130V70Z" fill="#F7931A"/>
    <path d="M130 100V130H144C151.732 130 158 123.732 158 116C158 108.268 151.732 102 144 102H130V100Z" fill="#F7931A"/>
  </svg>
);

export const Header = () => {
  const { theme } = useTheme();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  
  return (
    <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BonkLogo />
          <div>
            <h1 className="text-xl font-bold">BONK Browser Agent</h1>
            <p className="text-sm text-gray-400">Automate your Solana tasks with Bonki</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {publicKey && (
            <div className="network-status bg-gray-700 px-3 py-1 rounded-lg flex items-center text-sm">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span>Solana {connection?.rpcEndpoint.includes('devnet') ? 'Devnet' : 'Mainnet'}</span>
            </div>
          )}
          
          <WalletMultiButton className="wallet-button" />
        </div>
      </div>
    </header>
  );
};

export default Header;
