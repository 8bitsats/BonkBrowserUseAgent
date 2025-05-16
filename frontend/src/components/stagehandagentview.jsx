// src/components/StagehandAgentView.jsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { BrowserbaseSessionViewer } from './browserbasesessionviewer';
import { StagehandControlPanel } from './StagehandControlPanel';

export const StagehandAgentView = () => {
  const { publicKey } = useWallet();
  
  const [currentTask, setCurrentTask] = useState(null);
  const [taskResults, setTaskResults] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Handle task completion
  const handleTaskComplete = (result) => {
    setTaskResults(result);
    
    if (result.session) {
      setCurrentSession({
        id: result.session.id,
        liveUrl: result.liveUrl || null
      });
    }
    
    // Update current task description
    setCurrentTask(result.task || result.description);
  };
  
  // Reset the current session and task
  const resetSession = () => {
    setCurrentSession(null);
    setTaskResults(null);
    setCurrentTask(null);
  };
  
  if (!publicKey) {
    return (
      <div className="wallet-connect-prompt flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg">
        <div className="text-6xl mb-4">🧠</div>
        <h2 className="text-xl font-semibold mb-4">Connect your wallet to use Stagehand AI</h2>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Connect your Solana wallet to access advanced browser automation with AI-powered browsing.
        </p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div className="agent-view">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BrowserbaseSessionViewer 
            sessionId={currentSession?.id} 
            liveUrl={currentSession?.liveUrl}
            task={currentTask}
          />
          
          {taskResults && (
            <div className="task-results mt-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Task Results</h3>
              
              {taskResults.message && (
                <div className="message bg-gray-700 p-3 rounded mb-4">
                  {taskResults.message}
                </div>
              )}
              
              {taskResults.steps && taskResults.steps.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Steps Taken</h4>
                  <div className="steps-timeline space-y-2 max-h-64 overflow-y-auto pr-2">
                    {taskResults.steps.map((step, index) => (
                      <div key={index} className="step flex">
                        <div className="step-number flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-sm">
                          {index + 1}
                        </div>
                        <div className="step-content flex-grow bg-gray-700 p-2 rounded">
                          <div className="flex justify-between">
                            <div className="step-action font-medium">{step.action}</div>
                            <div className="step-time text-xs text-gray-400">
                              {new Date(step.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          {step.details && (
                            <div className="step-details text-sm text-gray-300 mt-1">
                              {step.details}
                            </div>
                          )}
                          {step.url && (
                            <div className="step-url text-xs text-gray-400 mt-1">
                              {step.url}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show findings and recommendations if available */}
              {(taskResults.findings || taskResults.recommendedAction) && (
                <div className="mt-4">
                  {taskResults.findings && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-2">Key Findings</h4>
                      <div className="bg-gray-700 p-3 rounded text-sm">
                        {taskResults.findings}
                      </div>
                    </div>
                  )}
                  
                  {taskResults.recommendedAction && (
                    <div>
                      <h4 className="font-medium mb-2">Recommended Action</h4>
                      <div className="bg-green-900 text-green-300 p-3 rounded text-sm">
                        {taskResults.recommendedAction}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Action buttons */}
              <div className="mt-6 flex justify-end">
                <button 
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white"
                  onClick={resetSession}
                >
                  New Task
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          {!currentSession ? (
            <StagehandControlPanel onTaskComplete={handleTaskComplete} />
          ) : (
            <div className="session-info bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Active Session</h3>
              
              <div className="bg-gray-700 p-3 rounded mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-400">Session ID:</div>
                  <div className="font-mono text-sm">{currentSession.id}</div>
                  <div className="text-gray-400">Status:</div>
                  <div>
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded-full text-xs">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="current-task mb-4">
                <h4 className="font-medium mb-2">Current Task</h4>
                <div className="bg-gray-700 p-3 rounded">
                  {currentTask || "No task running"}
                </div>
              </div>
              
              {/* Session actions */}
              <div className="session-actions">
                <button 
                  className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded mb-2 text-white"
                  onClick={() => {
                    if (currentSession?.id) {
                      window.open(`https://browserbase.com/sessions/${currentSession.id}`, '_blank');
                    }
                  }}
                >
                  View in Browserbase
                </button>
                
                <button 
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                  onClick={resetSession}
                >
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StagehandAgentView;