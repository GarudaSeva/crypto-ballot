import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/Layout/AdminSidebar';
import StatsCard from '@/components/Cards/StatsCard';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Vote, Users, BarChart3, Activity } from 'lucide-react';
import * as api from '@/lib/api';

const AdminDashboard = () => {
  const { elections } = useElection();
  const { token } = useAuth();
  const [stats, setStats] = useState({ voters: 0, elections: 0, votes: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadStats();
  }, [token, navigate]);

  const loadStats = async () => {
    if (!token) return;
    try {
      const data = await api.getDashboardStats(token);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const totalElections = elections.length;
  const activeElections = elections.filter(e => e.status === 'active').length;
  const totalCandidates = elections.reduce((sum, e) => sum + e.candidates.length, 0);

  const recentElections = elections.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your election management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatsCard
            title="Total Elections"
            value={totalElections}
            icon={Vote}
            variant="primary"
          />
          <StatsCard
            title="Active Elections"
            value={activeElections}
            icon={Activity}
            variant="accent"
          />
          <StatsCard
            title="Total Candidates"
            value={totalCandidates}
            icon={Users}
          />
          <StatsCard
            title="Total Votes Cast"
            value={stats.votes.toLocaleString()}
            icon={BarChart3}
            variant="success"
          />
        </div>

        {/* Recent Elections */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg font-bold text-foreground">
              Recent Elections
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Election Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Candidates
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Votes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentElections.map((election) => (
                  <tr key={election.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{election.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground capitalize">{election.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        election.status === 'active' 
                          ? 'bg-success/10 text-success'
                          : election.status === 'upcoming'
                          ? 'bg-info/10 text-info'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {election.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {election.candidates.length}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {election.candidates.reduce((sum, c) => sum + c.votes, 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a 
                href="/admin/elections" 
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <Vote className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Create New Election</span>
              </a>
              <a 
                href="/admin/candidates" 
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Manage Candidates</span>
              </a>
              <a 
                href="/admin/reports" 
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">View Reports</span>
              </a>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-bold text-foreground mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blockchain Network</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-success">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Smart Contract</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-success">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Block</span>
                <span className="text-sm font-mono text-muted-foreground">#18,234,567</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
