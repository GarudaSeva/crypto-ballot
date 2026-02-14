import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useElection } from '@/contexts/ElectionContext';
import UserNavbar from '@/components/Layout/UserNavbar';
import CandidateCard from '@/components/Cards/CandidateCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ElectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected } = useWallet();
  const { elections, votedElections, castVote } = useElection();
  const navigate = useNavigate();

  const [votingFor, setVotingFor] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (!isConnected || !isAuthenticated) {
      navigate('/user/connect');
    }
  }, [isConnected, isAuthenticated, navigate]);

  const election = elections.find((e) => e.id === id);
  const hasVoted = id ? votedElections.includes(id) : false;

  if (!election) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Election Not Found
          </h1>
          <Button onClick={() => navigate('/user/elections')}>
            Back to Elections
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleVoteClick = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    setShowConfirmation(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate || !id) return;

    setVotingFor(selectedCandidate);
    setShowConfirmation(false);

    try {
      const success = await castVote(id, selectedCandidate);
      if (success) {
        toast.success('Vote Cast Successfully!', {
          description: 'Your vote has been recorded on the blockchain.',
        });
      }
    } catch (error: any) {
      toast.error('Transaction Failed', {
        description: error.message || 'There was an error processing your vote. Please try again.',
      });
    } finally {
      setVotingFor(null);
    }
  };

  const statusStyles = {
    active: 'status-active',
    upcoming: 'status-upcoming',
    closed: 'status-closed',
  };

  const statusLabels = {
    active: 'Active Now',
    upcoming: 'Upcoming',
    closed: 'Closed',
  };

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Confirm Your Vote
              </h3>
              <p className="text-muted-foreground">
                You are about to cast your vote for:
              </p>
              <p className="font-bold text-foreground mt-2">
                {election.candidates.find((c) => c.id === selectedCandidate)?.name}
              </p>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-warning-foreground">
                <strong>Important:</strong> This action is irreversible. Once confirmed, your vote will be permanently recorded on the blockchain and cannot be changed.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                onClick={handleConfirmVote}
              >
                Confirm & Sign
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/user/elections')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Elections
        </Button>

        {/* Election Header */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <span className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4",
                statusStyles[election.status]
              )}>
                {statusLabels[election.status]}
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                {election.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {election.description}
              </p>
            </div>

            {hasVoted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-lg text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">You have voted</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(election.startDate)} — {formatDate(election.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{election.candidates.length} Candidates</span>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            Candidates
          </h2>

          {election.candidates.length > 0 ? (
            <div className="grid gap-4">
              {election.candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  canVote={election.status === 'active' && !hasVoted}
                  onVote={() => handleVoteClick(candidate.id)}
                  isVoting={votingFor === candidate.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                No Candidates Yet
              </h3>
              <p className="text-muted-foreground">
                Candidates will be announced soon.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ElectionDetails;
