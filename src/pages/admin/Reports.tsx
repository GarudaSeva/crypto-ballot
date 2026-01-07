import AdminSidebar from '@/components/Layout/AdminSidebar';
import { useElection } from '@/contexts/ElectionContext';
import { BarChart3, Download, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0d9488', '#1e3a5f', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const Reports = () => {
  const { elections } = useElection();

  const closedElections = elections.filter((e) => e.status === 'closed');

  const overallStats = {
    totalElections: elections.length,
    closedElections: closedElections.length,
    totalVotes: elections.reduce((sum, e) => 
      sum + e.candidates.reduce((cSum, c) => cSum + c.votes, 0), 0
    ),
    totalCandidates: elections.reduce((sum, e) => sum + e.candidates.length, 0),
  };

  const electionVoteData = elections.map((e) => ({
    name: e.name.length > 20 ? e.name.substring(0, 20) + '...' : e.name,
    votes: e.candidates.reduce((sum, c) => sum + c.votes, 0),
  }));

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Election Reports
            </h1>
            <p className="text-muted-foreground">
              Analytics and insights from blockchain-verified data
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Elections</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              {overallStats.totalElections}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              {overallStats.closedElections}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Total Votes</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              {overallStats.totalVotes.toLocaleString()}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-info" />
              <span className="text-sm text-muted-foreground">Candidates</span>
            </div>
            <p className="text-3xl font-display font-bold text-foreground">
              {overallStats.totalCandidates}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Votes by Election Bar Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-foreground mb-6">
              Votes by Election
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={electionVoteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="votes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Election Status Pie Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-foreground mb-6">
              Election Status Distribution
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: elections.filter(e => e.status === 'active').length },
                      { name: 'Upcoming', value: elections.filter(e => e.status === 'upcoming').length },
                      { name: 'Closed', value: elections.filter(e => e.status === 'closed').length },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    <Cell fill="hsl(160, 84%, 39%)" />
                    <Cell fill="hsl(199, 89%, 48%)" />
                    <Cell fill="hsl(215, 16%, 47%)" />
                  </Pie>
                  <Legend />
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Election-wise Detailed Reports */}
        {closedElections.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-bold text-foreground mb-6">
              Detailed Election Reports
            </h2>
            <div className="space-y-6">
              {closedElections.map((election) => {
                const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
                const pieData = election.candidates.map((c) => ({
                  name: c.name,
                  value: c.votes,
                }));

                return (
                  <div key={election.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-border bg-muted/30">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-display font-bold text-foreground">{election.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {election.candidates.length} candidates • {totalVotes.toLocaleString()} total votes
                          </p>
                        </div>
                        <span className="inline-flex px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                          Completed
                        </span>
                      </div>
                    </div>

                    <div className="p-6 grid lg:grid-cols-2 gap-6">
                      {/* Results Chart */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {pieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Results Table */}
                      <div>
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">
                                Candidate
                              </th>
                              <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">
                                Votes
                              </th>
                              <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">
                                %
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...election.candidates]
                              .sort((a, b) => b.votes - a.votes)
                              .map((candidate, index) => (
                                <tr key={candidate.id} className="border-b border-border/50">
                                  <td className="py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{candidate.symbol}</span>
                                      <div>
                                        <p className="font-medium text-foreground">{candidate.name}</p>
                                        <p className="text-xs text-muted-foreground">{candidate.party}</p>
                                      </div>
                                      {index === 0 && (
                                        <span className="ml-2 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                                          Winner
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 text-right font-mono text-foreground">
                                    {candidate.votes.toLocaleString()}
                                  </td>
                                  <td className="py-3 text-right font-mono text-muted-foreground">
                                    {totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0}%
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {closedElections.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">
              No Completed Elections Yet
            </h3>
            <p className="text-muted-foreground">
              Detailed reports will appear here once elections are completed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
