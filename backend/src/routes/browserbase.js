// src/routes/browserbase.js
const express = require('express');
const BrowserbaseService = require('../services/browserbaseService');

const router = express.Router();
const browserbaseService = new BrowserbaseService();

// Create a new Browserbase session
router.post('/sessions', async (req, res) => {
  try {
    const { viewport, devices, locales, operatingSystems, keepAlive, recording, region, task, metadata } = req.body;
    
    const session = await browserbaseService.createSession({
      viewport,
      devices, 
      locales, 
      operatingSystems,
      keepAlive,
      recording,
      region,
      task,
      metadata
    });
    
    res.json(session);
  } catch (error) {
    console.error('Error creating Browserbase session:', error);
    res.status(500).json({ 
      error: 'Failed to create Browserbase session',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get debug links for a session
router.get('/sessions/:sessionId/debug', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const links = await browserbaseService.getDebugLinks(sessionId);
    res.json(links);
  } catch (error) {
    console.error(`Error getting debug links for session ${req.params.sessionId}:`, error);
    res.status(500).json({ 
      error: 'Failed to get debug links',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get recording for a session
router.get('/sessions/:sessionId/recording', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const recording = await browserbaseService.getRecording(sessionId);
    res.json(recording);
  } catch (error) {
    console.error(`Error getting recording for session ${req.params.sessionId}:`, error);
    res.status(500).json({ 
      error: 'Failed to get recording',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get logs for a session
router.get('/sessions/:sessionId/logs', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const logs = await browserbaseService.getLogs(sessionId);
    res.json(logs);
  } catch (error) {
    console.error(`Error getting logs for session ${req.params.sessionId}:`, error);
    res.status(500).json({ 
      error: 'Failed to get logs',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Delete a session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await browserbaseService.closeSession(sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error closing session ${req.params.sessionId}:`, error);
    res.status(500).json({ 
      error: 'Failed to close session',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Execute a BONK task with Stagehand
router.post('/tasks', async (req, res) => {
  try {
    const { task, options } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task description is required' });
    }
    
    const result = await browserbaseService.executeBonkTask(task, options || {});
    res.json(result);
  } catch (error) {
    console.error('Error executing BONK task:', error);
    res.status(500).json({ 
      error: 'Failed to execute BONK task',
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;