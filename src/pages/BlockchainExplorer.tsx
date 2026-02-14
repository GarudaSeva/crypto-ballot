import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Shield, CheckCircle, AlertCircle, Clock, Link as LinkIcon, Box } from "lucide-react";
import { getBlockchain } from "@/lib/api";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import UserNavbar from "@/components/Layout/UserNavbar";

interface Block {
  index: number;
  timestamp: number;
  votes: any[];
  previousHash: string;
  hash: string;
  nonce: number;
}

const BlockchainExplorer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const isAdminPath = location.pathname.startsWith('/admin');
  const [chain, setChain] = useState<Block[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAdminPath && (!isConnected || !isAuthenticated)) {
      navigate('/user/connect');
    }
  }, [isAdminPath, isConnected, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        const data = await getBlockchain(token || "");
        setChain(data.chain);
        setIsValid(data.isValid);
      } catch (error) {
        console.error("Failed to fetch blockchain:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBlockchainData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-background ${isAdminPath ? "flex" : ""}`}>
        {isAdminPath ? <AdminSidebar /> : <UserNavbar />}
        <div className="flex-1 p-10 space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isAdminPath ? "flex" : ""}`}>
      {isAdminPath ? <AdminSidebar /> : <UserNavbar />}
      
      <main className={`flex-1 ${isAdminPath ? "p-8 overflow-y-auto" : "container mx-auto py-10 px-4"}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Blockchain Explorer
            </h1>
            <p className="text-muted-foreground mt-2">
              Verifying the immutability and transparency of the voting ledger.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={isValid ? "default" : "destructive"} className="px-4 py-1.5 text-sm flex gap-2 items-center">
              {isValid ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {isValid ? "Ledger Verified" : "Verification Failed"}
            </Badge>
            <div className="bg-muted p-2 rounded-lg flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              <span className="font-mono font-bold text-lg">{chain.length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Blocks</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[30px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent rounded-full hidden md:block" />
          
          <div className="space-y-12">
            {chain.slice().reverse().map((block, idx) => (
              <div key={block.index} className="relative flex flex-col md:flex-row gap-8">
                {/* Connector Dot */}
                <div className="absolute left-[30px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-background bg-primary z-10 hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>

                {/* Block Card */}
                <Card className="flex-1 overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 group shadow-lg hover:shadow-primary/5">
                  <div className="bg-muted/50 p-4 flex justify-between items-center border-b border-primary/5">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-primary" />
                      <span className="font-bold">Block #{block.index}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(block.timestamp), "MMM d, HH:mm:ss")}
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-1.5">
                            <Shield className="w-3.5 h-3.5" /> Block Hash
                          </label>
                          <p className="font-mono text-[10px] md:text-sm bg-muted p-2.5 rounded border border-primary/5 break-all leading-relaxed">
                            {block.hash}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-1.5">
                            <LinkIcon className="w-3.5 h-3.5" /> Parent Hash
                          </label>
                          <p className="font-mono text-[10px] md:text-sm text-muted-foreground/80 break-all">
                            {block.previousHash}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-primary/5">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Block Payload
                          </label>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                            {block.votes.length} Entries
                          </Badge>
                        </div>
                        
                        <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                          {block.votes.map((vote, vIdx) => (
                            <div key={vIdx} className="text-xs bg-background/50 p-3 rounded-lg border border-primary/5 shadow-sm">
                              {vote.message ? (
                                <p className="font-medium italic text-primary">{vote.message}</p>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Vote ID:</span>
                                    <span className="font-mono font-medium">{vote.voteId.slice(-8)}...</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Voter:</span>
                                    <span className="font-mono">{vote.voterId.slice(0, 8)}...</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-primary/5 flex justify-between items-center">
                      <div className="flex gap-4">
                         <span className="text-xs text-muted-foreground">
                          Nonce: <span className="font-mono text-primary font-medium">{block.nonce}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Work: <span className="font-mono text-primary font-medium">PoW (d:2)</span>
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                        Status: Confirmed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlockchainExplorer;
