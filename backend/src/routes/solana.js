// src/routes/solana.js
const express = require('express');
const SolanaService = require('../services/solanaService');

const router = express.Router();
const solanaService = new SolanaService();

// Validate wallet address
const validateWalletAddress = (req, res, next) => {
  const { walletAddress } = req.params;
  
  try {
    // This will throw an error if the address is invalid
    new (require('@solana/web3.js')).PublicKey(walletAddress);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid wallet address' });
  }
};

// Get wallet SOL balance
router.get('/balance/:walletAddress', validateWalletAddress, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const balance = await solanaService.getSolBalance(walletAddress);
    res.json({ address: walletAddress, balance });
  } catch (error) {
    console.error(`Error getting SOL balance for ${req.params.walletAddress}:`, error);
    res.status(500).json({ error: 'Failed to get SOL balance' });
  }
});

// Get wallet token accounts
router.get('/tokens/:walletAddress', validateWalletAddress, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const tokens = await solanaService.getTokenAccounts(walletAddress);
    res.json({ address: walletAddress, tokens });
  } catch (error) {
    console.error(`Error getting token accounts for ${req.params.walletAddress}:`, error);
    res.status(500).json({ error: 'Failed to get token accounts' });
  }
});

// Get empty token accounts
router.get('/empty-accounts/:walletAddress', validateWalletAddress, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const emptyAccounts = await solanaService.getEmptyTokenAccounts(walletAddress);
    const reclaimableSol = await solanaService.estimateReclaimableSol(walletAddress);
    
    res.json({ 
      address: walletAddress, 
      emptyAccounts,
      count: emptyAccounts.length,
      reclaimableSol
    });
  } catch (error) {
    console.error(`Error getting empty token accounts for ${req.params.walletAddress}:`, error);
    res.status(500).json({ error: 'Failed to get empty token accounts' });
  }
});

// Get BONK token balance
router.get('/bonk/:walletAddress', validateWalletAddress, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const bonkBalance = await solanaService.getBonkBalance(walletAddress);
    res.json({ address: walletAddress, bonkBalance });
  } catch (error) {
    console.error(`Error getting BONK balance for ${req.params.walletAddress}:`, error);
    res.status(500).json({ error: 'Failed to get BONK balance' });
  }
});

module.exports = router;
