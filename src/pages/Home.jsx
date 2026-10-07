import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, WalletCards } from "lucide-react";
import Header from "@/components/solhandle/Header";
import HomeBurnNotice from "@/components/solhandle/HomeBurnNotice";
import HandleSearch from "@/components/solhandle/HandleSearch";
import PayMilestoneCard from "@/components/solhandle/PayMilestoneCard";
import AmbassadorBanner from "@/components/solhandle/AmbassadorBanner";
import FeatureCards from "@/components/solhandle/FeatureCards";
import RecentHandles from "@/components/solhandle/RecentHandles";
import LatestMarketplaceListings from "@/components/solhandle/LatestMarketplaceListings";
import BrandProtectionBanner from "@/components/solhandle/BrandProtectionBanner";
import HomeTokenPreview from "@/components/solhandle/HomeTokenPreview";
import HeroIdentityMark from "@/components/solhandle/HeroIdentityMark";
import AttoHomeInvite from "@/components/solhandle/AttoHomeInvite";
import MainnetContracts from "@/components/solhandle/MainnetContracts";
import ProtocolDistribution from "@/components/solhandle/ProtocolDistribution";
import { captureReferralAttribution } from "@/lib/referralAttribution";
import { Image } from "@/components/ui/image";
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
import MobileHomeActions from '@/components/solhandle/MobileHomeActions';
import FocusedHomeHero from '@/components/solhandle/FocusedHomeHero';

// Set to false to restore the original desktop hero; its markup is preserved below.
const FOCUSED_DESKTOP_HERO = false;

export default function Home() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1280px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)');
    const update = () => setDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => { captureReferralAttribution().catch(() => null); }, []);
  return <main className="min-h-screen bg-[#050811] text-white"><div className="relative mx-auto min-h-screen max-w-7xl border-x border-white/10 bg-[radial-gradient(circle_at_15%_20%,rgba(36,177,190,.13),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(130,58,255,.15),transparent_30%)]"><Header onConnected={setWallet}/><PublicHandleMintRecovery/><div className="relative flex flex-col px-5 py-6 sm:block sm:py-14 md:px-9 md:py-20"><div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-40 [background-image:linear-gradient(135deg,transparent_42%,rgba(81,245,217,.12),transparent_45%),linear-gradient(45deg,transparent_50%,rgba(154,80,255,.12),transparent_53%)]"/>{FOCUSED_DESKTOP_HERO && desktop ? <FocusedHomeHero wallet={wallet}/> : <div className="relative grid items-start gap-10 lg:items-stretch lg:grid-cols-[1.72fr_1.15fr] lg:gap-8"><div className="hidden items-center gap-10 sm:grid lg:grid-cols-[1fr_.72fr] lg:gap-8"><section><p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1 text-xs text-cyan-200"><BadgeCheck className="h-3.5 w-3.5"/>NFT-native identity on Solana</p><h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Claim your @<br/><span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">on Solana.</span></h1><p className="mt-6 max-w-md leading-relaxed text-slate-400">Replace a long Solana wallet address with a unique @handle. Search, claim, and own yours.</p><p className="mt-4 flex items-center gap-3 text-lg" aria-label="From a long wallet address to @ansem"><span className="font-mono text-slate-400">7xKp…9mWq</span><ArrowRight className="h-5 w-5 text-names-accent" aria-hidden="true"/><span className="font-semibold text-names-accent">@ansem</span></p><AttoHomeInvite/><div className="mt-7 space-y-4 text-sm text-slate-300"><div className="flex items-center gap-3"><WalletCards className="text-emerald-300"/>NFT-backed Solana identity</div><div className="flex items-center gap-3"><ArrowRight className="text-violet-300"/>Resolves to your wallet on Solana</div></div></section><HeroIdentityMark/><div className="hidden lg:col-span-2 lg:block"><MainnetContracts/><AmbassadorBanner/></div></div><div className="max-sm:order-1 lg:flex lg:flex-col"><div id="search-handles" className="relative mt-16 scroll-mt-40 sm:mt-12 lg:mt-10 lg:scroll-mt-0"><Image src="https://base44.app/api/apps/6a86b7e4bcec5dfac8ee9a44/files/mp/public/6a86b7e4bcec5dfac8ee9a44/6dcbf94ad_solhandle-hero-original-correct-cap.png" alt="" aria-hidden="true" className="solhandle-mascot-blend pointer-events-none absolute -top-20 right-2 h-32 w-32 sm:-top-24 sm:h-40 sm:w-40 lg:right-5" fittingType="fit"/><div className="relative z-10 lg:[&>section]:p-7 lg:[&>section]:border-cyan-300/80 lg:[&>section]:shadow-cyan-400/30 lg:[&_h2]:text-2xl lg:[&_label]:py-4 lg:[&_label_input]:text-lg"><HandleSearch wallet={wallet}/><Link to="/search" className="mt-3 hidden text-right text-sm text-names-accent hover:underline lg:block">Find your SolHandle →</Link></div></div><div className="sm:hidden"><h1 className="mt-6 text-center font-heading text-2xl font-semibold tracking-tight">Claim your @<br/><span className="bg-gradient-to-r from-names-success via-names-accent to-names-secondary bg-clip-text text-transparent">on Solana.</span></h1><p className="mt-3 text-center text-sm leading-relaxed text-slate-400">Replace a long Solana wallet address with a unique @handle. Search, claim, and own yours.</p><p className="mt-3 flex items-center justify-center gap-3" aria-label="From a long wallet address to @ansem"><span className="font-mono text-slate-400">7xKp…9mWq</span><ArrowRight className="h-4 w-4 text-names-accent" aria-hidden="true"/><span className="font-semibold text-names-accent">@ansem</span></p><AttoHomeInvite/></div><MobileHomeActions/><div className="hidden sm:block"><PayMilestoneCard/></div></div></div>}<div className="relative mt-7 hidden sm:block lg:hidden"><MainnetContracts/><AmbassadorBanner/></div><div className="relative order-2 mt-5 sm:order-none sm:mt-12"><HomeBurnNotice/></div><div className="relative order-1 mt-5 sm:order-none sm:mt-8"><FeatureCards wallet={wallet}/></div><div className="relative mt-8 hidden gap-4 lg:grid lg:grid-cols-2"><HomeTokenPreview/><BrandProtectionBanner/></div><div className="relative mt-5 grid gap-5 sm:mt-10 lg:grid-cols-2"><RecentHandles/><LatestMarketplaceListings/></div><div className="hidden sm:block"><ProtocolDistribution/></div></div></div></main>;
}