import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useElection, Election } from '@/contexts/ElectionContext';
import UserNavbar from '@/components/Layout/UserNavbar';
import ElectionCard from '@/components/Cards/ElectionCard';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

type ElectionType = 'all' | 'village' | 'mla' | 'mlc' | 'municipal';
type StatusFilter = 'all' | 'active' | 'upcoming' | 'closed';

import { useAuth } from '@/contexts/AuthContext';

const Elections = () => {
  const { isConnected } = useWallet();
  const { elections, votedElections } = useElection();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState<ElectionType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (!isConnected || !isAuthenticated) {
      navigate('/user/connect');
    }
  }, [isConnected, isAuthenticated, navigate]);

  const filteredElections = elections.filter((election) => {
    const matchesType = typeFilter === 'all' || election.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || election.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const typeOptions: { value: ElectionType; label: string; icon: string }[] = [
    { value: 'all', label: 'All Types', icon: '📋' },
    { value: 'village', label: 'Village', icon: '🏘️' },
    { value: 'mla', label: 'MLA', icon: '🏛️' },
    { value: 'mlc', label: 'MLC', icon: '📜' },
    { value: 'municipal', label: 'Municipal', icon: '🏙️' },
  ];

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Elections
            </h1>
            <p className="text-muted-foreground">
              Browse and participate in available elections
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter Elections</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={typeFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(option.value)}
                  className="gap-2"
                >
                  <span>{option.icon}</span>
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="hidden md:block w-px bg-border" />

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        {filteredElections.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                hasVoted={votedElections.includes(election.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              No Elections Found
            </h3>
            <p className="text-muted-foreground mb-6">
              No elections match your current filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setTypeFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Elections;
