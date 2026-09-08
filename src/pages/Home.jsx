import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, WalletCards } from "lucide-react";
import Header from "@/components/solhandle/Header";
import HandleSearch from "@/components/solhandle/HandleSearch";
import FeatureCards from "@/components/solhandle/FeatureCards";
import RecentHandles from "@/components/solhandle/RecentHandles";
import BrandProtectionBanner from "@/components/solhandle/BrandProtectionBanner";
import HeroIdentityMark from "@/components/solhandle/HeroIdentityMark";
import MainnetContracts from "@/components/solhandle/MainnetContracts";
import ProtocolDistribution from "@/components/solhandle/ProtocolDistribution";
import { captureReferralAttribution } from "@/lib/referralAttribution";

export default function Home() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");
  useEffect(() => { captureReferralAttribution().catch(() => null); }, []);
  return <main className="min-h-screen bg-[#050811] text-white"><div className="relative mx-auto min-h-screen max-w-7xl border-x border-white/10 bg-[radial-gradient(circle_at_15%_20%,rgba(36,177,190,.13),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(130,58,255,.15),transparent_30%)]"><Header onConnected={setWallet}/><div className="relative px-5 py-14 md:px-9 md:py-20"><div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-40 [background-image:linear-gradient(135deg,transparent_42%,rgba(81,245,217,.12),transparent_45%),linear-gradient(45deg,transparent_50%,rgba(154,80,255,.12),transparent_53%)]"/><div className="relative grid items-start gap-10 lg:grid-cols-[1.72fr_1.15fr] lg:gap-8"><div className="grid items-center gap-10 lg:grid-cols-[1fr_.72fr] lg:gap-8"><section><p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1 text-xs text-cyan-200"><BadgeCheck className="h-3.5 w-3.5"/>NFT-native identity on Solana</p><h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Your @<br/><span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">on Solana.</span></h1><p className="mt-6 max-w-md leading-relaxed text-slate-400">Search, claim, and own your NFT-backed Solana handle. Your name, your identity, your future.</p><div className="mt-7 space-y-4 text-sm text-slate-300"><div className="flex items-center gap-3"><WalletCards className="text-emerald-300"/>NFT-backed Solana identity</div><div className="flex items-center gap-3"><ArrowRight className="text-violet-300"/>Resolves to your wallet on Solana</div></div></section><HeroIdentityMark/><div className="hidden lg:col-span-2 lg:block"><MainnetContracts/></div></div><HandleSearch wallet={wallet}/></div><div className="relative mt-7 lg:hidden"><MainnetContracts/></div><div className="relative mt-12"><FeatureCards wallet={wallet}/></div><div className="relative mt-6"><BrandProtectionBanner/></div><RecentHandles/><ProtocolDistribution/></div></div></main>;
}