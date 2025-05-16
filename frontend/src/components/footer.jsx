// src/components/Footer.jsx
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6 px-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-gray-400">
              BONK Browser Agent v1.0.0
            </div>
            <div className="text-xs text-gray-500">
              Powered by browser-use.com, Steel, and OpenAI
            </div>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">
              Solana
            </a>
            <a href="https://bonktoken.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">
              BONK Token
            </a>
            <a href="https://docs.browser-use.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">
              Browser Use Docs
            </a>
            <a href="https://docs.steel.dev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm">
              Steel Docs
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
          <p>BONK Browser Agent is not affiliated with Solana, BONK Token, or Browser Use. Use at your own risk.</p>
          <p className="mt-1">© {new Date().getFullYear()} BONK Browser Agent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
