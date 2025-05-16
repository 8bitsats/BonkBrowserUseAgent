// src/context/AgentContext.jsx
import React, { createContext, useContext } from 'react';
import useAgent from '../hooks/useAgent';

// Create context
const AgentContext = createContext(null);

/**
 * Provider component for agent-related state
 */
export const AgentProvider = ({ children }) => {
  const agent = useAgent();
  
  return (
    <AgentContext.Provider value={agent}>
      {children}
    </AgentContext.Provider>
  );
};

/**
 * Hook for accessing agent context
 */
export const useAgentContext = () => {
  const context = useContext(AgentContext);
  
  if (!context) {
    throw new Error('useAgentContext must be used within an AgentProvider');
  }
  
  return context;
};

export default AgentContext;
