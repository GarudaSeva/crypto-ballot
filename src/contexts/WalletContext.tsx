import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    // Simulate MetaMask connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate a wallet address
    const mockAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setWalletAddress(mockAddress);
    setIsConnected(true);
    setIsConnecting(false);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      connectWallet,
      disconnectWallet,
      isConnecting,
    }}>
      {children}
    </WalletContext.Provider>
  );
};
