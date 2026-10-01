import { Link } from "react-router-dom";
import { ArrowRight, WalletCards, Store, Coins, Code2, Send } from "lucide-react";

export default function MobileHomeActions() {
  return <nav aria-label="Handle actions" className="mt-5 grid gap-3 sm:hidden">
    <Link to="/my-handles" className="flex items-center gap-3 rounded-xl border border-names-secondary/30 bg-names-secondary/10 p-4">
      <WalletCards className="h-5 w-5 shrink-0 text-names-secondary" />
      <div className="min-w-0 flex-1"><span className="block font-semibold">My handles</span><span className="text-xs text-names-secondary">View, manage and sell your handles</span></div>
      <ArrowRight className="h-4 w-4 shrink-0 text-names-secondary" />
    </Link>
    <Link to="/market" className="flex items-center gap-3 rounded-xl border border-names-accent/30 bg-names-accent/10 p-4">
      <Store className="h-5 w-5 shrink-0 text-names-accent" />
      <div className="min-w-0 flex-1"><span className="block font-semibold">Market</span><span className="text-xs text-names-accent">Browse handles for sale</span></div>
      <ArrowRight className="h-4 w-4 shrink-0 text-names-accent" />
    </Link>
    <Link to="/upcoming/token-launch" className="flex items-center gap-3 rounded-xl border border-names-success/30 bg-names-success/10 p-4">
      <Coins className="h-5 w-5 shrink-0 text-names-success" />
      <div className="min-w-0 flex-1"><span className="block font-semibold">$HANDLE Token</span><span className="text-xs text-names-success">Explore the token powering SolHandle</span></div>
      <ArrowRight className="h-4 w-4 shrink-0 text-names-success" />
    </Link>
    <Link to="/pay" className="flex items-center gap-3 rounded-xl border border-burn-accent/30 bg-burn-accent/10 p-4">
      <Send className="h-5 w-5 shrink-0 text-burn-accent" />
      <div className="min-w-0 flex-1"><span className="block font-semibold">Pay</span><span className="text-xs text-burn-accent">Send and receive SOL with your @handle</span></div>
      <ArrowRight className="h-4 w-4 shrink-0 text-burn-accent" />
    </Link>
    <Link to="/developers" className="flex items-center gap-3 rounded-xl border border-names-warning/30 bg-names-warning/10 p-4">
      <Code2 className="h-5 w-5 shrink-0 text-names-warning" />
      <div className="min-w-0 flex-1"><span className="block font-semibold">Developers / SDK</span><span className="text-xs text-names-warning">Build with SolHandle’s SDK and API</span></div>
      <ArrowRight className="h-4 w-4 shrink-0 text-names-warning" />
    </Link>
  </nav>;
}