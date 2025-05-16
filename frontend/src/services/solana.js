// src/services/solana.js
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Create connection to Solana
const connection = new Connection(
  process.env.REACT_APP_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

// BONK token address
export const BONK_TOKEN_ADDRESS = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263';

/**
 * Service for Solana-related operations
 */
export const SolanaService = {
  /**
   * Get SOL balance
   * @param {PublicKey} publicKey - Wallet public key
   * @returns {Promise<number>} SOL balance
   */
  getSolBalance: async (publicKey) => {
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting SOL balance:', error);
      throw error;
    }
  },
  
  /**
   * Get token accounts
   * @param {PublicKey} publicKey - Wallet public key
   * @returns {Promise<Array>} Token accounts
   */
  getTokenAccounts: async (publicKey) => {
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );
      
      return tokenAccounts.value.map(({ pubkey, account }) => {
        const { mint, owner, tokenAmount } = account.data.parsed.info;
        
        return {
          address: pubkey.toString(),
          mint,
          owner: owner.toString(),
          amount: tokenAmount.uiAmount,
          decimals: tokenAmount.decimals,
          uiAmountString: tokenAmount.uiAmountString
        };
      });
    } catch (error) {
      console.error('Error getting token accounts:', error);
      throw error;
    }
  },
  
  /**
   * Get empty token accounts
   * @param {PublicKey} publicKey - Wallet public key
   * @returns {Promise<Array>} Empty token accounts
   */
  getEmptyAccounts: async (publicKey) => {
    try {
      const allAccounts = await SolanaService.getTokenAccounts(publicKey);
      return allAccounts.filter(account => account.amount === 0);
    } catch (error) {
      console.error('Error getting empty token accounts:', error);
      throw error;
    }
  },
  
  /**
   * Get BONK token balance
   * @param {PublicKey} publicKey - Wallet public key
   * @returns {Promise<number>} BONK balance
   */
  getBonkBalance: async (publicKey) => {
    try {
      const allAccounts = await SolanaService.getTokenAccounts(publicKey);
      
      const bonkAccount = allAccounts.find(
        account => account.mint === BONK_TOKEN_ADDRESS
      );
      
      return bonkAccount ? bonkAccount.amount : 0;
    } catch (error) {
      console.error('Error getting BONK balance:', error);
      throw error;
    }
  },
  
  /**
   * Estimate reclaimable SOL
   * @param {PublicKey} publicKey - Wallet public key
   * @returns {Promise<number>} Reclaimable SOL
   */
  estimateReclaimableSol: async (publicKey) => {
    try {
      const emptyAccounts = await SolanaService.getEmptyAccounts(publicKey);
      return emptyAccounts.length * 0.002; // Each account reclaims ~0.002 SOL
    } catch (error) {
      console.error('Error estimating reclaimable SOL:', error);
      throw error;
    }
  }
};

export default SolanaService;
