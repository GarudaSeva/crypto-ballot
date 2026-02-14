import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useElection } from '@/contexts/ElectionContext';
import UserNavbar from '@/components/Layout/UserNavbar';
import CandidateCard from '@/components/Cards/CandidateCard';
import { BarChart3, Trophy, Users } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

const Results = () => {
  const { isConnected } = useWallet();
  const { elections } = useElection();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected || !isAuthenticated) {
      navigate('/user/connect');
    }
  }, [isConnected, isAuthenticated, navigate]);

  const closedElections = elections.filter((e) => e.status === 'closed');

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Election Results
          </h1>
          <p className="text-muted-foreground">
            View transparent, blockchain-verified election results
          </p>
        </div>

        {closedElections.length > 0 ? (
          <div className="space-y-8">
            {closedElections.map((election) => {
              const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
              const winner = [...election.candidates].sort((a, b) => b.votes - a.votes)[0];

              return (
                <div key={election.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                  {/* Election Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-primary-foreground/70 text-sm font-medium">
                          Completed Election
                        </span>
                        <h2 className="font-display text-xl font-bold text-primary-foreground">
                          {election.name}
                        </h2>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-display font-bold text-primary-foreground">
                            {totalVotes.toLocaleString()}
                          </p>
                          <p className="text-primary-foreground/70 text-xs">Total Votes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-display font-bold text-primary-foreground">
                            {election.candidates.length}
                          </p>
                          <p className="text-primary-foreground/70 text-xs">Candidates</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Winner Banner */}
                  {winner && (
                    <div className="bg-success/10 border-b border-success/20 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm text-success font-medium">Winner</p>
                          <p className="font-display font-bold text-foreground">
                            {winner.name} — {winner.party}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-2xl font-display font-bold text-foreground">
                            {((winner.votes / totalVotes) * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {winner.votes.toLocaleString()} votes
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results List */}
                  <div className="p-6">
                    <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-muted-foreground" />
                      Detailed Results
                    </h3>
                    <div className="grid gap-4">
                      {[...election.candidates]
                        .sort((a, b) => b.votes - a.votes)
                        .map((candidate, index) => (
                          <div key={candidate.id} className="relative">
                            {index === 0 && (
                              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-success rounded-full" />
                            )}
                            <CandidateCard
                              candidate={candidate}
                              showVotes
                              totalVotes={totalVotes}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              No Results Available
            </h3>
            <p className="text-muted-foreground mb-6">
              Results will appear here once elections are completed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;
