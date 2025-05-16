// src/services/steelService.js
const axios = require('axios');

const STEEL_API_KEY = process.env.STEEL_API_KEY;
const STEEL_API_URL = 'https://api.steel.dev';

/**
 * Service for interacting with the Steel API
 */
class SteelService {
  /**
   * Create a new browser session
   * @param {boolean} useProxy - Whether to use a proxy
   * @param {boolean} solveCaptcha - Whether to enable captcha solving
   * @returns {Promise<Object>} Session creation result
   */
  static async createSession(useProxy = true, solveCaptcha = true) {
    try {
      const response = await axios.post(
        `${STEEL_API_URL}/sessions`,
        {
          use_proxy: useProxy,
          solve_captcha: solveCaptcha
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': STEEL_API_KEY
          }
        }
      );
      
      // Add CDP URL for browser connection
      const session = response.data;
      session.cdp_url = `wss://connect.steel.dev?apiKey=${STEEL_API_KEY}&sessionId=${session.id}`;
      
      return session;
    } catch (error) {
      console.error('Error creating Steel session:', error);
      throw error;
    }
  }
  
  /**
   * Release a browser session
   * @param {string} sessionId - ID of the session to release
   * @returns {Promise<boolean>} Success status
   */
  static async releaseSession(sessionId) {
    try {
      await axios.delete(
        `${STEEL_API_URL}/sessions/${sessionId}`,
        {
          headers: { 'X-API-Key': STEEL_API_KEY }
        }
      );
      
      return true;
    } catch (error) {
      console.error(`Error releasing Steel session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all active sessions
   * @returns {Promise<Array>} List of active sessions
   */
  static async getSessions() {
    try {
      const response = await axios.get(
        `${STEEL_API_URL}/sessions`,
        {
          headers: { 'X-API-Key': STEEL_API_KEY }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting Steel sessions:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific session by ID
   * @param {string} sessionId - ID of the session
   * @returns {Promise<Object>} Session details
   */
  static async getSession(sessionId) {
    try {
      const response = await axios.get(
        `${STEEL_API_URL}/sessions/${sessionId}`,
        {
          headers: { 'X-API-Key': STEEL_API_KEY }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error getting Steel session ${sessionId}:`, error);
      throw error;
    }
  }
}

module.exports = SteelService;