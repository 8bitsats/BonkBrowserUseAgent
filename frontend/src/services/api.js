// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * API service for interacting with the backend
 */
export const ApiService = {
  /**
   * Check server health
   * @returns {Promise<Object>} Health status
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
  
  /**
   * Check which API keys are configured
   * @returns {Promise<Object>} API key status
   */
  checkApiKeys: async () => {
    try {
      const response = await api.get('/api/auth/status');
      return response.data;
    } catch (error) {
      console.error('API key check failed:', error);
      throw error;
    }
  },
  
  /**
   * Tasks
   */
  tasks: {
    /**
     * Create a new browser task
     * @param {string} task - Task description
     * @param {string} walletAddress - Wallet address
     * @param {Array} allowedDomains - Allowed domains
     * @param {string} llmModel - LLM model to use
     * @returns {Promise<Object>} Task creation result
     */
    create: async (task, walletAddress, allowedDomains = [], llmModel = 'gpt-4o') => {
      try {
        const response = await api.post('/api/tasks', {
          task,
          walletAddress,
          allowedDomains,
          llmModel
        });
        return response.data;
      } catch (error) {
        console.error('Task creation failed:', error);
        throw error;
      }
    },
    
    /**
     * Get task details
     * @param {string} taskId - Task ID
     * @returns {Promise<Object>} Task details
     */
    get: async (taskId) => {
      try {
        const response = await api.get(`/api/tasks/${taskId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get task ${taskId}:`, error);
        throw error;
      }
    },
    
    /**
     * Get task status
     * @param {string} taskId - Task ID
     * @returns {Promise<string>} Task status
     */
    getStatus: async (taskId) => {
      try {
        const response = await api.get(`/api/tasks/${taskId}/status`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get task status ${taskId}:`, error);
        throw error;
      }
    },
    
    /**
     * Get task screenshots
     * @param {string} taskId - Task ID
     * @returns {Promise<Object>} Screenshots data
     */
    getScreenshots: async (taskId) => {
      try {
        const response = await api.get(`/api/tasks/${taskId}/screenshots`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get task screenshots ${taskId}:`, error);
        throw error;
      }
    },
    
    /**
     * Pause a task
     * @param {string} taskId - Task ID
     * @returns {Promise<Object>} Pause result
     */
    pause: async (taskId) => {
      try {
        const response = await api.put(`/api/tasks/${taskId}/pause`);
        return response.data;
      } catch (error) {
        console.error(`Failed to pause task ${taskId}:`, error);
        throw error;
      }
    },
    
    /**
     * Resume a task
     * @param {string} taskId - Task ID
     * @returns {Promise<Object>} Resume result
     */
    resume: async (taskId) => {
      try {
        const response = await api.put(`/api/tasks/${taskId}/resume`);
        return response.data;
      } catch (error) {
        console.error(`Failed to resume task ${taskId}:`, error);
        throw error;
      }
    },
    
    /**
     * Stop a task
     * @param {string} taskId - Task ID
     * @returns {Promise<Object>} Stop result
     */
    stop: async (taskId) => {
      try {
        const response = await api.put(`/api/tasks/${taskId}/stop`);
        return response.data;
      } catch (error) {
        console.error(`Failed to stop task ${taskId}:`, error);
        throw error;
      }
    }
  },
  
  /**
   * Steel
   */
  steel: {
    /**
     * Create a new browser session
     * @param {boolean} useProxy - Whether to use a proxy
     * @param {boolean} solveCaptcha - Whether to solve captchas
     * @returns {Promise<Object>} Session creation result
     */
    createSession: async (useProxy = true, solveCaptcha = true) => {
      try {
        const response = await api.post('/api/steel/sessions', {
          useProxy,
          solveCaptcha
        });
        return response.data;
      } catch (error) {
        console.error('Steel session creation failed:', error);
        throw error;
      }
    },
    
    /**
     * Get all active sessions
     * @returns {Promise<Array>} Active sessions
     */
    getSessions: async () => {
      try {
        const response = await api.get('/api/steel/sessions');
        return response.data;
      } catch (error) {
        console.error('Failed to get Steel sessions:', error);
        throw error;
      }
    },
    
    /**
     * Get a specific session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Session details
     */
    getSession: async (sessionId) => {
      try {
        const response = await api.get(`/api/steel/sessions/${sessionId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get Steel session ${sessionId}:`, error);
        throw error;
      }
    },
    
    /**
     * Release a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Release result
     */
    releaseSession: async (sessionId) => {
      try {
        const response = await api.delete(`/api/steel/sessions/${sessionId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to release Steel session ${sessionId}:`, error);
        throw error;
      }
    }
  },
  
  /**
   * Solana
   */
  solana: {
    /**
     * Get SOL balance
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Balance info
     */
    getSolBalance: async (walletAddress) => {
      try {
        const response = await api.get(`/api/solana/balance/${walletAddress}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get SOL balance for ${walletAddress}:`, error);
        throw error;
      }
    },
    
    /**
     * Get token accounts
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Token accounts
     */
    getTokenAccounts: async (walletAddress) => {
      try {
        const response = await api.get(`/api/solana/tokens/${walletAddress}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get token accounts for ${walletAddress}:`, error);
        throw error;
      }
    },
    
    /**
     * Get empty token accounts
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} Empty token accounts
     */
    getEmptyAccounts: async (walletAddress) => {
      try {
        const response = await api.get(`/api/solana/empty-accounts/${walletAddress}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get empty token accounts for ${walletAddress}:`, error);
        throw error;
      }
    },
    
    /**
     * Get BONK token balance
     * @param {string} walletAddress - Wallet address
     * @returns {Promise<Object>} BONK balance
     */
    getBonkBalance: async (walletAddress) => {
      try {
        const response = await api.get(`/api/solana/bonk/${walletAddress}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get BONK balance for ${walletAddress}:`, error);
        throw error;
      }
    }
  },
  
  /**
   * Browserbase
   */
  browserbase: {
    /**
     * Create a new browserbase session
     * @param {Object} options - Session configuration options
     * @returns {Promise<Object>} Session creation result
     */
    createSession: async (options = {}) => {
      try {
        const response = await api.post('/api/browserbase/sessions', options);
        return response.data;
      } catch (error) {
        console.error('Browserbase session creation failed:', error);
        throw error;
      }
    },
    
    /**
     * Get debug links for a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Debug links
     */
    getDebugLinks: async (sessionId) => {
      try {
        const response = await api.get(`/api/browserbase/sessions/${sessionId}/debug`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get debug links for session ${sessionId}:`, error);
        throw error;
      }
    },
    
    /**
     * Get recording for a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Recording data
     */
    getRecording: async (sessionId) => {
      try {
        const response = await api.get(`/api/browserbase/sessions/${sessionId}/recording`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get recording for session ${sessionId}:`, error);
        throw error;
      }
    },
    
    /**
     * Get logs for a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Array>} Session logs
     */
    getLogs: async (sessionId) => {
      try {
        const response = await api.get(`/api/browserbase/sessions/${sessionId}/logs`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get logs for session ${sessionId}:`, error);
        throw error;
      }
    },
    
    /**
     * Close a session
     * @param {string} sessionId - Session ID
     * @returns {Promise<Object>} Close result
     */
    closeSession: async (sessionId) => {
      try {
        const response = await api.delete(`/api/browserbase/sessions/${sessionId}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to close session ${sessionId}:`, error);
        throw error;
      }
    },
    
    /**
     * Execute a BONK task with Stagehand
     * @param {string} task - Task description
     * @param {Object} options - Task options
     * @returns {Promise<Object>} Task result
     */
    executeTask: async (task, options = {}) => {
      try {
        const response = await api.post('/api/browserbase/tasks', { task, options });
        return response.data;
      } catch (error) {
        console.error('Failed to execute BONK task:', error);
        throw error;
      }
    }
  }
};

export default ApiService;