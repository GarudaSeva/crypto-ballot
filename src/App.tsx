import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";
import { ElectionProvider } from "./contexts/ElectionContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlockchainExplorer from "./pages/BlockchainExplorer";

// User Pages
import Connect from "./pages/user/Connect";
import Dashboard from "./pages/user/Dashboard";
import Elections from "./pages/user/Elections";
import ElectionDetails from "./pages/user/ElectionDetails";
import Guidelines from "./pages/user/Guidelines";
import Results from "./pages/user/Results";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageElections from "./pages/admin/ManageElections";
import ManageCandidates from "./pages/admin/ManageCandidates";
import ManageVoters from "./pages/admin/ManageVoters";
import Reports from "./pages/admin/Reports";
import AdminGuidelines from "./pages/admin/AdminGuidelines";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WalletProvider>
        <ElectionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                
                {/* User Routes */}
                <Route path="/user/connect" element={<Connect />} />
                <Route path="/user/dashboard" element={<Dashboard />} />
                <Route path="/user/elections" element={<Elections />} />
                <Route path="/user/elections/:id" element={<ElectionDetails />} />
                <Route path="/user/guidelines" element={<Guidelines />} />
                <Route path="/user/results" element={<Results />} />
                <Route path="/user/blockchain" element={<BlockchainExplorer />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/elections" element={<ManageElections />} />
                <Route path="/admin/candidates" element={<ManageCandidates />} />
                <Route path="/admin/voters" element={<ManageVoters />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/guidelines" element={<AdminGuidelines />} />
                <Route path="/admin/blockchain" element={<BlockchainExplorer />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ElectionProvider>
      </WalletProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
