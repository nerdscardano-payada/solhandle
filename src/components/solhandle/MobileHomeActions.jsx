import { Link } from "react-router-dom";
import { ArrowRight, WalletCards, Store, Coins, Code2 } from "lucide-react";

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
      <span className="min-w-0 flex-1 font-semibold">$HANDLE Token</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-names-success" />
    </Link>
    <Link to="/developers" className="flex items-center gap-3 rounded-xl border border-names-secondary/30 bg-names-secondary/10 p-4">
      <Code2 className="h-5 w-5 shrink-0 text-names-secondary" />
      <span className="min-w-0 flex-1 font-semibold">Developers / SDK</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-names-secondary" />
    </Link>
  </nav>;
}