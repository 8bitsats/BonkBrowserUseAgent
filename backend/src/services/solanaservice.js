// src/services/solanaService.js
const { Connection, PublicKey } = require('@solana/web3.js');

// Token Program ID for SPL tokens
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// BONK token address
const BONK_TOKEN_ADDRESS = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');

/**
 * Service for interacting with the Solana blockchain
 */
class SolanaService {
  constructor(rpcUrl) {
    this.connection = new Connection(rpcUrl || process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com', 'confirmed');
  }
  
  /**
   * Get SOL balance for a wallet
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<number>} SOL balance
   */
  async getSolBalance(walletAddress) {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error(`Error getting SOL balance for ${walletAddress}:`, error);
      throw error;
    }
  }
  
  /**
   * Get token accounts for a wallet
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Array>} Token accounts
   */
  async getTokenAccounts(walletAddress) {
    try {
      const publicKey = new PublicKey(walletAddress);
      
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );
      
      // Format token accounts for the frontend
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
      console.error(`Error getting token accounts for ${walletAddress}:`, error);
      throw error;
    }
  }
  
  /**
   * Find empty token accounts (zero balance)
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Array>} Empty token accounts
   */
  async getEmptyTokenAccounts(walletAddress) {
    try {
      const allAccounts = await this.getTokenAccounts(walletAddress);
      
      // Filter accounts with zero balance
      return allAccounts.filter(account => account.amount === 0);
    } catch (error) {
      console.error(`Error getting empty token accounts for ${walletAddress}:`, error);
      throw error;
    }
  }
  
  /**
   * Get BONK token balance for a wallet
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<number>} BONK balance
   */
  async getBonkBalance(walletAddress) {
    try {
      const allAccounts = await this.getTokenAccounts(walletAddress);
      
      // Find BONK token account
      const bonkAccount = allAccounts.find(
        account => account.mint === BONK_TOKEN_ADDRESS.toString()
      );
      
      return bonkAccount ? bonkAccount.amount : 0;
    } catch (error) {
      console.error(`Error getting BONK balance for ${walletAddress}:`, error);
      throw error;
    }
  }
  
  /**
   * Estimate SOL that can be reclaimed by closing empty accounts
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<number>} Estimated SOL amount
   */
  async estimateReclaimableSol(walletAddress) {
    try {
      const emptyAccounts = await this.getEmptyTokenAccounts(walletAddress);
      
      // Each empty account reclaims about 0.002 SOL (2,039,280 lamports)
      return emptyAccounts.length * 0.002;
    } catch (error) {
      console.error(`Error estimating reclaimable SOL for ${walletAddress}:`, error);
      throw error;
    }
  }
}

module.exports = SolanaService;
