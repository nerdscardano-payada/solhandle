import { Link } from "react-router-dom";
import { useLanguage } from '@/components/i18n/LanguageProvider';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import { Image } from "@/components/ui/image";
import FooterNavigation from '@/components/solhandle/FooterNavigation';
import CommunityLinks from '@/components/solhandle/CommunityLinks';

export default function Footer() {
  const { t } = useLanguage();
  return <footer className="dark relative overflow-hidden border-t border-cyan-300/25 bg-[#030615] px-5 pt-10 pb-40 sm:pb-24 text-sm text-slate-300 shadow-[0_-12px_40px_rgba(45,212,191,0.10)] md:px-9">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/3ccebb01d_image.png" alt="Abstract cyan and violet Solana waves" className="pointer-events-none absolute inset-0 h-full w-full opacity-65" fittingType="fill"/>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030615]/75 via-[#030615]/45 to-[#030615]/80"/>
    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-base font-semibold text-white">SolHandle</p><p className="mt-3 max-w-sm leading-relaxed">{t('NFT-native identity infrastructure for Solana, live on Mainnet Beta. Claim, own and use your unique on-chain handle.')}</p></div><div><p className="mb-3 font-medium text-white">{t('Join the community')}</p><CommunityLinks iconsOnly/></div></div>
      <FooterNavigation/>
    </div>
    <div className="relative z-10 mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between"><span>{t('© 2026 SolHandle. Live on Solana Mainnet.')}</span><div className="flex items-center justify-end gap-4"><Link to="/contact" className="hover:text-cyan-200">{t('Contact')}</Link><LanguageSelector/></div></div>
  </footer>;
}