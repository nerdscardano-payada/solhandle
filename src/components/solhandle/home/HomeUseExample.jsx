import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, Send } from 'lucide-react';

export default function HomeUseExample() {
  return <section className="home-content-section">
    <div className="grid grid-cols-2 items-center gap-12">
      <div><h2 className="home-section-title">A name people can actually use.</h2><p className="max-w-md text-base leading-relaxed text-foreground/75">Share your @name instead of a long address. SolHandle Pay resolves it to the current owner's wallet so people can send you SOL.</p><Link to="/pay" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-names-accent">Try SolHandle Pay <ArrowRight className="h-4 w-4"/></Link></div>
      <div aria-label="Example: a wallet address becomes a memorable handle used to receive SOL"><div className="flex items-center gap-3 text-sm text-foreground/60"><Wallet className="h-5 w-5"/><span className="font-mono">7xA9…N5aP</span><span>Example address</span></div><div className="my-4 flex items-center gap-5"><ArrowRight className="h-6 w-6 text-names-secondary"/><span className="home-gradient-text text-5xl font-black">@ansem</span></div><p className="flex items-center gap-3 text-sm text-foreground"><Send className="h-5 w-5 text-names-accent"/>Receive SOL through SolHandle Pay</p></div>
    </div>
    <p className="mt-6 text-xs leading-relaxed text-foreground/65">Example only. @name support depends on the app; not every Solana wallet supports SolHandle. Always check the resolved recipient before signing.</p>
    <ol className="mt-6 flex items-center gap-4 border-t border-names-accent/10 pt-5 text-sm text-foreground/80" aria-label="Claim your SolHandle">{['Search', 'Connect', 'Mint', 'Use'].map((step, index) => <li key={step} className="flex items-center gap-4">{index > 0 && <ArrowRight className="h-4 w-4 text-names-accent" aria-hidden="true"/>}<span>{step}</span></li>)}</ol>
  </section>;
}