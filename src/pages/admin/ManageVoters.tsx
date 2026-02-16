import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/Layout/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Search,
  Fingerprint,
  Wallet,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ManageVoters = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [voters, setVoters] = useState<api.Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadVoters();
  }, [token, navigate]);

  const loadVoters = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await api.listVoters(token);
      setVoters(data.voters);
    } catch (error) {
      console.error('Failed to load voters:', error);
      toast.error('Failed to load voters list');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (voterId: string) => {
    if (!token) return;
    try {
      await api.approveVoter(voterId, token);
      toast.success('Voter approved successfully');
      loadVoters();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve voter');
    }
  };

  const handleToggleStatus = async (voterId: string) => {
    if (!token) return;
    try {
      await api.toggleVoterStatus(voterId, token);
      toast.success('Voter status updated successfully');
      loadVoters();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const filteredVoters = voters.filter(voter => 
    voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.aadhaarNumber?.includes(searchTerm) ||
    voter.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Voter Management
            </h1>
            <p className="text-muted-foreground">
              Review and verify voter registration requests
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search voters..."
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadVoters}
              disabled={loading}
              className="bg-card shrink-0"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Voter Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Identity Mapping</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredVoters.length > 0 ? (
                    filteredVoters.map((voter) => (
                      <tr key={voter.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {voter.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{voter.name}</div>
                              <div className="text-xs text-muted-foreground">{voter.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-mono text-xs">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-foreground">
                              <Fingerprint className="w-3.5 h-3.5 text-primary" />
                              {voter.aadhaarNumber || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Wallet className="w-3.5 h-3.5" />
                              {voter.walletAddress ? `${voter.walletAddress.slice(0, 6)}...${voter.walletAddress.slice(-4)}` : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            {voter.isApproved ? (
                              <Badge 
                                variant="default" 
                                className={cn(
                                  "gap-1.5",
                                  voter.isActive 
                                    ? "bg-success/10 text-success border-success/20" 
                                    : "bg-muted text-muted-foreground border-border"
                                )}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                {voter.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Pending Approval
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            {!voter.isApproved ? (
                              <Button 
                                size="sm" 
                                className="bg-success hover:bg-success/90 gap-1.5"
                                onClick={() => handleApprove(voter.id)}
                              >
                                <UserCheck className="w-4 h-4" />
                                Approve
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={cn(
                                  "gap-1.5",
                                  voter.isActive 
                                    ? "text-destructive hover:bg-destructive/10 border-destructive/20"
                                    : "text-success hover:bg-success/10 border-success/20"
                                )}
                                onClick={() => handleToggleStatus(voter.id)}
                              >
                                {voter.isActive ? (
                                  <>
                                    <UserX className="w-4 h-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4" />
                                    Activate
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No voter requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageVoters;
