import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TokenHandleLaunchCta() {
  return <section className="dark mt-8 rounded-2xl border border-names-secondary/30 bg-gradient-to-r from-names-secondary/10 to-names-accent/5 p-5 text-foreground">
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-names-secondary"><ShieldCheck className="h-4 w-4"/>For token projects · Coming soon</p>
    <h2 className="mt-3 font-heading text-xl font-semibold">Your ticker. Your verified mint.</h2>
    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Explore the planned $-namespace for verified token identity. A non-transferable binding to your exact Solana mint, not a token launch or a guarantee of token safety.</p>
    <Link to="/developers/token-handles" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-names-accent">Verify your ticker as $HANDLE <ArrowRight className="h-4 w-4"/></Link>
    <p className="mt-3 text-xs text-muted-foreground">View the plan and pricing. Claims remain disabled until the independent Mainnet audit and launch approval.</p>
  </section>;
}