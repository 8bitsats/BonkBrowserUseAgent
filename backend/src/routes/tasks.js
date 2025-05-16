// src/routes/tasks.js
const express = require('express');
const BrowserUseService = require('../services/browser_use_service');

const router = express.Router();

// Default allowed domains for Solana-related tasks
const DEFAULT_ALLOWED_DOMAINS = [
  'solana.com',
  'solscan.io',
  'solflare.com',
  'phantom.app',
  'bonkbutton.com',
  'letsbonk.fun',
  'birdeye.so',
  'dexscreener.com'
];

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { 
      task, 
      walletAddress, 
      allowedDomains = [], 
      structuredOutputJson = null,
      llmModel = 'gpt-4o'
    } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task description is required' });
    }
    
    // Merge default domains with any user-specified domains
    const mergedDomains = [...new Set([...DEFAULT_ALLOWED_DOMAINS, ...allowedDomains])];
    
    // Prepare secrets if wallet address is provided
    const secrets = walletAddress ? { wallet_address: walletAddress } : {};
    
    const result = await BrowserUseService.createTask(
      task,
      mergedDomains,
      secrets,
      structuredOutputJson,
      llmModel
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get task details
router.get('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await BrowserUseService.getTask(taskId);
    res.json(task);
  } catch (error) {
    console.error(`Error getting task ${req.params.taskId}:`, error);
    res.status(500).json({ 
      error: 'Failed to get task',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get task status
router.get('/:taskId/status', async (req, res) => {
  try {
    const { taskId } = req.params;
    const status = await BrowserUseService.getTaskStatus(taskId);
    res.json(status);
  } catch (error) {
    console.error(`Error getting task status ${req.params.taskId}:`, error);
    res.status(500).json({ 
      error: 'Failed to get task status',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Get task screenshots
router.get('/:taskId/screenshots', async (req, res) => {
  try {
    const { taskId } = req.params;
    const screenshots = await BrowserUseService.getTaskScreenshots(taskId);
    res.json(screenshots);
  } catch (error) {
    console.error(`Error getting task screenshots ${req.params.taskId}:`, error);
    res.status(500).json({ 
      error: 'Failed to get task screenshots',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Pause task
router.put('/:taskId/pause', async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await BrowserUseService.pauseTask(taskId);
    res.json(result);
  } catch (error) {
    console.error(`Error pausing task ${req.params.taskId}:`, error);
    res.status(500).json({ 
      error: 'Failed to pause task',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Resume task
router.put('/:taskId/resume', async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await BrowserUseService.resumeTask(taskId);
    res.json(result);
  } catch (error) {
    console.error(`Error resuming task ${req.params.taskId}:`, error);
    res.status(500).json({ 
      error: 'Failed to resume task',
      details: error.response ? error.response.data : error.message
    });
  }
});

// Stop task
router.put('/:taskId/stop', async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await BrowserUseService.stopTask(taskId);
    res.json(result);
  } catch (error) {
    console.error(`Error stopping task ${req.params.taskId}:`, error);
    res.status(500).json({ 
      error: 'Failed to stop task',
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
