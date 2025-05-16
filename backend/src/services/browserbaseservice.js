// src/services/browserbaseService.js
const { Browserbase } = require('@browserbasehq/sdk');
const { Stagehand } = require('@browserbasehq/stagehand');
const { chromium } = require('playwright-core');
const { z } = require('zod');

/**
 * Service for interacting with Browserbase and Stagehand
 */
class BrowserbaseService {
  constructor() {
    this.browserbase = new Browserbase({ 
      apiKey: process.env.BROWSERBASE_API_KEY 
    });
    
    this.defaultViewport = {
      width: 1920,
      height: 1080
    };
  }
  
  /**
   * Create a Browserbase session
   * @param {object} options - Session configuration options
   * @returns {Promise<object>} Session creation result
   */
  async createSession(options = {}) {
    try {
      const session = await this.browserbase.sessions.create({
        projectId: process.env.BROWSERBASE_PROJECT_ID,
        browserSettings: {
          viewport: options.viewport || this.defaultViewport,
          fingerprint: {
            devices: options.devices || ["desktop"],
            locales: options.locales || ["en-US"],
            operatingSystems: options.operatingSystems || ["windows"],
            screen: {
              maxWidth: 1920,
              maxHeight: 1080,
              minWidth: 1024,
              minHeight: 768,
            }
          }
        },
        keepAlive: options.keepAlive || process.env.BROWSERBASE_KEEP_ALIVE === 'true',
        recording: options.recording || process.env.BROWSERBASE_RECORDING === 'true',
        region: options.region || process.env.BROWSERBASE_REGION,
        userMetadata: {
          project: 'BONK Browser Agent',
          task: options.task || 'Generic task',
          ...options.metadata
        }
      });
      
      return session;
    } catch (error) {
      console.error('Error creating Browserbase session:', error);
      throw error;
    }
  }
  
  /**
   * Connect to a Browserbase session with standard Playwright
   * @param {string} sessionId - Session ID to connect to, or null to create new session
   * @param {object} options - Session options if creating new session
   * @returns {Promise<object>} Browser connection and session details
   */
  async connectWithPlaywright(sessionId = null, options = {}) {
    try {
      // Create or get existing session
      const session = sessionId ? 
        await this.browserbase.sessions.get(sessionId) : 
        await this.createSession(options);
      
      // Connect using Playwright
      const browser = await chromium.connectOverCDP(session.connectUrl);
      const defaultContext = browser.contexts()[0];
      const page = defaultContext.pages()[0];
      
      return { browser, context: defaultContext, page, session };
    } catch (error) {
      console.error('Error connecting to Browserbase with Playwright:', error);
      throw error;
    }
  }
  
  /**
   * Initialize Stagehand with Browserbase
   * @param {string} sessionId - Session ID to connect to, or null to create new session
   * @param {object} options - Session and Stagehand options
   * @returns {Promise<object>} Stagehand instance and session
   */
  async createStagehandSession(sessionId = null, options = {}) {
    try {
      // Create or get existing session
      const session = sessionId ? 
        await this.browserbase.sessions.get(sessionId) : 
        await this.createSession(options);
      
      // Initialize Stagehand
      const stagehand = new Stagehand({
        env: "BROWSERBASE",
        apiKey: process.env.BROWSERBASE_API_KEY,
        projectId: process.env.BROWSERBASE_PROJECT_ID,
        modelName: options.modelName || "gpt-4o",
        sessionId: session.id,
        modelClientOptions: {
          apiKey: options.useAnthropicModel ? 
            process.env.ANTHROPIC_API_KEY : 
            process.env.OPENAI_API_KEY,
        },
      });
      
      await stagehand.init();
      
      return { stagehand, session };
    } catch (error) {
      console.error('Error creating Stagehand session:', error);
      throw error;
    }
  }
  
  /**
   * Get debug URLs for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<object>} Session debug links
   */
  async getDebugLinks(sessionId) {
    try {
      const links = await this.browserbase.sessions.debug(sessionId);
      return links;
    } catch (error) {
      console.error(`Error getting debug links for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get session recordings
   * @param {string} sessionId - Session ID
   * @returns {Promise<object>} Session recording data
   */
  async getRecording(sessionId) {
    try {
      const recording = await this.browserbase.sessions.recording.retrieve(sessionId);
      return recording;
    } catch (error) {
      console.error(`Error getting recording for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get session logs
   * @param {string} sessionId - Session ID
   * @returns {Promise<Array>} Session logs
   */
  async getLogs(sessionId) {
    try {
      const logs = await this.browserbase.sessions.logs.list(sessionId);
      return logs;
    } catch (error) {
      console.error(`Error getting logs for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Close a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async closeSession(sessionId) {
    try {
      await this.browserbase.sessions.delete(sessionId);
      return true;
    } catch (error) {
      console.error(`Error closing session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Execute a BONK-related task using Stagehand's AI capabilities
   * @param {string} task - Description of what to do
   * @param {object} options - Configuration options
   * @returns {Promise<object>} Task results
   */
  async executeBonkTask(task, options = {}) {
    // Initialize Stagehand
    const { stagehand, session } = await this.createStagehandSession(null, {
      task,
      modelName: options.modelName || "gpt-4o",
      useAnthropicModel: options.useAnthropicModel || false,
      ...options
    });
    
    try {
      const page = stagehand.page;
      const results = { steps: [], output: null, session };
      
      // Navigate to starting URL
      if (options.startUrl) {
        await page.goto(options.startUrl);
        results.steps.push({
          action: "navigate",
          url: options.startUrl,
          timestamp: new Date().toISOString()
        });
      }
      
      // Execute the task with Stagehand
      if (task.includes('clean') || task.includes('empty account')) {
        // Token account cleanup task
        results.output = await this.handleTokenAccountCleanup(stagehand, results.steps);
      } else if (task.includes('burn') || task.includes('BONK')) {
        // BONK burning task
        results.output = await this.handleBonkBurning(stagehand, results.steps);
      } else if (task.includes('launch') || task.includes('token')) {
        // Token launch task
        results.output = await this.handleTokenLaunch(stagehand, results.steps);
      } else if (task.includes('analyze') || task.includes('wallet')) {
        // Wallet analysis task
        results.output = await this.handleWalletAnalysis(stagehand, results.steps);
      } else {
        // Generic task
        results.output = await this.handleGenericTask(stagehand, task, results.steps);
      }
      
      // Get debugging links
      const debugLinks = await this.getDebugLinks(session.id);
      results.liveUrl = debugLinks.debuggerFullscreenUrl;
      
      return results;
    } catch (error) {
      console.error(`Error executing BONK task with Stagehand:`, error);
      throw error;
    } finally {
      // Always close Stagehand session when done
      await stagehand.close();
    }
  }
  
  /**
   * Handle token account cleanup task
   * @private
   */
  async handleTokenAccountCleanup(stagehand, steps) {
    const page = stagehand.page;
    
    // Go to Solana account dashboard
    await page.goto('https://solscan.io');
    steps.push({
      action: "navigate",
      url: "https://solscan.io",
      timestamp: new Date().toISOString()
    });
    
    // Search for the wallet address
    const suggestions = await page.observe("find the search box and enter a wallet address");
    await page.act(suggestions[0]);
    steps.push({
      action: "search",
      details: "Searching for wallet address",
      timestamp: new Date().toISOString()
    });
    
    // Check for empty token accounts
    const emptyAccounts = await page.extract({
      instruction: "Find information about empty token accounts that could be closed to reclaim SOL",
      schema: z.object({
        emptyAccountsCount: z.number().optional(),
        reclaimableSol: z.string().optional(),
        accountDetails: z.array(z.object({
          tokenMint: z.string().optional(),
          tokenName: z.string().optional()
        })).optional()
      })
    });
    
    steps.push({
      action: "extract",
      details: "Extracted empty account information",
      data: emptyAccounts,
      timestamp: new Date().toISOString()
    });
    
    // Get or visit phantom wallet to clean accounts if requested
    if (steps.length > 0) {
      const suggestions = await page.observe("look for a way to connect a wallet or clean token accounts");
      await page.act(suggestions[0]);
      steps.push({
        action: "connect",
        details: "Attempting to connect wallet",
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      message: `Found ${emptyAccounts.emptyAccountsCount || 'several'} empty token accounts that could be closed to reclaim approximately ${emptyAccounts.reclaimableSol || '0.002 SOL per account'}`,
      accountsFound: emptyAccounts,
      recommendedAction: "Connect your wallet through the Bonk Browser Agent interface to clean these accounts"
    };
  }
  
  /**
   * Handle BONK burning task
   * @private
   */
  async handleBonkBurning(stagehand, steps) {
    const page = stagehand.page;
    
    // Go to bonkbutton.com
    await page.goto('https://bonkbutton.com');
    steps.push({
      action: "navigate",
      url: "https://bonkbutton.com",
      timestamp: new Date().toISOString()
    });
    
    // Extract information about the BONK burning mechanism
    const burnInfo = await page.extract({
      instruction: "Find information about how to burn BONK tokens and what happens when they are burned",
      schema: z.object({
        burnButtonText: z.string().optional(),
        burnMechanics: z.string().optional(),
        totalBurned: z.string().optional(),
        burnImpact: z.string().optional()
      })
    });
    
    steps.push({
      action: "extract",
      details: "Extracted BONK burning information",
      data: burnInfo,
      timestamp: new Date().toISOString()
    });
    
    // Look for wallet connection or burning options
    const suggestions = await page.observe("find a way to connect a wallet or burn BONK tokens");
    await page.act(suggestions[0]);
    steps.push({
      action: "interact",
      details: "Exploring BONK burning options",
      timestamp: new Date().toISOString()
    });
    
    return {
      message: "Found BONK burning mechanism through bonkbutton.com",
      burnInfo,
      recommendedAction: "Connect your wallet through the Bonk Browser Agent interface to burn BONK tokens"
    };
  }
  
  /**
   * Handle token launch task
   * @private
   */
  async handleTokenLaunch(stagehand, steps) {
    const page = stagehand.page;
    
    // Go to letsbonk.fun
    await page.goto('https://letsbonk.fun');
    steps.push({
      action: "navigate",
      url: "https://letsbonk.fun",
      timestamp: new Date().toISOString()
    });
    
    // Extract information about token creation
    const tokenInfo = await page.extract({
      instruction: "Find information about how to create or launch a new token on this platform",
      schema: z.object({
        launchProcess: z.string().optional(),
        requiredFields: z.array(z.string()).optional(),
        fees: z.string().optional(),
        recommendations: z.string().optional()
      })
    });
    
    steps.push({
      action: "extract",
      details: "Extracted token launch information",
      data: tokenInfo,
      timestamp: new Date().toISOString()
    });
    
    // Look for token creation interface
    const suggestions = await page.observe("find the token creation interface or launch button");
    await page.act(suggestions[0]);
    steps.push({
      action: "interact",
      details: "Exploring token creation interface",
      timestamp: new Date().toISOString()
    });
    
    return {
      message: "Found token creation interface on letsbonk.fun",
      tokenInfo,
      recommendedAction: "Connect your wallet through the Bonk Browser Agent interface to create a new token"
    };
  }
  
  /**
   * Handle wallet analysis task
   * @private
   */
  async handleWalletAnalysis(stagehand, steps) {
    const page = stagehand.page;
    
    // Go to Solana account dashboard
    await page.goto('https://solscan.io');
    steps.push({
      action: "navigate",
      url: "https://solscan.io",
      timestamp: new Date().toISOString()
    });
    
    // Search for the wallet address
    const suggestions = await page.observe("find the search box and enter a wallet address");
    await page.act(suggestions[0]);
    steps.push({
      action: "search",
      details: "Searching for wallet address",
      timestamp: new Date().toISOString()
    });
    
    // Extract wallet information
    const walletInfo = await page.extract({
      instruction: "Extract key details about this wallet including SOL balance, token holdings, and any notable information",
      schema: z.object({
        solBalance: z.string().optional(),
        tokenCount: z.number().optional(),
        bondedStake: z.string().optional(),
        topTokens: z.array(z.object({
          name: z.string().optional(),
          balance: z.string().optional(),
          value: z.string().optional()
        })).optional(),
        emptyAccountsCount: z.number().optional(),
        recommendations: z.string().optional()
      })
    });
    
    steps.push({
      action: "extract",
      details: "Extracted wallet information",
      data: walletInfo,
      timestamp: new Date().toISOString()
    });
    
    return {
      message: "Completed wallet analysis using Solscan",
      walletInfo,
      recommendedAction: walletInfo.recommendations || "Review your wallet holdings and consider cleaning empty token accounts"
    };
  }
  
  /**
   * Handle a generic task
   * @private
   */
  async handleGenericTask(stagehand, task, steps) {
    const page = stagehand.page;
    
    // First, try to understand what the task is about
    const { taskType, relevantSites } = await page.extract({
      instruction: "Based on this task description, what type of task is it and what websites would be most relevant to complete it?",
      schema: z.object({
        taskType: z.string(),
        relevantSites: z.array(z.string())
      })
    });
    
    steps.push({
      action: "analyze",
      details: "Analyzed task requirements",
      data: { taskType, relevantSites },
      timestamp: new Date().toISOString()
    });
    
    // Go to the most relevant site
    if (relevantSites && relevantSites.length > 0) {
      await page.goto(relevantSites[0]);
      steps.push({
        action: "navigate",
        url: relevantSites[0],
        timestamp: new Date().toISOString()
      });
      
      // Use AI to determine what to do next
      const suggestions = await page.observe(task);
      if (suggestions && suggestions.length > 0) {
        await page.act(suggestions[0]);
        steps.push({
          action: "interact",
          details: suggestions[0],
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Extract any relevant information
    const extractedInfo = await page.extract({
      instruction: "Extract any information relevant to completing this task",
      schema: z.object({
        keyFindings: z.string(),
        actionableSteps: z.array(z.string()).optional(),
        additionalContext: z.string().optional()
      })
    });
    
    steps.push({
      action: "extract",
      details: "Extracted relevant information",
      data: extractedInfo,
      timestamp: new Date().toISOString()
    });
    
    return {
      message: `Completed task exploration: ${taskType}`,
      findings: extractedInfo.keyFindings,
      nextSteps: extractedInfo.actionableSteps || [],
      context: extractedInfo.additionalContext
    };
  }
}

module.exports = BrowserbaseService;