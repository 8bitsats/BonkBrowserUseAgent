// src/components/ControlPanel.jsx
import React, { useState } from 'react';
import { useAgentContext } from '../context/AgentContext';
import { useWallet } from '@solana/wallet-adapter-react';

// Icon components
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export const ControlPanel = () => {
  const { publicKey } = useWallet();
  
  const {
    taskId,
    taskStatus,
    taskProgress,
    taskOutput,
    error,
    isLoading,
    startTask,
    pauseTask,
    resumeTask,
    stopTask,
    resetAgent
  } = useAgentContext();
  
  const [taskInput, setTaskInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  
  // Example predefined tasks
  const predefinedTasks = [
    { label: "Clean Token Accounts", value: "Scan my wallet for empty token accounts and close them to recover SOL" },
    { label: "Find BONK Stats", value: "Go to Birdeye.so and check the latest market data for BONK token" },
    { label: "Launch Token", value: "Go to letsbonk.fun and help me launch a new token" },
    { label: "Analyze Wallet", value: "Analyze my wallet tokens and provide recommendations" }
  ];
  
  const handleStartTask = async () => {
    if (!taskInput.trim()) {
      alert('Please enter a task description');
      return;
    }
    
    // Define allowed domains based on task description
    const allowedDomains = [];
    
    // Examples of adding specific domains based on task content
    if (taskInput.includes('letsbonk.fun') || taskInput.includes('launch token')) {
      allowedDomains.push('letsbonk.fun');
    }
    
    if (taskInput.includes('birdeye') || taskInput.includes('price') || taskInput.includes('stats')) {
      allowedDomains.push('birdeye.so');
      allowedDomains.push('dexscreener.com');
    }
    
    await startTask(taskInput, allowedDomains, selectedModel);
  };
  
  const selectPredefinedTask = (task) => {
    setTaskInput(task);
  };
  
  return (
    <div className="control-panel bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Agent Control</h3>
      
      {!taskId ? (
        <div className="task-setup">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">What would you like Bonki to do?</label>
            <textarea 
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
              rows="3"
              placeholder="Describe your task in detail, e.g., 'Go to bonkbutton.com and find the best way to burn BONK tokens'"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Model</label>
            <select 
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gpt-4o">GPT-4o (Default)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
              <option value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Quick Tasks:</label>
            <div className="grid grid-cols-1 gap-2">
              {predefinedTasks.map((task, index) => (
                <button 
                  key={index}
                  className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 text-sm"
                  onClick={() => selectPredefinedTask(task.value)}
                >
                  {task.label}
                </button>
              ))}
            </div>
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
                Start Bonki
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="task-controls">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                taskStatus === 'running' ? 'bg-green-900 text-green-300' :
                taskStatus === 'paused' ? 'bg-yellow-900 text-yellow-300' :
                taskStatus === 'completed' ? 'bg-blue-900 text-blue-300' :
                taskStatus === 'failed' ? 'bg-red-900 text-red-300' :
                'bg-gray-700 text-gray-300'
              }`}>
                {taskStatus.charAt(0).toUpperCase() + taskStatus.slice(1)}
              </span>
            </div>
            
            <div className="h-2 w-full bg-gray-700 rounded overflow-hidden">
              <div 
                className="h-full bg-orange-600" 
                style={{ width: `${taskProgress}%` }}
              ></div>
            </div>
            
            <div className="text-right text-xs text-gray-400 mt-1">
              {Math.round(taskProgress)}% Complete
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 mb-4">
            {(taskStatus === 'running' || taskStatus === 'paused') && (
              <div className="grid grid-cols-2 gap-2">
                {taskStatus === 'running' ? (
                  <button 
                    className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white flex items-center justify-center"
                    onClick={pauseTask}
                  >
                    <PauseIcon className="mr-2" />
                    Pause
                  </button>
                ) : (
                  <button 
                    className="p-2 bg-green-600 hover:bg-green-700 rounded text-white flex items-center justify-center"
                    onClick={resumeTask}
                  >
                    <PlayIcon className="mr-2" />
                    Resume
                  </button>
                )}
                
                <button 
                  className="p-2 bg-red-600 hover:bg-red-700 rounded text-white flex items-center justify-center"
                  onClick={stopTask}
                >
                  <StopIcon className="mr-2" />
                  Stop
                </button>
              </div>
            )}
            
            {taskStatus === 'completed' && (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center justify-center"
                  onClick={resetAgent}
                >
                  <RefreshIcon className="mr-2" />
                  New Task
                </button>
                
                <button 
                  className="p-2 bg-green-600 hover:bg-green-700 rounded text-white flex items-center justify-center"
                  disabled={!taskOutput}
                  title={!taskOutput ? 'No output available' : 'Download task results'}
                >
                  <DownloadIcon className="mr-2" />
                  Download
                </button>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-900 text-red-300 p-3 rounded mb-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {taskOutput && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-gray-300">Task Output:</h4>
              <div className="bg-gray-700 p-3 rounded text-sm">
                {taskOutput}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2 text-gray-300">Task Description:</h4>
            <div className="bg-gray-700 p-3 rounded text-sm">
              {taskInput}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
