import AdminSidebar from '@/components/Layout/AdminSidebar';
import { 
  Vote, 
  Users, 
  Shield, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Database,
  FileText
} from 'lucide-react';

const AdminGuidelines = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Admin Guidelines
            </h1>
            <p className="text-muted-foreground">
              Best practices and instructions for managing the e-voting system
            </p>
          </div>

          {/* Election Management */}
          <section className="bg-card border border-border rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Vote className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Managing Elections
                </h2>
                <p className="text-muted-foreground text-sm">
                  Creating and controlling election lifecycle
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Creating Elections</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Provide a clear and descriptive election name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Set accurate start and end dates (elections start in "Upcoming" status)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>Add all candidates before starting the election</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Election Lifecycle</h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-info/10 text-info rounded-full font-medium">Upcoming</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full font-medium">Active</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full font-medium">Closed</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  You can manually start (activate) and end (close) elections using the control buttons.
                </p>
              </div>
            </div>
          </section>

          {/* Candidate Management */}
          <section className="bg-card border border-border rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Managing Candidates
                </h2>
                <p className="text-muted-foreground text-sm">
                  Adding and organizing election candidates
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Candidates can only be added to elections in "Upcoming" status</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Candidates can be removed before the election starts</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <span>Once an election is active, candidates cannot be added or removed</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Provide accurate information for each candidate (name, party, description)</span>
              </div>
            </div>
          </section>

          {/* Blockchain Integrity */}
          <section className="bg-card border border-border rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                <Database className="w-7 h-7 text-success" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Blockchain Integrity
                </h2>
                <p className="text-muted-foreground text-sm">
                  How blockchain ensures vote integrity
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/30 rounded-xl p-5">
                <Lock className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Immutable Records</h4>
                <p className="text-sm text-muted-foreground">
                  All votes are permanently stored on the blockchain and cannot be altered or deleted by anyone, including administrators.
                </p>
              </div>
              <div className="bg-muted/30 rounded-xl p-5">
                <Shield className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Transparent Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Every vote can be independently verified on the blockchain, ensuring complete transparency in the election process.
                </p>
              </div>
            </div>
          </section>

          {/* Admin Limitations */}
          <section className="bg-warning/5 border border-warning/20 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-warning" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Admin Limitations
                </h2>
                <p className="text-muted-foreground text-sm">
                  What administrators cannot do
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">✗</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Cannot modify votes:</strong> Once a vote is cast on the blockchain, it cannot be changed, deleted, or manipulated.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">✗</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Cannot see who voted for whom:</strong> Votes are anonymous and not linked to voter identities.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">✗</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Cannot cast votes on behalf of voters:</strong> Each voter must cast their own vote using their wallet.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive font-bold">✗</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Cannot modify results:</strong> Results are directly calculated from blockchain data and cannot be altered.
                </span>
              </li>
            </ul>
          </section>

          {/* Best Practices */}
          <section className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Best Practices
                </h2>
                <p className="text-muted-foreground text-sm">
                  Recommendations for smooth election management
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                'Test the voting process with a sample election before launching official ones',
                'Announce election dates well in advance to give voters time to prepare',
                'Verify all candidate information before starting the election',
                'Monitor active elections for any technical issues',
                'Keep the voter guidelines page up to date',
                'Export and archive reports after each election completes',
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminGuidelines;
