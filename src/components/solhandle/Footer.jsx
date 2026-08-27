import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function Footer() {
  return <footer className="relative overflow-hidden border-t border-cyan-300/25 bg-[#030615] px-5 py-10 text-sm text-slate-300 shadow-[0_-12px_40px_rgba(45,212,191,0.10)] md:px-9">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/3ccebb01d_image.png" alt="Abstract cyan and violet Solana waves" className="pointer-events-none absolute inset-0 h-full w-full opacity-65" fittingType="fill"/>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030615]/75 via-[#030615]/45 to-[#030615]/80"/>
    <div className="relative z-10 mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><p className="text-base font-semibold text-white">SolHandle</p><p className="mt-3 max-w-sm leading-relaxed">NFT-native identity infrastructure for Solana. Pre-launch product; no handles are currently offered for sale.</p></div>
      <nav><p className="mb-3 font-medium text-white">Explore</p><div className="space-y-2"><Link to="/docs" className="block hover:text-cyan-200">Documentation</Link><Link to="/developers" className="block hover:text-cyan-200">Developers</Link><Link to="/integrations" className="block hover:text-cyan-200">Integration Center</Link><Link to="/faq" className="block hover:text-cyan-200">FAQ</Link><Link to="/contact" className="block hover:text-cyan-200">Contact</Link></div></nav>
      <nav><p className="mb-3 font-medium text-white">Legal</p><div className="space-y-2"><Link to="/legal" className="block hover:text-cyan-200">Legal notice & disclaimer</Link><Link to="/privacy" className="block hover:text-cyan-200">Privacy policy</Link></div></nav>
    </div>
    <div className="relative z-10 mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-5 text-xs sm:flex-row sm:justify-between"><span>© 2026 SolHandle. Pre-launch.</span><Link to="/contact" className="hover:text-cyan-200">Contact</Link></div>
  </footer>;
}