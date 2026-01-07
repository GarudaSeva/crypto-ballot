import { Link } from 'react-router-dom';
import UserNavbar from '@/components/Layout/UserNavbar';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Vote, 
  Shield, 
  Lock, 
  Eye, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

const Guidelines = () => {
  const { isConnected } = useWallet();

  const content = (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {!isConnected && (
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        )}

        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Voting Guidelines
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about voting on our blockchain-based platform.
          </p>
        </div>

        {/* MetaMask Section */}
        <section className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                What is MetaMask?
              </h2>
              <p className="text-muted-foreground text-sm">
                Your gateway to blockchain voting
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="mb-4">
              MetaMask is a secure digital wallet that allows you to interact with blockchain applications. 
              It acts as your unique identifier in the voting system, ensuring that your vote is securely 
              recorded on the blockchain.
            </p>
            
            <h3 className="font-display text-lg font-semibold text-foreground mt-6 mb-3">
              How to Install MetaMask
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Visit <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">metamask.io</a></li>
              <li>Click "Download" and select your browser (Chrome, Firefox, Edge, or Brave)</li>
              <li>Add the extension to your browser</li>
              <li>Create a new wallet and securely store your recovery phrase</li>
              <li>Set a strong password for your wallet</li>
            </ol>
          </div>

          <a 
            href="https://metamask.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-primary hover:underline"
          >
            Download MetaMask
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>

        {/* How Voting Works */}
        <section className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Vote className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                How Blockchain Voting Works
              </h2>
              <p className="text-muted-foreground text-sm">
                Transparent and tamper-proof elections
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Lock,
                title: 'Immutable Records',
                description: 'Once your vote is recorded on the blockchain, it cannot be altered, deleted, or tampered with by anyone.',
              },
              {
                icon: Eye,
                title: 'Transparent Counting',
                description: 'All votes are publicly verifiable on the blockchain, ensuring complete transparency in the counting process.',
              },
              {
                icon: Wallet,
                title: 'One Wallet = One Vote',
                description: 'Your wallet address serves as your unique voter ID. You can only vote once per election.',
              },
              {
                icon: Shield,
                title: 'Anonymous Voting',
                description: 'While your wallet address is recorded, your personal identity is never linked to your vote.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-muted/30 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step by Step */}
        <section className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            Step-by-Step Voting Process
          </h2>

          <div className="space-y-4">
            {[
              { step: '1', title: 'Connect Your Wallet', description: 'Click "Connect MetaMask" and approve the connection request in your wallet.' },
              { step: '2', title: 'Browse Elections', description: 'View available elections and select the one you want to participate in.' },
              { step: '3', title: 'Review Candidates', description: 'Read about each candidate before making your decision.' },
              { step: '4', title: 'Cast Your Vote', description: 'Click "Vote" on your preferred candidate and confirm the transaction in MetaMask.' },
              { step: '5', title: 'Transaction Confirmation', description: 'Wait for the blockchain to confirm your transaction. This usually takes a few seconds.' },
              { step: '6', title: 'Vote Recorded', description: 'Your vote is now permanently recorded on the blockchain and can be verified anytime.' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-display font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Tips */}
        <section className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-success" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Security Tips
              </h2>
              <p className="text-muted-foreground text-sm">
                Keep your vote secure
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              'Never share your wallet\'s private key or recovery phrase with anyone.',
              'Only connect your wallet to official voting platforms.',
              'Verify the website URL before connecting your wallet.',
              'Keep your MetaMask extension and browser updated.',
              'Log out of your wallet after completing your vote.',
              'Use a strong, unique password for your MetaMask wallet.',
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="bg-warning/5 border border-warning/20 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-warning" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Troubleshooting
              </h2>
              <p className="text-muted-foreground text-sm">
                Common issues and solutions
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">MetaMask popup doesn't appear?</h4>
              <p className="text-sm text-muted-foreground">
                Make sure MetaMask extension is installed and enabled. Try clicking the MetaMask icon in your browser toolbar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Transaction is pending for too long?</h4>
              <p className="text-sm text-muted-foreground">
                Blockchain transactions can take time during high network activity. Please wait patiently or check the transaction status in MetaMask.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Transaction failed?</h4>
              <p className="text-sm text-muted-foreground">
                Ensure you have sufficient balance for gas fees. If the issue persists, try refreshing the page and reconnecting your wallet.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );

  if (isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <UserNavbar />
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {content}
    </div>
  );
};

export default Guidelines;
