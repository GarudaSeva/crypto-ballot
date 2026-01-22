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
  connectWallet: () => Promise<void>;
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
  const { login, logout, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /* ---------------- CONNECT WALLET ---------------- */
  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      const { ethereum } = window as any;
      if (!ethereum) {
        alert("MetaMask is not installed");
        return;
      }

      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);

      // Login via wallet
      await login({ walletAddress: address });

      // persist state
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAddress", address);

      console.log("Connected wallet:", address);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      setIsConnected(false);
      setWalletAddress(null);
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

    console.log("Wallet disconnected (app level)");
  };

  /* ---------------- AUTO RESTORE ON REFRESH ---------------- */
  useEffect(() => {
    const restoreWallet = async () => {
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
          await login({ walletAddress: address });
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
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);

        // Re-login with new account
        try {
          await login({ walletAddress: address });
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
