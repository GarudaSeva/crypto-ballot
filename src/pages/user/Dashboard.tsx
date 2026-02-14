import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useElection } from '@/contexts/ElectionContext';
import UserNavbar from '@/components/Layout/UserNavbar';
import StatsCard from '@/components/Cards/StatsCard';
import ElectionCard from '@/components/Cards/ElectionCard';
import { useAuth } from '@/contexts/AuthContext';
import { Vote, CheckCircle, Clock, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { isConnected, walletAddress } = useWallet();
  const { elections, votedElections } = useElection();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected || !isAuthenticated) {
      navigate('/user/connect');
    }
  }, [isConnected, isAuthenticated, navigate]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const activeElections = elections.filter(e => e.status === 'active');
  const upcomingElections = elections.filter(e => e.status === 'upcoming');
  const closedElections = elections.filter(e => e.status === 'closed');

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-primary via-primary/95 to-accent/80 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome, Voter!
              </h1>
              <p className="text-white/80">
                Connected as: <span className="font-mono bg-white/10 px-2 py-1 rounded">{walletAddress && shortenAddress(walletAddress)}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <span className="text-white font-medium">Wallet Connected</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatsCard
            title="Active Elections"
            value={activeElections.length}
            icon={Vote}
            variant="accent"
          />
          <StatsCard
            title="Upcoming Elections"
            value={upcomingElections.length}
            icon={Clock}
            variant="primary"
          />
          <StatsCard
            title="Your Votes Cast"
            value={votedElections.length}
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard
            title="Closed Elections"
            value={closedElections.length}
            icon={XCircle}
          />
        </div>

        {/* Active Elections */}
        {activeElections.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Active Elections
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeElections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  hasVoted={votedElections.includes(election.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Elections */}
        {upcomingElections.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-info" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Upcoming Elections
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingElections.map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Results */}
        {closedElections.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Recent Results
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closedElections.slice(0, 3).map((election) => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
