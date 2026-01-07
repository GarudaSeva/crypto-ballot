import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Election } from '@/contexts/ElectionContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ElectionCardProps {
  election: Election;
  hasVoted?: boolean;
}

const ElectionCard = ({ election, hasVoted }: ElectionCardProps) => {
  const navigate = useNavigate();

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

  const typeIcons = {
    village: '🏘️',
    mla: '🏛️',
    mlc: '📜',
    municipal: '🏙️',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleClick = () => {
    if (election.status === 'closed') {
      navigate('/user/results');
    } else {
      navigate(`/user/elections/${election.id}`);
    }
  };

  return (
    <div className="election-card group">
      {/* Header with gradient */}
      <div className={cn(
        "h-2",
        election.status === 'active' && "bg-gradient-to-r from-success to-accent",
        election.status === 'upcoming' && "bg-gradient-to-r from-info to-primary",
        election.status === 'closed' && "bg-gradient-to-r from-muted-foreground to-muted-foreground/50"
      )} />
      
      <div className="p-6">
        {/* Type & Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl">{typeIcons[election.type]}</span>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            statusStyles[election.status]
          )}>
            {statusLabels[election.status]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {election.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {election.description}
        </p>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
          </div>
        </div>

        {/* Candidates count */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Users className="w-4 h-4" />
          <span>{election.candidates.length} Candidates</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleClick}
          className="w-full group/btn"
          variant={election.status === 'active' ? 'gradient-accent' : 'outline'}
          disabled={hasVoted && election.status === 'active'}
        >
          {hasVoted && election.status === 'active' ? (
            <span className="flex items-center gap-2">
              ✓ Voted
            </span>
          ) : election.status === 'closed' ? (
            <span className="flex items-center gap-2">
              View Results
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {election.status === 'active' ? 'Vote Now' : 'View Candidates'}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ElectionCard;
