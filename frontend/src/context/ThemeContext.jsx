// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext(null);

/**
 * Provider component for theme state
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#F7931A',
    secondaryColor: '#6464FF',
    accentColor: '#EF4444',
    backgroundColor: '#111827',
    textColor: '#F9FAFB',
    isDarkMode: true
  });
  
  /**
   * Update theme colors
   * @param {Object} newColors - Color values to update
   */
  const updateColors = (newColors) => {
    setTheme(prev => ({
      ...prev,
      ...newColors
    }));
  };
  
  /**
   * Toggle between dark and light mode
   */
  const toggleDarkMode = () => {
    setTheme(prev => {
      if (prev.isDarkMode) {
        // Switch to light mode
        return {
          ...prev,
          backgroundColor: '#F9FAFB',
          textColor: '#111827',
          isDarkMode: false
        };
      } else {
        // Switch to dark mode
        return {
          ...prev,
          backgroundColor: '#111827',
          textColor: '#F9FAFB',
          isDarkMode: true
        };
      }
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, updateColors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook for accessing theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
