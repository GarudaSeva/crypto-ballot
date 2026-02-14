import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/Layout/AdminSidebar';
import { useElection, Election } from '@/contexts/ElectionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Users, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ManageCandidates = () => {
  const { elections, addCandidate, removeCandidate } = useElection();
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);
  const [selectedElection, setSelectedElection] = useState<string>(elections[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    symbol: '🌟',
    description: '',
  });

  const election = elections.find((e) => e.id === selectedElection);

  const symbolOptions = ['🌾', '🌻', '🌿', '🏛️', '⚡', '📚', '🌟', '🔔', '🎯', '🛡️', '🌈', '🔥'];

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      if (!selectedElection) return;

      await addCandidate(selectedElection, {
        name: formData.name,
        party: formData.party,
        symbol: formData.symbol,
        description: formData.description,
      });

      toast.success('Candidate Added!', {
        description: `${formData.name} has been added to the election.`,
      });

      setFormData({
        name: '',
        party: '',
        symbol: '🌟',
        description: '',
      });
      setShowAddForm(false);
    } catch (error: any) {
      toast.error('Failed to add candidate', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCandidate = async (candidateId: string, candidateName: string) => {
    if (!selectedElection) return;
    setIsRemoving(candidateId);
    
    try {
      await removeCandidate(selectedElection, candidateId);
      toast.success(`${candidateName} has been removed from the election.`);
    } catch (error: any) {
      toast.error('Failed to remove candidate', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsRemoving(null);
    }
  };

  const canAddCandidate = election?.status === 'upcoming';

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Manage Candidates
            </h1>
            <p className="text-muted-foreground">
              Add and manage candidates for each election
            </p>
          </div>
        </div>

        {/* Election Selector */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label>Select Election</Label>
              <Select value={selectedElection} onValueChange={setSelectedElection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an election" />
                </SelectTrigger>
                <SelectContent>
                  {elections.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      <span className="flex items-center gap-2">
                        {e.name}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          e.status === 'active' ? 'bg-success/10 text-success' :
                          e.status === 'upcoming' ? 'bg-info/10 text-info' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {e.status}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="gradient"
              onClick={() => setShowAddForm(true)}
              disabled={!canAddCandidate || !isAdmin}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Candidate
            </Button>
            {!isAdmin && (
              <p className="text-xs text-muted-foreground mt-2">
                Login as admin to add or remove candidates
              </p>
            )}
          </div>
          {!canAddCandidate && selectedElection && (
            <p className="text-sm text-warning mt-3">
              ⚠️ Candidates can only be added to upcoming elections.
            </p>
          )}
        </div>

        {/* Add Candidate Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Add New Candidate
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleAddCandidate} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Candidate Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party">Party Name</Label>
                  <Input
                    id="party"
                    placeholder="Political party"
                    value={formData.party}
                    onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Party Symbol</Label>
                  <div className="flex flex-wrap gap-2">
                    {symbolOptions.map((symbol) => (
                      <button
                        key={symbol}
                        type="button"
                        onClick={() => setFormData({ ...formData, symbol })}
                        className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all ${
                          formData.symbol === symbol
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the candidate..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddForm(false)}
                    disabled={isAdding}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" className="flex-1" disabled={!isAdmin || isAdding}>
                    {isAdding ? 'Adding...' : 'Add Candidate'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Candidates List */}
        {election ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-lg font-bold text-foreground">
                Candidates for {election.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {election.candidates.length} candidate(s) registered
              </p>
            </div>

            {election.candidates.length > 0 ? (
              <div className="divide-y divide-border">
                {election.candidates.map((candidate) => (
                  <div key={candidate.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        {candidate.symbol}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-accent">{candidate.party}</p>
                        <p className="text-sm text-muted-foreground mt-1">{candidate.description}</p>
                      </div>
                    </div>
                    {election.status === 'upcoming' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCandidate(candidate.id, candidate.name)}
                        disabled={!isAdmin || isRemoving === candidate.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title={isRemoving === candidate.id ? 'Removing...' : 'Remove candidate'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  No Candidates Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add candidates to this election to get started.
                </p>
                {canAddCandidate && (
                  <Button variant="outline" onClick={() => setShowAddForm(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add First Candidate
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">Select an election to manage candidates.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageCandidates;
