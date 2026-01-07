import { Button } from '@/components/ui/button';
import { Candidate } from '@/contexts/ElectionContext';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: Candidate;
  onVote?: () => void;
  canVote?: boolean;
  isVoting?: boolean;
  showVotes?: boolean;
  totalVotes?: number;
}

const CandidateCard = ({ 
  candidate, 
  onVote, 
  canVote, 
  isVoting,
  showVotes,
  totalVotes = 0
}: CandidateCardProps) => {
  const votePercentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;

  return (
    <div className="candidate-card relative overflow-hidden">
      {/* Vote percentage bar (shown only for results) */}
      {showVotes && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-success transition-all duration-1000"
          style={{ width: `${votePercentage}%` }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Symbol/Avatar */}
        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-3xl flex-shrink-0">
          {candidate.symbol}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-lg text-foreground">
            {candidate.name}
          </h4>
          <p className="text-sm text-accent font-medium">
            {candidate.party}
          </p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {candidate.description}
          </p>

          {/* Votes (shown for results) */}
          {showVotes && (
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-bold text-foreground">
                  {candidate.votes.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">votes</span>
              </div>
              <div className="text-sm font-medium text-accent">
                {votePercentage.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {/* Vote Button */}
        {canVote && onVote && (
          <Button
            variant="gradient"
            onClick={onVote}
            disabled={isVoting}
            className="flex-shrink-0"
          >
            {isVoting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Confirming...
              </span>
            ) : (
              'Vote'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
