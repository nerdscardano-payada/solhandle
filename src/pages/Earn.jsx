import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/solhandle/Header";
import ReferralDashboard from "@/components/solhandle/ReferralDashboard";
import EarnWays from "@/components/solhandle/EarnWays";
import { base44 } from "@/api/base44Client";

export default function Earn() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || ""); const [handles, setHandles] = useState([]);
  useEffect(() => { if (wallet) base44.functions.invoke("getOwnerHandles", { wallet }).then((res) => setHandles(res.data.handles || [])).catch(() => setHandles([])); else setHandles([]); }, [wallet]);
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border"><Header onConnected={setWallet}/>
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-9 lg:py-12">
      <header className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-widest text-names-accent">SolHandle · Share & Earn</p><h1 className="mt-4 text-3xl font-semibold tracking-tight lg:text-5xl">Earn with your own @handle.</h1><p className="mt-4 text-base leading-7 text-muted-foreground lg:text-lg">Turn your SolHandle into a personal referral link. Invite people to claim their own @name, and earn commission on eligible mints when the program is live.</p></header>
      <EarnWays/>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">Start in 3 steps: connect your wallet, choose your @handle, then share your link or add the embed. The same reward rules apply to both.</p>
      <section id="ambassador-dashboard" className="mt-10 scroll-mt-24"><h2 className="text-2xl font-semibold">Your handle. Your referral link.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Connect using the wallet that owns your SolHandle to activate your link and manage your earnings.</p><ReferralDashboard wallet={wallet} handles={handles}/></section>
      <footer className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm text-muted-foreground"><Link to="/referral-terms" className="text-names-accent">Reward rules →</Link><Link to="/earn-litepaper">Full program details →</Link><Link to="/leaderboard">Leaderboard →</Link></footer>
    </div>
  </div></main>;
}