// src/hooks/useWalletTokens.js
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaService } from '../services/solana';

/**
 * Custom hook for fetching wallet token data
 * @returns {Object} Wallet token data and loading state
 */
export const useWalletTokens = () => {
  const { publicKey } = useWallet();
  
  const [solBalance, setSolBalance] = useState(0);
  const [bonkBalance, setBonkBalance] = useState(0);
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const [emptyAccounts, setEmptyAccounts] = useState([]);
  const [reclaimableSol, setReclaimableSol] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch wallet data when public key changes
  useEffect(() => {
    if (!publicKey) {
      // Reset state when wallet disconnects
      setSolBalance(0);
      setBonkBalance(0);
      setTokenAccounts([]);
      setEmptyAccounts([]);
      setReclaimableSol(0);
      setError(null);
      return;
    }
    
    const fetchWalletData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch SOL balance
        const balance = await SolanaService.getSolBalance(publicKey);
        setSolBalance(balance);
        
        // Fetch token accounts
        const accounts = await SolanaService.getTokenAccounts(publicKey);
        setTokenAccounts(accounts);
        
        // Fetch BONK balance
        const bonk = await SolanaService.getBonkBalance(publicKey);
        setBonkBalance(bonk);
        
        // Fetch empty accounts and reclaimable SOL
        const empty = await SolanaService.getEmptyAccounts(publicKey);
        setEmptyAccounts(empty);
        setReclaimableSol(empty.length * 0.002);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
    
    // Set up refresh interval
    const intervalId = setInterval(fetchWalletData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [publicKey]);
  
  // Function to manually refresh data
  const refreshData = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch SOL balance
      const balance = await SolanaService.getSolBalance(publicKey);
      setSolBalance(balance);
      
      // Fetch token accounts
      const accounts = await SolanaService.getTokenAccounts(publicKey);
      setTokenAccounts(accounts);
      
      // Fetch BONK balance
      const bonk = await SolanaService.getBonkBalance(publicKey);
      setBonkBalance(bonk);
      
      // Fetch empty accounts and reclaimable SOL
      const empty = await SolanaService.getEmptyAccounts(publicKey);
      setEmptyAccounts(empty);
      setReclaimableSol(empty.length * 0.002);
    } catch (err) {
      console.error('Error refreshing wallet data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    solBalance,
    bonkBalance,
    tokenAccounts,
    emptyAccounts,
    reclaimableSol,
    isLoading,
    error,
    refreshData
  };
};

export default useWalletTokens;
