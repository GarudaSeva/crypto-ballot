import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: (aadhaarNumber?: string, name?: string) => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { login, signup, logout, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /* ---------------- CONNECT WALLET ---------------- */
  const connectWallet = async (aadhaarNumber?: string, name?: string) => {
    try {
      setIsConnecting(true);

      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];

      // If name is provided, this is a signup (registration)
      if (name) {
        await signup({ 
          walletAddress: address, 
          name,
          email: `${address.toLowerCase()}@wallet.local`
        });
        // Don't set connected state - user needs approval first
        throw new Error('Registration submitted. Your account is pending admin approval.');
      } else {
        // Otherwise, this is a login
        await login({ walletAddress: address, aadhaarNumber });
        
        // Only set connected if login succeeded
        setWalletAddress(address);
        setIsConnected(true);

        // persist state
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", address);
        if (aadhaarNumber) localStorage.setItem("aadhaarNumber", aadhaarNumber);

        console.log("Connected wallet:", address);
      }
    } catch (error: any) {
      console.error("MetaMask connection failed:", error);
      // Don't disconnect if it's just a verification pending message
      if (!error.message.includes('pending') && !error.message.includes('submitted')) {
        setIsConnected(false);
        setWalletAddress(null);
      }
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  /* ---------------- DISCONNECT WALLET ---------------- */
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    logout();

    // clear persistence
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("aadhaarNumber");

    console.log("Wallet disconnected (app level)");
  };

  /* ---------------- AUTO RESTORE ON REFRESH ---------------- */
  useEffect(() => {
    const restoreWallet = async () => {
      const isActuallyConnected = localStorage.getItem("walletConnected") === "true";
      if (!isActuallyConnected) return; // Don't auto-login if user logged out manually

      const { ethereum } = window as any;
      if (!ethereum) return;

      const accounts: string[] = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0 && !isAuthenticated) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);

        // Auto-login via wallet
        try {
          const storedAadhaar = localStorage.getItem("aadhaarNumber");
          await login({ walletAddress: address, aadhaarNumber: storedAadhaar || undefined });
          localStorage.setItem("walletConnected", "true");
          localStorage.setItem("walletAddress", address);
        } catch (error) {
          console.error("Auto-login failed:", error);
          setIsConnected(false);
          setWalletAddress(null);
        }
      }
    };

    restoreWallet();
  }, []);

  /* ---------------- HANDLE ACCOUNT CHANGE ---------------- */
  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      const isActuallyConnected = localStorage.getItem("walletConnected") === "true";
      
      if (accounts.length === 0 || !isActuallyConnected) {
        disconnectWallet();
      } else {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);

        // Re-login with new account
        try {
          const storedAadhaar = localStorage.getItem("aadhaarNumber");
          await login({ walletAddress: address, aadhaarNumber: storedAadhaar || undefined });
          localStorage.setItem("walletConnected", "true");
          localStorage.setItem("walletAddress", address);
        } catch (error) {
          console.error("Re-login failed:", error);
          disconnectWallet();
        }
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectWallet,
        disconnectWallet,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
