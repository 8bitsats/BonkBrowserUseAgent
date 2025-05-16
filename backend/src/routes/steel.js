// src/routes/steel.js
const express = require('express');
const SteelService = require('../services/steelService');

const router = express.Router();

// Create new Steel session
router.post('/sessions', async (req, res) => {
  try {
    const { useProxy = true, solveCaptcha = true } = req.body;
    
    const session = await SteelService.createSession(useProxy, solveCaptcha);
    res.json(session);
  } catch (error) {
    console.error('Error creating Steel session:', error);
    res.status(500).json({ 
      error: 'Failed to create Steel session',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get all active sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await SteelService.getSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error getting Steel sessions:', error);
    res.status(500).json({ 
      error: 'Failed to get Steel sessions',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get session by ID
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await SteelService.getSession(sessionId);
    res.json(session);
  } catch (error) {
    console.error(`Error getting Steel session ${req.params.sessionId}:`, error);
    res.status(500).json({ 
      error: 'Failed to get Steel session',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Release session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await SteelService.releaseSession(sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error releasing Steel session ${req.params.sessionId}:`, error);
    res.status(500).json({ 
      error: 'Failed to release Steel session',
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
