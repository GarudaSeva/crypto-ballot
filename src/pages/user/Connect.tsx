import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Vote, ArrowLeft, Shield, CheckCircle, AlertCircle, Fingerprint, User } from 'lucide-react';

const Connect = () => {
  const { isConnected, connectWallet, isConnecting } = useWallet();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected && !isSuccess) {
      navigate('/user/dashboard');
    }
  }, [isConnected, navigate, isSuccess]);

  const handleAction = async () => {
    logout(); // Clear any existing Admin/Voter session before trying new auth
    if (mode === 'register' && !name) {
      setError('Please enter your full name');
      return;
    }
    if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setError('');
    try {
      await connectWallet(aadhaarNumber, name);
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message.includes('pending admin approval') || err.message.includes('Registration submitted')) {
        setIsSuccess(true);
      } else {
        setError(err.message || 'Action failed');
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Registration Submitted!</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Your identity mapping (Aadhaar + Wallet) has been sent to the Election Commission for verification.
          </p>
          <div className="bg-muted/50 rounded-2xl p-6 text-sm text-left border border-border space-y-3 mb-8">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-bold text-warning">Pending Admin Verification</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aadhaar:</span>
              <span className="font-mono">XXXX-XXXX-{aadhaarNumber.slice(-4)}</span>
            </div>
          </div>
          <Button variant="default" className="w-full py-6 text-lg" onClick={() => window.location.reload()}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-accent/80 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
            <Vote className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white tracking-tight">CRYPTO BALLOT</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest leading-none">Blockchain Secure</p>
          </div>
        </Link>

        <div className="max-w-md relative z-10">
          <h2 className="font-display text-5xl font-bold text-white mb-6 leading-tight">
            Secure Your Vote With Identity Mapping
          </h2>
          <p className="text-white/80 text-xl mb-10 font-light leading-relaxed">
            We link your Aadhaar number to your crypto wallet to ensure one person, one vote. Permanent, private, and powerful.
          </p>

          <div className="space-y-6">
            {[
              { text: 'Unique ID mapping (Aadhaar)', desc: 'Prevents multiple account creation' },
              { text: 'Admin Gated Access', desc: 'Every voter is verified by the commission' },
              { text: 'Zero Knowledge Privacy', desc: 'Your vote data is encrypted on blockchain' },
              { text: 'Real-time Verification', desc: 'Watch your block being mined instantly' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="mt-1 bg-accent/20 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">{item.text}</p>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs relative z-10">
          © 2025 Crypto Ballot Election System. Built for Democracy.
        </p>
      </div>

      {/* Right Panel - Connect Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl relative animate-in fade-in zoom-in duration-500">
          <Link to="/" className="flex lg:hidden items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Vote className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {mode === 'login' ? 'Voter Login' : 'Secure Signup'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? 'Enter your details to access the portal' 
                : 'Join the next-generation voting network'}
            </p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-muted rounded-xl mb-10">
            <button 
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Register
            </button>
          </div>

          <div className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2 px-1">
                  <User className="w-4 h-4 text-primary" />
                  Full Name (As per Aadhaar)
                </label>
                <Input
                  id="name"
                  placeholder="Rahul Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-muted/50 border-border focus:ring-primary/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="aadhaar" className="text-sm font-semibold text-foreground flex items-center gap-2 px-1">
                <Fingerprint className="w-4 h-4 text-primary" />
                12-Digit Aadhaar Number
              </label>
              <Input
                id="aadhaar"
                placeholder="1234 5678 9012"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                maxLength={12}
                className="text-center text-lg tracking-[0.2em] font-mono h-14 bg-muted/50 border-border focus:ring-primary/20"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3 text-destructive text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <Button
              variant="wallet"
              size="xl"
              className="w-full gap-3 py-8 group relative overflow-hidden"
              onClick={handleAction}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                    alt="MetaMask" 
                    className="w-6 h-6 group-hover:scale-110 transition-transform"
                  />
                  {mode === 'login' ? 'Connect & Login' : 'Verify & Register'}
                </>
              )}
            </Button>

            <div className="flex items-start gap-3 bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p className="font-bold text-foreground mb-1">Privacy Guarantee</p>
                <p>We never store your biometric data. The Aadhaar number is only used as a unique identifier for the secure ledger.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
