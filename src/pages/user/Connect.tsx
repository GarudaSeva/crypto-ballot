import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Vote, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const Connect = () => {
  const { isConnected, connectWallet, isConnecting } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate('/user/dashboard');
    }
  }, [isConnected, navigate]);

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-accent/80 blockchain-pattern p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Vote className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">E-Voting</h1>
            <p className="text-white/70 text-xs">Blockchain Secured</p>
          </div>
        </Link>

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-bold text-white mb-6">
            Connect Your Wallet to Vote
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Your MetaMask wallet serves as your secure digital identity. No passwords to remember — your wallet is your key.
          </p>

          <div className="space-y-4">
            {[
              'One wallet address = One vote per election',
              'All votes are permanently recorded on blockchain',
              'Your identity remains anonymous',
              'Verify your vote on-chain anytime',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/60 text-sm">
          © 2025 E-Voting System. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Connect Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Vote className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Voter Login
            </h1>
            <p className="text-muted-foreground">
              Connect your MetaMask wallet to access the voting portal
            </p>
          </div>

          <div className="space-y-6">
            <Button
              variant="wallet"
              size="xl"
              className="w-full gap-3"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                    alt="MetaMask" 
                    className="w-6 h-6"
                  />
                  Connect MetaMask
                </>
              )}
            </Button>

            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Don't have MetaMask?</p>
                  <p>
                    Download the MetaMask browser extension from{' '}
                    <a 
                      href="https://metamask.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      metamask.io
                    </a>
                    {' '}to get started.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-success/5 rounded-xl p-4 border border-success/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Your Security Matters</p>
                  <p className="text-muted-foreground">
                    We never ask for your private keys or seed phrase. Only connect to trusted websites.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Are you an administrator?{' '}
            <Link to="/admin/login" className="text-primary hover:underline font-medium">
              Login as Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connect;
