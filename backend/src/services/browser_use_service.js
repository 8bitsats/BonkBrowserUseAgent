const axios = require('axios');

const BROWSER_USE_API_KEY = process.env.BROWSER_USE_API_KEY;
const BROWSER_USE_API_URL = 'https://api.browser-use.com/api/v1';

/**
 * Service for interacting with the Browser Use API
 */
class BrowserUseService {
  /**
   * Create a new browser automation task
   * @param {string} task - Description of what the agent should do
   * @param {Array} allowedDomains - List of domains the agent can visit
   * @param {Object} secrets - Secret variables for the task
   * @param {string} structuredOutputJson - JSON schema for structured output
   * @param {string} llmModel - The LLM model to use for the task
   * @returns {Promise<Object>} Task creation result with ID
   */
  static async createTask(task, allowedDomains = [], secrets = {}, structuredOutputJson = null, llmModel = 'gpt-4o') {
    try {
      const response = await axios.post(
        `${BROWSER_USE_API_URL}/run-task`,
        {
          task,
          allowed_domains: allowedDomains,
          secrets,
          structured_output_json: structuredOutputJson,
          llm_model: llmModel,
          use_adblock: true,
          use_proxy: true,
          highlight_elements: true,
          save_browser_data: true
        },
        {
          headers: {
            'Authorization': `Bearer ${BROWSER_USE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating browser task:', error);
      throw error;
    }
  }
  
  /**
   * Get task details
   * @param {string} taskId - ID of the task
   * @returns {Promise<Object>} Task details
   */
  static async getTask(taskId) {
    try {
      const response = await axios.get(
        `${BROWSER_USE_API_URL}/task/${taskId}`,
        {
          headers: { 'Authorization': `Bearer ${BROWSER_USE_API_KEY}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error getting task ${taskId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get task status
   * @param {string} taskId - ID of the task
   * @returns {Promise<string>} Task status
   */
  static async getTaskStatus(taskId) {
    try {
      const response = await axios.get(
        `${BROWSER_USE_API_URL}/task/${taskId}/status`,
        {
          headers: { 'Authorization': `Bearer ${BROWSER_USE_API_KEY}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error getting task status ${taskId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get task screenshots
   * @param {string} taskId - ID of the task
   * @returns {Promise<Object>} Screenshots data
   */
  static async getTaskScreenshots(taskId) {
    try {
      const response = await axios.get(
        `${BROWSER_USE_API_URL}/task/${taskId}/screenshots`,
        {
          headers: { 'Authorization': `Bearer ${BROWSER_USE_API_KEY}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error getting task screenshots ${taskId}:`, error);
      throw error;
    }
  }
  
  /**
   * Pause a running task
   * @param {string} taskId - ID of the task
   * @returns {Promise<Object>} Pause result
   */
  static async pauseTask(taskId) {
    try {
      const response = await axios.put(
        `${BROWSER_USE_API_URL}/pause-task?task_id=${taskId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${BROWSER_USE_API_KEY}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error pausing task ${taskId}:`, error);
      throw error;
    }
  }
  
  /**
   * Resume a paused task
   * @param {string} taskId - ID of the task
   * @returns {Promise<Object>} Resume result
   */
  static async resumeTask(taskId) {
    try {
      const response = await axios.put(
        `${BROWSER_USE_API_URL}/resume-task?task_id=${taskId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${BROWSER_USE_API_KEY}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error resuming task ${taskId}:`, error);
      throw error;
    }
  }
  
  /**
   * Stop a task
   * @param {string} taskId - ID of the task
   * @returns {Promise<Object>} Stop result
   */
  static async stopTask(taskId) {
    try {
      const response = await axios.put(
        `${BROWSER_USE_API_URL}/stop-task?task_id=${taskId}`,
        {},
        {
          headers: { 'Authorization': `Bearer ${BROWSER_USE_API_KEY}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error stopping task ${taskId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get information about the current API key
   * @returns {Promise<Object>} API key information
   */
  static async getAuthInfo() {
    try {
      const response = await axios.get(
        `${BROWSER_USE_API_URL}/auth/me`,
        {
          headers: { 'Authorization': `Bearer ${BROWSER_USE_API_KEY}` }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting auth info:', error);
      throw error;
    }
  }
}

module.exports = BrowserUseService;