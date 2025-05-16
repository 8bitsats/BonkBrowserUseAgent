// src/components/BrowserbaseSessionViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ApiService } from '../services/api';

// SVG icons
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

/**
 * Component for displaying and controlling Browserbase sessions
 */
export const BrowserbaseSessionViewer = ({ sessionId = null, liveUrl = null, task = null }) => {
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [viewerUrl, setViewerUrl] = useState(liveUrl || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [recordingData, setRecordingData] = useState(null);
  const [taskLogs, setTaskLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('live');
  
  const iframeRef = useRef(null);
  
  // Load session data if sessionId is provided
  useEffect(() => {
    if (sessionId && !session) {
      fetchSessionData();
    }
    
    if (liveUrl && !viewerUrl) {
      setViewerUrl(liveUrl);
    }
  }, [sessionId, liveUrl]);
  
  // Handle window messages from the iframe (disconnection events)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "browserbase-disconnected") {
        console.log("Browser session disconnected");
        // Update UI to show disconnection
        setError("Browser session disconnected. The session may have ended.");
      }
    };
    
    window.addEventListener("message", handleMessage);
    
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  
  // Fetch session information
  const fetchSessionData = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get debug links
      const debugLinks = await ApiService.browserbase.getDebugLinks(sessionId);
      
      if (debugLinks) {
        // Set the URL for live viewing
        setViewerUrl(debugLinks.debuggerFullscreenUrl);
        
        // Store session data
        setSession({
          id: sessionId,
          debugLinks
        });
      }
    } catch (err) {
      console.error(`Error fetching session ${sessionId} data:`, err);
      setError('Failed to fetch session data');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch session recording
  const fetchRecording = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      const recording = await ApiService.browserbase.getRecording(sessionId);
      setRecordingData(recording);
      setActiveTab('recording');
    } catch (err) {
      console.error(`Error fetching recording for session ${sessionId}:`, err);
      setError('Failed to fetch session recording');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch session logs
  const fetchLogs = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      const logs = await ApiService.browserbase.getLogs(sessionId);
      setTaskLogs(logs);
      setActiveTab('logs');
    } catch (err) {
      console.error(`Error fetching logs for session ${sessionId}:`, err);
      setError('Failed to fetch session logs');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (iframeRef.current) {
      iframeRef.current.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className="browserbase-session-viewer bg-gray-800 rounded-lg overflow-hidden">
      <div className="viewer-header flex justify-between items-center p-4 bg-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">🤖</span>
          Browserbase Session Viewer
        </h2>
        
        {sessionId && (
          <div className="session-info text-sm bg-gray-600 px-3 py-1 rounded-lg">
            Session ID: {sessionId.slice(0, 8)}...
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="tabs flex border-b border-gray-700">
        <button 
          className={`tab px-4 py-2 ${activeTab === 'live' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('live')}
        >
          Live View
        </button>
        <button 
          className={`tab px-4 py-2 ${activeTab === 'recording' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          onClick={fetchRecording}
          disabled={!sessionId}
        >
          Recording
        </button>
        <button 
          className={`tab px-4 py-2 ${activeTab === 'logs' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-white'}`}
          onClick={fetchLogs}
          disabled={!sessionId}
        >
          Logs
        </button>
      </div>
      
      {error && (
        <div className="error-message bg-red-900 text-red-300 p-4 m-4 rounded">
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="loader">
            <svg className="animate-spin h-10 w-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      )}
      
      {/* Live View Tab */}
      {activeTab === 'live' && (
        <div className="live-view">
          {viewerUrl ? (
            <div className="browser-view relative" style={{ height: '500px' }}>
              <iframe 
                ref={iframeRef}
                src={viewerUrl}
                className="w-full h-full border-none"
                title="Browserbase Session"
                sandbox="allow-same-origin allow-scripts"
                allow="clipboard-read; clipboard-write"
              ></iframe>
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button 
                  className="p-2 bg-gray-800 bg-opacity-70 hover:bg-opacity-100 rounded text-white"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              </div>
            </div>
          ) : (
            <div className="placeholder-view h-96 flex items-center justify-center bg-gray-900">
              <div className="text-center p-6">
                <div className="text-6xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold mb-2">No browser session available</h3>
                <p className="text-gray-400 mb-4">Start a task to launch a browser session</p>
              </div>
            </div>
          )}
          
          {task && (
            <div className="task-info p-4 bg-gray-700">
              <h3 className="text-lg font-medium mb-2">Current Task</h3>
              <div className="bg-gray-800 p-3 rounded">
                {task}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Recording Tab */}
      {activeTab === 'recording' && (
        <div className="recording-view p-4">
          {recordingData ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Session Recording</h3>
              
              {/* This is a placeholder for the rrweb player */}
              {/* In a real implementation, you'd initialize the rrweb player with the recording data */}
              <div className="rrweb-player bg-gray-900 h-96 flex items-center justify-center">
                {recordingData.events && recordingData.events.length > 0 ? (
                  <div className="text-center">
                    <p>Recording available with {recordingData.events.length} events</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Integration with rrweb-player is required to view the recording
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                      Initialize Player
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p>No recording events available</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recording Details</h4>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">Session ID:</div>
                    <div>{sessionId}</div>
                    <div className="text-gray-400">Events:</div>
                    <div>{recordingData.events ? recordingData.events.length : 0}</div>
                    <div className="text-gray-400">Duration:</div>
                    <div>{recordingData.duration || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder-view h-96 flex items-center justify-center bg-gray-900">
              <div className="text-center p-6">
                <div className="text-6xl mb-4">📼</div>
                <h3 className="text-xl font-semibold mb-2">No recording available</h3>
                <p className="text-gray-400 mb-4">
                  {sessionId ? 
                    'Click the "Recording" tab to load the session recording' : 
                    'Start a task to create a browser session'
                  }
                </p>
                {sessionId && (
                  <button 
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded flex items-center mx-auto"
                    onClick={fetchRecording}
                  >
                    <RefreshIcon className="mr-2 h-5 w-5" />
                    Load Recording
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="logs-view p-4">
          <h3 className="text-lg font-medium mb-4">Session Logs</h3>
          
          {taskLogs && taskLogs.length > 0 ? (
            <div className="logs-container bg-gray-900 p-4 rounded max-h-96 overflow-y-auto font-mono text-sm">
              {taskLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`log-entry py-1 ${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'warning' ? 'text-yellow-400' : 
                    log.type === 'network' ? 'text-blue-400' : 
                    'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder-view h-64 flex items-center justify-center bg-gray-900 rounded">
              <div className="text-center p-6">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2">No logs available</h3>
                <p className="text-gray-400 mb-4">
                  {sessionId ? 
                    'Click the "Logs" tab to load the session logs' : 
                    'Start a task to create a browser session'
                  }
                </p>
                {sessionId && (
                  <button 
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded flex items-center mx-auto"
                    onClick={fetchLogs}
                  >
                    <RefreshIcon className="mr-2 h-5 w-5" />
                    Load Logs
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowserbaseSessionViewer;