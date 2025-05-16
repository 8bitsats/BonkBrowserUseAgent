// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const tasksRoutes = require('./src/routes/tasks');
const steelRoutes = require('./src/routes/steel');
const solanaRoutes = require('./src/routes/solana');
const browserbaseRoutes = require('./src/routes/browserbase');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// API Keys check
const BROWSER_USE_API_KEY = process.env.BROWSER_USE_API_KEY;
const STEEL_API_KEY = process.env.STEEL_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FAL_API_KEY = process.env.FAL_API_KEY;
const XAI_API_KEY = process.env.XAI_API_KEY;
const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;
const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API key status route
app.get('/api/auth/status', (req, res) => {
  // Check which API keys are configured
  const keysConfigured = {
    browserUse: !!BROWSER_USE_API_KEY,
    steel: !!STEEL_API_KEY,
    openai: !!OPENAI_API_KEY,
    fal: !!FAL_API_KEY,
    xai: !!XAI_API_KEY,
    browserbase: !!(BROWSERBASE_API_KEY && BROWSERBASE_PROJECT_ID),
    anthropic: !!ANTHROPIC_API_KEY
  };
  
  res.json({ keysConfigured });
});

// Mount routes
app.use('/api/tasks', tasksRoutes);
app.use('/api/steel', steelRoutes);
app.use('/api/solana', solanaRoutes);
app.use('/api/browserbase', browserbaseRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    message: err.message 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  
  // Log available API keys (not the actual keys, just which ones are configured)
  console.log('API Keys Configured:');
  console.log(`- Browser Use API: ${!!BROWSER_USE_API_KEY}`);
  console.log(`- Steel API: ${!!STEEL_API_KEY}`);
  console.log(`- OpenAI API: ${!!OPENAI_API_KEY}`);
  console.log(`- FAL API: ${!!FAL_API_KEY}`);
  console.log(`- XAI API: ${!!XAI_API_KEY}`);
  console.log(`- Browserbase API: ${!!(BROWSERBASE_API_KEY && BROWSERBASE_PROJECT_ID)}`);
  console.log(`- Anthropic API: ${!!ANTHROPIC_API_KEY}`);
});