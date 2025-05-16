// src/components/StagehandControlPanel.jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ApiService } from '../services/api';

// SVG icons
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"></path>
  </svg>
);

/**
 * Component for controlling Stagehand AI browser automation
 */
export const StagehandControlPanel = ({ onTaskComplete }) => {
  const { publicKey } = useWallet();
  
  const [taskInput, setTaskInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [useAnthropicModel, setUseAnthropicModel] = useState(false);
  const [startUrl, setStartUrl] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Example predefined tasks
  const predefinedTasks = [
    { label: "Clean Token Accounts", value: "Scan my wallet for empty token accounts and close them to recover SOL", url: "https://solscan.io" },
    { label: "Find BONK Stats", value: "Go to Birdeye.so and check the latest market data for BONK token", url: "https://birdeye.so" },
    { label: "Launch Token", value: "Go to letsbonk.fun and help me launch a new token", url: "https://letsbonk.fun" },
    { label: "Analyze Wallet", value: "Analyze my wallet tokens and provide recommendations", url: "https://solscan.io" }
  ];
  
  const selectPredefinedTask = (task, url) => {
    setTaskInput(task);
    setStartUrl(url);
  };
  
  const handleStartTask = async () => {
    if (!taskInput.trim()) {
      return setError('Please enter a task description');
    }
    
    if (!publicKey) {
      return setError('Please connect your wallet first');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Build task options
      const options = {
        modelName: useAnthropicModel ? 'claude-3-5-sonnet-latest' : selectedModel,
        useAnthropicModel,
        startUrl: startUrl || undefined,
        metadata: {
          wallet: publicKey.toString(),
          userAgent: 'BONK Browser Agent'
        }
      };
      
      // Execute the task
      const result = await ApiService.browserbase.executeTask(taskInput, options);
      
      // Notify parent component of task completion with results
      if (onTaskComplete) {
        onTaskComplete(result);
      }
    } catch (err) {
      console.error('Error executing Stagehand task:', err);
      setError(err.response?.data?.error || 'Failed to execute task');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="stagehand-control-panel bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <BrainIcon className="mr-2" />
        Stagehand AI Controls
      </h3>
      
      {error && (
        <div className="error-message bg-red-900 text-red-300 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">What would you like Stagehand to do?</label>
        <textarea 
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
          rows="3"
          placeholder="Describe your task in detail, e.g., 'Go to letsbonk.fun and find the best way to launch a token'"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Starting URL (optional)</label>
        <input 
          type="url"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
          placeholder="https://solscan.io"
          value={startUrl}
          onChange={(e) => setStartUrl(e.target.value)}
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Quick Tasks:</label>
        <div className="grid grid-cols-1 gap-2">
          {predefinedTasks.map((task, index) => (
            <button 
              key={index}
              className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-sm"
              onClick={() => selectPredefinedTask(task.value, task.url)}
            >
              {task.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <button 
          className="text-sm text-orange-500 hover:text-orange-400 flex items-center"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          {isAdvancedOpen ? '▼' : '►'} Advanced Options
        </button>
        
        {isAdvancedOpen && (
          <div className="mt-2 p-3 bg-gray-700 rounded">
            <div className="mb-3">
              <label className="block text-gray-300 mb-2">AI Model</label>
              <select 
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={useAnthropicModel}
              >
                <option value="gpt-4o">GPT-4o (Default)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
              </select>
            </div>
            
            <div className="flex items-center mb-3">
              <input 
                type="checkbox"
                id="use-anthropic"
                className="mr-2"
                checked={useAnthropicModel}
                onChange={(e) => setUseAnthropicModel(e.target.checked)}
              />
              <label htmlFor="use-anthropic" className="text-gray-300">Use Claude 3.5 Sonnet</label>
            </div>
          </div>
        )}
      </div>
      
      <button 
        className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium flex items-center justify-center"
        onClick={handleStartTask}
        disabled={!publicKey || isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Starting...
          </>
        ) : (
          <>
            <PlayIcon className="mr-2" />
            Start Stagehand AI
          </>
        )}
      </button>
    </div>
  );
};

export default StagehandControlPanel;