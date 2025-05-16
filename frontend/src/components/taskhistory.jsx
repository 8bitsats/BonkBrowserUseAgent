// src/components/TaskHistory.jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ApiService } from '../services/api';

export const TaskHistory = () => {
  const { publicKey } = useWallet();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // For demonstration purposes, we'll use mock data
  // In a real app, you would fetch this from your backend
  useEffect(() => {
    if (!publicKey) return;
    
    setIsLoading(true);
    
    // Simulated API call
    setTimeout(() => {
      // Mock data
      const mockTasks = [
        {
          id: 'task-1',
          description: 'Clean empty token accounts',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: 'completed',
          output: 'Successfully closed 5 empty token accounts, recovering 0.01 SOL',
          steps: 12,
          duration: '3m 24s'
        },
        {
          id: 'task-2',
          description: 'Check BONK price on Birdeye',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          status: 'completed',
          output: 'BONK price: $0.000014, 24h change: +5.2%, Volume: $12.3M',
          steps: 8,
          duration: '2m 10s'
        },
        {
          id: 'task-3',
          description: 'Launch new token on letsbonk.fun',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          status: 'failed',
          output: 'Task failed: Wallet connection timed out',
          steps: 4,
          duration: '1m 32s'
        },
        {
          id: 'task-4',
          description: 'Analyze wallet tokens',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          status: 'completed',
          output: 'Found 15 tokens, 7 empty accounts, potential 0.014 SOL recovery',
          steps: 10,
          duration: '2m 55s'
        },
        {
          id: 'task-5',
          description: 'Trade BONK for SOL on Jupiter',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          status: 'completed',
          output: 'Successfully traded 1.2M BONK for 0.05 SOL',
          steps: 15,
          duration: '4m 12s'
        }
      ];
      
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
  }, [publicKey]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Calculate time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    return `${diffDay} days ago`;
  };
  
  if (!publicKey) {
    return (
      <div className="wallet-connect-prompt flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg">
        <div className="text-6xl mb-4">📜</div>
        <h2 className="text-xl font-semibold mb-4">Connect your wallet to view task history</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Connect your Solana wallet to view your previous Bonki agent tasks and their results.
        </p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div className="task-history">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Task History</h2>
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900 text-red-300 p-3 rounded mb-4">
            Error loading task history: {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No task history found. Start your first Bonki task to see it here.
          </div>
        ) : (
          <div className="tasks-list space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-gray-700 rounded-lg p-4 ${
                  task.status === 'completed' ? 'border-l-4 border-green-500' :
                  task.status === 'failed' ? 'border-l-4 border-red-500' :
                  ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="task-info">
                    <h3 className="font-medium">{task.description}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <span className="mr-3">{formatDate(task.timestamp)}</span>
                      <span>({timeAgo(task.timestamp)})</span>
                    </div>
                  </div>
                  <div className={`status-badge px-2 py-1 rounded-full text-xs ${
                    task.status === 'completed' ? 'bg-green-900 text-green-300' :
                    task.status === 'failed' ? 'bg-red-900 text-red-300' :
                    task.status === 'running' ? 'bg-blue-900 text-blue-300' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </div>
                </div>
                
                <div className="output-section bg-gray-800 p-3 rounded text-sm mb-3">
                  {task.output}
                </div>
                
                <div className="task-meta flex justify-between text-xs text-gray-400">
                  <div>Steps: {task.steps}</div>
                  <div>Duration: {task.duration}</div>
                  <div>ID: {task.id}</div>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
                    Rerun Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
