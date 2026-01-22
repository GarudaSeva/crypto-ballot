import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Vote, Shield, Users, BarChart3, ArrowRight, Lock, CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-primary via-primary/95 to-accent/80" />
        
        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Vote className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-white">E-Voting</h1>
                <p className="text-white/70 text-xs">Blockchain Secured</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/login">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Lock className="w-4 h-4" />
              Secured by Blockchain Technology
            </div>
            
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Vote, Your Voice,
              <br />
              <span className="text-accent">Immutable & Secure</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Experience transparent and tamper-proof elections with our blockchain-based voting system. 
              One wallet, one vote — ensuring democracy with cryptographic certainty.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/user/connect">
                <Button variant="wallet" size="xl" className="gap-3">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                    alt="MetaMask" 
                    className="w-6 h-6"
                  />
                  Connect with MetaMask
                </Button>
              </Link>
              <Link to="/user/guidelines">
                <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  How It Works
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Blockchain Voting?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our system combines the transparency of blockchain with user-friendly interfaces 
              to deliver a voting experience you can trust.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: 'Immutable Records',
                description: 'Every vote is permanently recorded on the blockchain, making tampering impossible.',
              },
              {
                icon: Lock,
                title: 'One Wallet, One Vote',
                description: 'Your unique wallet address ensures you can only vote once per election.',
              },
              {
                icon: Users,
                title: 'Anonymous Voting',
                description: 'Your vote is recorded without linking it to your personal identity.',
              },
              {
                icon: BarChart3,
                title: 'Real-time Results',
                description: 'View transparent, verifiable results directly from the blockchain.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-display font-bold text-lg text-foreground mb-3">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Voting on our platform is simple, secure, and takes just a few minutes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Connect Wallet',
                  description: 'Link your MetaMask wallet to verify your identity and eligibility.',
                },
                {
                  step: '02',
                  title: 'Cast Your Vote',
                  description: 'Select your preferred candidate and confirm the blockchain transaction.',
                },
                {
                  step: '03',
                  title: 'Verify on Chain',
                  description: 'Your vote is permanently recorded and can be verified on the blockchain.',
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-display font-bold text-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      {item.step}
                    </div>
                    <h4 className="font-display font-bold text-lg text-foreground mb-3">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border">
                      <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Election Types Preview */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Available Election Types
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Participate in various levels of democratic elections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🏘️', name: 'Village Elections', description: 'Panchayat & local body' },
              { icon: '🏛️', name: 'MLA Elections', description: 'State assembly members' },
              { icon: '📜', name: 'MLC Elections', description: 'Legislative council' },
              { icon: '🏙️', name: 'Municipal Elections', description: 'City corporations' },
            ].map((type, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <span className="text-4xl mb-4 block">{type.icon}</span>
                <h4 className="font-display font-bold text-foreground mb-1">{type.name}</h4>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-accent/80">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Cast Your Vote?
          </h3>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Connect your wallet and participate in the democratic process with complete transparency.
          </p>
          <Link to="/user/connect">
            <Button variant="wallet" size="xl" className="gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="w-6 h-6"
              />
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Vote className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground">E-Voting System</h4>
                <p className="text-xs text-muted-foreground">Blockchain-Based Secure Voting</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 E-Voting System. Transparent. Secure. Democratic.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/user/guidelines" className="hover:text-foreground transition-colors">
                Guidelines
              </Link>
              <Link to="/admin/login" className="hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
