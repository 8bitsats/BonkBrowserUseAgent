// src/components/WalletOverview.jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import useWalletTokens from '../hooks/useWalletTokens';
import { BONK_TOKEN_ADDRESS } from '../services/solana';

// Token logo placeholders
const TokenLogo = ({ symbol }) => {
  // Different background colors based on first letter of symbol
  const colors = {
    'A': 'bg-red-500',
    'B': 'bg-blue-500',
    'C': 'bg-green-500',
    'D': 'bg-yellow-500',
    'E': 'bg-purple-500',
    'F': 'bg-pink-500',
    'G': 'bg-indigo-500',
    'H': 'bg-gray-500',
    'I': 'bg-red-600',
    'J': 'bg-blue-600',
    'K': 'bg-green-600',
    'L': 'bg-yellow-600',
    'M': 'bg-purple-600',
    'N': 'bg-pink-600',
    'O': 'bg-indigo-600',
    'P': 'bg-gray-600',
    'Q': 'bg-red-700',
    'R': 'bg-blue-700',
    'S': 'bg-green-700',
    'T': 'bg-yellow-700',
    'U': 'bg-purple-700',
    'V': 'bg-pink-700',
    'W': 'bg-indigo-700',
    'X': 'bg-gray-700',
    'Y': 'bg-red-800',
    'Z': 'bg-blue-800',
  };
  
  // Use symbol first letter as key, or default to gray
  const firstLetter = symbol ? symbol.charAt(0).toUpperCase() : 'X';
  const bgColor = colors[firstLetter] || 'bg-gray-600';
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
      <span className="text-white font-bold text-sm">
        {symbol ? symbol.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );
};

// Special BONK logo
const BonkLogo = () => (
  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
    <span className="text-white font-bold text-sm">B</span>
  </div>
);

// SOL logo
const SolLogo = () => (
  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
    <span className="text-white font-bold text-sm">◎</span>
  </div>
);

export const WalletOverview = () => {
  const { publicKey } = useWallet();
  const { 
    solBalance, 
    bonkBalance, 
    tokenAccounts, 
    emptyAccounts, 
    reclaimableSol,
    isLoading, 
    error,
    refreshData
  } = useWalletTokens();
  
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter tokens based on active tab
  const filteredTokens = tokenAccounts.filter(token => {
    if (activeTab === 'all') return true;
    if (activeTab === 'empty') return token.amount === 0;
    if (activeTab === 'with-balance') return token.amount > 0;
    return true;
  });
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  };
  
  if (!publicKey) {
    return (
      <div className="wallet-connect-prompt flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-xl font-semibold mb-4">Connect your wallet to view your assets</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Connect your Solana wallet to view your token balances, analyze empty accounts, and perform actions with the BONK Browser Agent.
        </p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div className="wallet-overview">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Summary */}
        <div className="col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Wallet Summary</h2>
            
            <div className="wallet-address bg-gray-700 p-3 rounded-lg mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">Address</div>
              <div className="text-sm font-mono">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </div>
            </div>
            
            <div className="main-balances space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <SolLogo />
                  <div className="ml-3">
                    <div className="font-medium">SOL</div>
                    <div className="text-xs text-gray-400">Solana</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{solBalance.toFixed(4)}</div>
                  <div className="text-xs text-gray-400">≈ ${(solBalance * 120).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <BonkLogo />
                  <div className="ml-3">
                    <div className="font-medium">BONK</div>
                    <div className="text-xs text-gray-400">Bonk Inu</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatNumber(bonkBalance)}</div>
                  <div className="text-xs text-gray-400">≈ ${(bonkBalance * 0.000005).toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div className="account-stats grid grid-cols-2 gap-3">
              <div className="stat bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Token Accounts</div>
                <div className="text-xl font-semibold">{tokenAccounts.length}</div>
              </div>
              
              <div className="stat bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Empty Accounts</div>
                <div className="text-xl font-semibold">{emptyAccounts.length}</div>
              </div>
              
              <div className="stat bg-gray-700 p-3 rounded-lg col-span-2">
                <div className="text-sm text-gray-400">Reclaimable SOL</div>
                <div className="text-xl font-semibold">{reclaimableSol.toFixed(3)} SOL</div>
                <div className="text-xs text-gray-400">
                  ≈ ${(reclaimableSol * 120).toFixed(2)} | From closing empty accounts
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                className="w-full p-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium flex items-center justify-center"
                onClick={() => refreshData()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </span>
                ) : (
                  <span>Refresh Balances</span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Token List */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Token Accounts</h2>
            
            {/* Token filter tabs */}
            <div className="tabs flex border-b border-gray-700 mb-4">
              <button 
                className={`tab px-4 py-2 ${activeTab === 'all' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('all')}
              >
                All ({tokenAccounts.length})
              </button>
              <button 
                className={`tab px-4 py-2 ${activeTab === 'with-balance' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('with-balance')}
              >
                With Balance ({tokenAccounts.filter(t => t.amount > 0).length})
              </button>
              <button 
                className={`tab px-4 py-2 ${activeTab === 'empty' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('empty')}
              >
                Empty ({emptyAccounts.length})
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900 text-red-300 p-3 rounded mb-4">
                Error loading tokens: {error}
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No tokens found matching the selected filter.
              </div>
            ) : (
              <div className="token-list space-y-2 max-h-96 overflow-y-auto pr-2">
                {filteredTokens.map((token, index) => (
                  <div 
                    key={`${token.address}-${index}`} 
                    className={`flex items-center justify-between p-3 rounded-lg ${token.amount === 0 ? 'bg-gray-700 border border-gray-600' : 'bg-gray-700'}`}
                  >
                    <div className="flex items-center">
                      {token.mint === BONK_TOKEN_ADDRESS ? (
                        <BonkLogo />
                      ) : (
                        <TokenLogo symbol={token.mint.slice(0, 1)} />
                      )}
                      <div className="ml-3">
                        <div className="font-medium">
                          {token.mint === BONK_TOKEN_ADDRESS ? 'BONK' : `Token ${index + 1}`}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {token.amount === 0 ? (
                          <span className="text-gray-400">Empty</span>
                        ) : (
                          <span>{formatNumber(token.amount)}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {token.amount === 0 ? (
                          <span>Closeable (0.002 SOL)</span>
                        ) : (
                          <span>Decimal: {token.decimals}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                disabled={!emptyAccounts.length}
              >
                Clean Empty Accounts
              </button>
              <button
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium"
              >
                Export Token List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;
