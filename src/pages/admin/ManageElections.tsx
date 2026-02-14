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
import { Plus, Vote, Calendar, Play, Square, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const ManageElections = () => {
  const { elections, addElection, updateElectionStatus } = useElection();
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'village' as Election['type'],
    description: '',
    startDate: '',
    endDate: '',
  });

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      await addElection({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'upcoming',
      });

      toast.success('Election Created!', {
        description: `${formData.name} has been added successfully.`,
      });

      setFormData({
        name: '',
        type: 'village',
        description: '',
        startDate: '',
        endDate: '',
      });
      setShowCreateForm(false);
    } catch (error: any) {
      toast.error('Failed to create election', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (electionId: string, newStatus: Election['status']) => {
    try {
      await updateElectionStatus(electionId, newStatus);
      toast.success(`Election status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error('Failed to update election status', {
        description: error.message || 'Please try again.',
      });
    }
  };

  const typeOptions = [
    { value: 'village', label: 'Village Election', icon: '🏘️' },
    { value: 'mla', label: 'MLA Election', icon: '🏛️' },
    { value: 'mlc', label: 'MLC Election', icon: '📜' },
    { value: 'municipal', label: 'Municipal Election', icon: '🏙️' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Manage Elections
            </h1>
            <p className="text-muted-foreground">
              Create, start, and manage elections
            </p>
          </div>
          <Button
            variant="gradient"
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
            disabled={!isAdmin}
          >
            <Plus className="w-4 h-4" />
            Create Election
          </Button>
          {!isAdmin && (
            <p className="text-xs text-muted-foreground mt-2">
              Login as admin to create elections
            </p>
          )}
        </div>

        {/* Create Election Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Create New Election
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleCreateElection} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Election Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Village Panchayat Election 2025"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Election Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Election['type']) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the election..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateForm(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" className="flex-1" disabled={!isAdmin || isCreating}>
                    {isCreating ? 'Creating...' : 'Create Election'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Elections List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Election
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Period
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Candidates
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {elections.map((election) => (
                  <tr key={election.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Vote className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{election.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {election.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-muted-foreground">{election.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(election.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(election.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold",
                        election.status === 'active' && 'bg-success/10 text-success',
                        election.status === 'upcoming' && 'bg-info/10 text-info',
                        election.status === 'closed' && 'bg-muted text-muted-foreground'
                      )}>
                        {election.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {election.candidates.length}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {election.status === 'upcoming' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleStatusChange(election.id, 'active')}
                            className="gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Start
                          </Button>
                        )}
                        {election.status === 'active' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(election.id, 'closed')}
                            className="gap-1"
                          >
                            <Square className="w-3 h-3" />
                            End
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageElections;
