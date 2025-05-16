// src/hooks/useAgent.js
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ApiService } from '../services/api';

/**
 * Custom hook for browser agent functionality
 * @returns {Object} Agent state and functions
 */
export const useAgent = () => {
  const { publicKey } = useWallet();
  
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState('idle'); // idle, running, paused, completed, failed
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskSteps, setTaskSteps] = useState([]);
  const [taskOutput, setTaskOutput] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Poll for task status when task is active
  useEffect(() => {
    if (!taskId || !(taskStatus === 'running' || taskStatus === 'paused')) {
      return;
    }
    
    const intervalId = setInterval(async () => {
      try {
        await fetchTaskStatus();
      } catch (err) {
        console.error('Error polling task status:', err);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [taskId, taskStatus]);
  
  /**
   * Fetch task status and details
   */
  const fetchTaskStatus = async () => {
    if (!taskId) return;
    
    try {
      // Get task status
      const statusResponse = await ApiService.tasks.getStatus(taskId);
      setTaskStatus(statusResponse);
      
      if (statusResponse === 'running' || statusResponse === 'finished' || statusResponse === 'paused') {
        // Get full task details
        const taskDetails = await ApiService.tasks.get(taskId);
        
        // Update task information
        if (taskDetails.live_url && !liveUrl) {
          setLiveUrl(taskDetails.live_url);
        }
        
        if (taskDetails.output && !taskOutput) {
          setTaskOutput(taskDetails.output);
        }
        
        // Update progress based on steps completed
        if (taskDetails.steps) {
          setTaskSteps(taskDetails.steps);
          setTaskProgress(
            statusResponse === 'finished' 
              ? 100 
              : Math.min((taskDetails.steps.length / 20) * 100, 99)
          );
        }
        
        // Get screenshots
        if (taskDetails.steps && taskDetails.steps.length > 0) {
          try {
            const screenshots = await ApiService.tasks.getScreenshots(taskId);
            
            // Merge screenshots with steps
            if (screenshots && screenshots.screenshots) {
              const updatedSteps = taskDetails.steps.map((step, index) => ({
                ...step,
                screenshot: index < screenshots.screenshots.length 
                  ? screenshots.screenshots[index] 
                  : null
              }));
              
              setTaskSteps(updatedSteps);
            }
          } catch (err) {
            console.error('Error fetching screenshots:', err);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching task status:', err);
      setError('Failed to update task status');
    }
  };
  
  /**
   * Start a new task
   * @param {string} taskDescription - Description of what the agent should do
   * @param {Array} allowedDomains - List of domains the agent can visit
   * @param {string} llmModel - LLM model to use
   * @returns {Promise<Object>} Task creation result
   */
  const startTask = async (taskDescription, allowedDomains = [], llmModel = 'gpt-4o') => {
    if (!publicKey) {
      setError('Please connect your wallet first');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    setTaskId(null);
    setTaskStatus('idle');
    setTaskProgress(0);
    setTaskSteps([]);
    setTaskOutput('');
    setLiveUrl('');
    
    try {
      const response = await ApiService.tasks.create(
        taskDescription,
        publicKey.toString(),
        allowedDomains,
        llmModel
      );
      
      setTaskId(response.id);
      setTaskStatus('running');
      
      // Immediately fetch initial task details
      await fetchTaskStatus();
      
      return response;
    } catch (err) {
      console.error('Error starting task:', err);
      setError(err.response?.data?.error || 'Failed to start task');
      setTaskStatus('failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Pause the current task
   * @returns {Promise<boolean>} Success status
   */
  const pauseTask = async () => {
    if (!taskId || taskStatus !== 'running') {
      return false;
    }
    
    try {
      await ApiService.tasks.pause(taskId);
      setTaskStatus('paused');
      return true;
    } catch (err) {
      console.error('Error pausing task:', err);
      setError('Failed to pause task');
      return false;
    }
  };
  
  /**
   * Resume the current task
   * @returns {Promise<boolean>} Success status
   */
  const resumeTask = async () => {
    if (!taskId || taskStatus !== 'paused') {
      return false;
    }
    
    try {
      await ApiService.tasks.resume(taskId);
      setTaskStatus('running');
      return true;
    } catch (err) {
      console.error('Error resuming task:', err);
      setError('Failed to resume task');
      return false;
    }
  };
  
  /**
   * Stop the current task
   * @returns {Promise<boolean>} Success status
   */
  const stopTask = async () => {
    if (!taskId || (taskStatus !== 'running' && taskStatus !== 'paused')) {
      return false;
    }
    
    try {
      await ApiService.tasks.stop(taskId);
      setTaskStatus('idle');
      setLiveUrl('');
      return true;
    } catch (err) {
      console.error('Error stopping task:', err);
      setError('Failed to stop task');
      return false;
    }
  };
  
  /**
   * Reset agent state
   */
  const resetAgent = () => {
    setTaskId(null);
    setTaskStatus('idle');
    setTaskProgress(0);
    setTaskSteps([]);
    setTaskOutput('');
    setLiveUrl('');
    setError(null);
  };
  
  return {
    taskId,
    taskStatus,
    taskProgress,
    taskSteps,
    taskOutput,
    liveUrl,
    error,
    isLoading,
    startTask,
    pauseTask,
    resumeTask,
    stopTask,
    resetAgent,
    fetchTaskStatus
  };
};

export default useAgent;
