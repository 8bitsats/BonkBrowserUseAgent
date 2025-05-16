// src/App.jsx
import React, { useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// Custom components
import BrowserbaseSessionViewer from './components/browserbasesessionviewer';
import { ControlPanel } from './components/controlpanel';
import { TaskHistory } from './components/taskhistory';
import { WalletOverview } from './components/walletoverview';
import { StagehandAgentView } from './components/stagehandagentview';
import { Header } from './components/header';
import { Footer } from './components/footer';

// Context providers
import { AgentProvider } from './context/AgentContext';
import { ThemeProvider } from './context/ThemeContext';

// API service
import ApiService from './services/api';

function App() {
  // Set network to 'mainnet-beta' for production
  const network = WalletAdapterNetwork.MainnetBeta;
  const endpoint = process.env.REACT_APP_RPC_URL || clusterApiUrl(network);
  
  // Initialize wallet adapters for common Solana wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ];

  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serverStatus, setServerStatus] = useState('checking');
  const [apiKeys, setApiKeys] = useState({});
  
  // Check server status and API keys on load
  useEffect(() => {
    const checkServer = async () => {
      try {
        await ApiService.checkHealth();
        setServerStatus('online');
        
        // Check API keys
        const keysStatus = await ApiService.checkApiKeys();
        setApiKeys(keysStatus.keysConfigured || {});
      } catch (error) {
        console.error('Server check failed:', error);
        setServerStatus('offline');
      }
    };
    
    checkServer();
  }, []);

  return (
    <ThemeProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <AgentProvider>
              <div className="app-container min-h-screen flex flex-col bg-gray-900 text-white">
                <Header />
                
                {serverStatus === 'offline' ? (
                  <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-900 text-white p-6 rounded-lg">
                      <h2 className="text-xl font-bold mb-2">Backend Server Unavailable</h2>
                      <p className="mb-4">
                        The BONK Browser Agent backend server is currently offline. Please check your server configuration and API keys.
                      </p>
                      <div className="bg-red-800 p-4 rounded">
                        <p className="font-mono text-sm">
                          Make sure your backend server is running at: {process.env.REACT_APP_API_URL || 'http://localhost:4000'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="container mx-auto px-4 py-8 flex-grow">
                    {/* API Key Warnings */}
                    {Object.keys(apiKeys).length > 0 && (
                      <>
                        {!apiKeys.browserUse && !apiKeys.browserbase && (
                          <div className="bg-yellow-900 text-yellow-300 p-4 rounded-lg mb-4">
                            <strong>Warning:</strong> Neither Browser Use API key nor Browserbase API key is configured. At least one is required for browser automation.
                          </div>
                        )}
                        
                        {!apiKeys.openai && !apiKeys.anthropic && (
                          <div className="bg-yellow-900 text-yellow-300 p-4 rounded-lg mb-4">
                            <strong>Warning:</strong> Neither OpenAI nor Anthropic API key is configured. AI capabilities will be limited.
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Navigation Tabs */}
                    <div className="tabs flex border-b border-gray-700 mb-6">
                      <button 
                        className={`tab px-4 py-2 ${activeTab === 'dashboard' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('dashboard')}
                      >
                        Dashboard
                      </button>
                      <button 
                        className={`tab px-4 py-2 ${activeTab === 'agent' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('agent')}
                      >
                        Bonki Agent
                      </button>
                      <button 
                        className={`tab px-4 py-2 ${activeTab === 'stagehand' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('stagehand')}
                      >
                        Stagehand AI
                      </button>
                      <button 
                        className={`tab px-4 py-2 ${activeTab === 'wallet' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('wallet')}
                      >
                        Wallet
                      </button>
                      <button 
                        className={`tab px-4 py-2 ${activeTab === 'history' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('history')}
                      >
                        History
                      </button>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="tab-content">
                      {activeTab === 'dashboard' && (
                        <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-2">
                            <h2 className="text-2xl font-bold mb-4">BONK Browser Agent Dashboard</h2>
                            <p className="text-gray-400 mb-6">
                              Control your Bonki or Stagehand agent to automate Solana tasks, optimize token accounts, and more!
                            </p>
                          </div>
                          
                          <div className="quick-actions bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                className="action-button bg-orange-600 hover:bg-orange-700 rounded-lg p-4 flex flex-col items-center justify-center"
                                onClick={() => {
                                  setActiveTab('wallet');
                                }}
                              >
                                <span className="icon text-2xl mb-2">🔍</span>
                                <span className="text-sm">Analyze Wallet</span>
                              </button>
                              <button 
                                className="action-button bg-blue-600 hover:bg-blue-700 rounded-lg p-4 flex flex-col items-center justify-center"
                                onClick={() => {
                                  setActiveTab('stagehand');
                                }}
                              >
                                <span className="icon text-2xl mb-2">🧹</span>
                                <span className="text-sm">Clean Token Accounts</span>
                              </button>
                              <button 
                                className="action-button bg-purple-600 hover:bg-purple-700 rounded-lg p-4 flex flex-col items-center justify-center"
                                onClick={() => {
                                  setActiveTab('stagehand');
                                }}
                              >
                                <span className="icon text-2xl mb-2">🔥</span>
                                <span className="text-sm">Burn BONK</span>
                              </button>
                              <button 
                                className="action-button bg-green-600 hover:bg-green-700 rounded-lg p-4 flex flex-col items-center justify-center"
                                onClick={() => {
                                  setActiveTab('stagehand');
                                }}
                              >
                                <span className="icon text-2xl mb-2">🚀</span>
                                <span className="text-sm">Launch Token</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="stats bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Agent Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="stat p-4 bg-gray-700 rounded-lg">
                                <div className="stat-title text-sm text-gray-400">Tasks Completed</div>
                                <div className="stat-value text-xl font-bold">24</div>
                              </div>
                              <div className="stat p-4 bg-gray-700 rounded-lg">
                                <div className="stat-title text-sm text-gray-400">SOL Saved</div>
                                <div className="stat-value text-xl font-bold">3.42</div>
                              </div>
                              <div className="stat p-4 bg-gray-700 rounded-lg">
                                <div className="stat-title text-sm text-gray-400">BONK Burned</div>
                                <div className="stat-value text-xl font-bold">1.2B</div>
                              </div>
                              <div className="stat p-4 bg-gray-700 rounded-lg">
                                <div className="stat-title text-sm text-gray-400">Tokens Created</div>
                                <div className="stat-value text-xl font-bold">3</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="agent-options col-span-2 bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Choose Your Agent</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div 
                                className="agent-card bg-gray-700 p-5 rounded-lg hover:bg-gray-600 cursor-pointer flex flex-col items-center"
                                onClick={() => setActiveTab('agent')}
                              >
                                <div className="avatar text-5xl mb-3">🤖</div>
                                <h4 className="text-lg font-semibold mb-2">Bonki Agent</h4>
                                <p className="text-sm text-gray-400 text-center">
                                  Classic browser automation with API-based controls for specific tasks.
                                </p>
                                {apiKeys.browserUse ? (
                                  <span className="mt-3 px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">
                                    Available
                                  </span>
                                ) : (
                                  <span className="mt-3 px-2 py-1 bg-red-900 text-red-300 rounded-full text-xs">
                                    API Key Required
                                  </span>
                                )}
                              </div>
                              
                              <div 
                                className="agent-card bg-gray-700 p-5 rounded-lg hover:bg-gray-600 cursor-pointer flex flex-col items-center"
                                onClick={() => setActiveTab('stagehand')}
                              >
                                <div className="avatar text-5xl mb-3">🧠</div>
                                <h4 className="text-lg font-semibold mb-2">Stagehand AI</h4>
                                <p className="text-sm text-gray-400 text-center">
                                  Advanced AI-powered browsing for natural language tasks.
                                </p>
                                {apiKeys.browserbase && (apiKeys.openai || apiKeys.anthropic) ? (
                                  <span className="mt-3 px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">
                                    Available
                                  </span>
                                ) : (
                                  <span className="mt-3 px-2 py-1 bg-red-900 text-red-300 rounded-full text-xs">
                                    API Keys Required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="recent-tasks col-span-2 bg-gray-800 rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
                            <div className="task-list space-y-3">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="task flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                  <div>
                                    <div className="task-name font-medium">Token Account Cleanup</div>
                                    <div className="task-time text-sm text-gray-400">2 hours ago</div>
                                  </div>
                                  <div className="task-status bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">
                                    Completed
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 text-center">
                              <button 
                                className="text-orange-500 hover:text-orange-400 text-sm"
                                onClick={() => setActiveTab('history')}
                              >
                                View All Task History
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'agent' && (
                        <div className="agent-view">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                              <BrowserbaseSessionViewer />
                            </div>
                            <div className="lg:col-span-1">
                              <ControlPanel />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'stagehand' && (
                        <StagehandAgentView />
                      )}
                      
                      {activeTab === 'wallet' && <WalletOverview />}
                      
                      {activeTab === 'history' && <TaskHistory />}
                    </div>
                  </div>
                )}
                
                <Footer />
              </div>
            </AgentProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;