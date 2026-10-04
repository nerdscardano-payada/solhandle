import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandProtectionBanner() {
  return <section className="dark relative overflow-hidden rounded-2xl border border-names-accent/25 bg-gradient-to-br from-names-accent/10 via-background to-names-secondary/10 p-5 text-foreground">
    <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-names-accent"/><p className="text-xs font-semibold uppercase tracking-widest text-names-accent">Identity protection</p></div>
    <h2 className="mt-3 font-heading text-xl font-semibold">Protect your name. Verify your token.</h2>
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="min-w-0"><p className="font-mono text-2xl font-semibold text-names-accent">@name</p><h3 className="mt-2 text-sm font-semibold">Brand protection</h3><p className="mt-2 text-sm text-muted-foreground">Reserved names for verified organizations, protected from impersonation.</p><Link to="/protected-brands" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-names-accent">View directory <ArrowRight className="h-4 w-4 shrink-0"/></Link></div>
      <div className="min-w-0 border-l border-names-secondary/20 pl-4"><p className="font-mono text-2xl font-semibold text-names-secondary">$SYMBOL</p><h3 className="mt-2 text-sm font-semibold">Token verification</h3><p className="mt-2 text-sm text-muted-foreground">Planned: one verified ticker bound to one exact Solana mint.</p><Link to="/developers/token-handles" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-names-secondary">Token Handles <ArrowRight className="h-4 w-4 shrink-0"/></Link></div>
    </div>
    <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">Token Handles are not live. Applications and registration remain disabled pending an independent Mainnet audit and launch approval.</p>
  </section>;
}