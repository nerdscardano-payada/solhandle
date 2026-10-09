import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import TokenContractAddress from '@/components/solhandle/TokenContractAddress';
import useTokenLaunchSettings from '@/hooks/useTokenLaunchSettings';

export default function HomeMobileToken() {
  const { tokenMint, loading } = useTokenLaunchSettings();
  return <section className="home-content-section md:hidden" aria-labelledby="mobile-token-title">
    <div className="rounded-xl border border-names-secondary/20 bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="mobile-token-title" className="text-base font-semibold text-names-secondary">$HANDLE</h2>
        <Link to="/upcoming/token-launch" className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-names-accent">Trade $HANDLE<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
      </div>
      <p className="mb-3 text-xs text-foreground">The SolHandle community token.</p>
      {loading ? <p role="status" className="text-xs text-muted-foreground">Loading contract address…</p> : tokenMint ? <TokenContractAddress tokenMint={tokenMint} className="!mb-0"/> : <p className="text-xs text-muted-foreground">Contract address currently unavailable.</p>}
    </div>
  </section>;
}