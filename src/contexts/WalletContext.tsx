import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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

      setWalletAddress(accounts[0]);
      setIsConnected(true);

      // persist state
      localStorage.setItem("walletConnected", "true");
      localStorage.setItem("walletAddress", accounts[0]);

      console.log("Connected wallet:", accounts[0]);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  /* ---------------- DISCONNECT WALLET ---------------- */
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);

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

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);

        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", accounts[0]);
      }
    };

    restoreWallet();
  }, []);

  /* ---------------- HANDLE ACCOUNT CHANGE ---------------- */
  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletAddress(accounts[0]);
        setIsConnected(true);

        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAddress", accounts[0]);
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
