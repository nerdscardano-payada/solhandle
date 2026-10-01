import { Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { Search, Wallet } from "lucide-react";

export default function HandlesOnboarding({ wallet }) {
  const { connecting } = useWallet();
  return <section className="mt-5 rounded-xl border border-names-accent/30 bg-names-accent/10 p-4">
    <h2 className="text-lg font-semibold">{wallet ? "No @handle yet?" : "Connect your wallet"}</h2>
    <p className="mt-1 text-sm text-names-accent">{wallet ? "Search one and claim your Solana identity." : "View your handles, or search for your first @handle."}</p>
    <div className="mt-4 flex flex-wrap gap-3">
      {!wallet && <button type="button" disabled={connecting} onClick={() => window.dispatchEvent(new CustomEvent("solhandle:connect-wallet"))} className="inline-flex items-center gap-2 rounded-lg border border-names-accent/40 bg-names-accent/10 px-4 py-2 text-sm font-semibold text-names-accent disabled:opacity-50"><Wallet className="h-4 w-4"/>{connecting ? "Connecting…" : "Connect Wallet"}</button>}
      <Link to="/#search-handles" className="inline-flex items-center gap-2 rounded-lg border border-names-secondary/40 bg-names-secondary/10 px-4 py-2 text-sm font-semibold text-names-secondary"><Search className="h-4 w-4"/>Search one</Link>
    </div>
  </section>;
}