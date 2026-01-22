import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vote, ArrowLeft, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error('Invalid credentials', {
        description: error.message || 'Please check your email and password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-accent/80  p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Vote className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">E-Voting</h1>
            <p className="text-white/70 text-xs">Admin Portal</p>
          </div>
        </Link>

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-bold text-white mb-6">
            Election Administration Portal
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Manage elections, candidates, and view comprehensive reports with full transparency.
          </p>

          <div className="space-y-4">
            {[
              'Create and manage multiple elections',
              'Add and organize candidates',
              'Real-time voting statistics',
              'Blockchain-verified results',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/60 text-sm">
          © 2025 E-Voting System. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Admin Login
            </h1>
            <p className="text-muted-foreground">
              Sign in to access the election management dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@crypto.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Demo credentials:</strong><br />
              Email: admin@crypto.local<br />
              Password: admin123
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Are you a voter?{' '}
            <Link to="/user/connect" className="text-primary hover:underline font-medium">
              Connect Wallet
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
