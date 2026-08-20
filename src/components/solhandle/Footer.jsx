import { Link } from "react-router-dom";

export default function Footer() {
  return <footer className="border-t border-white/10 bg-slate-950/80 px-5 py-10 text-sm text-slate-400 md:px-9">
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><p className="text-base font-semibold text-white">SolHandle</p><p className="mt-3 max-w-sm leading-relaxed">NFT-native identity infrastructure for Solana. Pre-launch product; no handles are currently offered for sale.</p></div>
      <nav><p className="mb-3 font-medium text-white">Explore</p><div className="space-y-2"><Link to="/docs" className="block hover:text-cyan-200">Documentation</Link><Link to="/faq" className="block hover:text-cyan-200">FAQ</Link><Link to="/contact" className="block hover:text-cyan-200">Contact</Link></div></nav>
      <nav><p className="mb-3 font-medium text-white">Legal</p><div className="space-y-2"><Link to="/legal" className="block hover:text-cyan-200">Legal notice & disclaimer</Link><Link to="/privacy" className="block hover:text-cyan-200">Privacy policy</Link></div></nav>
    </div>
    <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-5 text-xs sm:flex-row sm:justify-between"><span>© 2026 SolHandle. Pre-launch.</span><a href="mailto:info@solhandle.io" className="hover:text-cyan-200">info@solhandle.io</a></div>
  </footer>;
}