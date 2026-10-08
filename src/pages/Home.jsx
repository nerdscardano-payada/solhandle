import { useEffect, useState } from 'react';
import Header from '@/components/solhandle/Header';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
import HomeMintHero from '@/components/solhandle/home/HomeMintHero';
import HomeBackdrop from '@/components/solhandle/home/HomeBackdrop';
import HomeFunnelSections from '@/components/solhandle/home/HomeFunnelSections';
import HomeActivity from '@/components/solhandle/home/HomeActivity';
import HomeEcosystem from '@/components/solhandle/home/HomeEcosystem';
import HomeDesktopContent from '@/components/solhandle/home/HomeDesktopContent';
import { captureReferralAttribution } from '@/lib/referralAttribution';
import { base44 } from '@/api/base44Client';
import '@/components/solhandle/home/home-funnel.css';

export default function Home() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width:1280px)').matches);
  useEffect(() => { const media = window.matchMedia('(min-width:1280px)'); const update = event => setDesktop(event.matches); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  useEffect(() => { captureReferralAttribution().catch(() => null); base44.analytics.track({ eventName: 'homepage_view', properties: { device: window.innerWidth < 1280 ? 'mobile' : 'desktop', source: new URLSearchParams(window.location.search).get('utm_source') || 'direct' } }); }, []);
  return <main className="home-funnel dark"><HomeBackdrop/><Header onConnected={setWallet} funnel/><PublicHandleMintRecovery/><HomeMintHero wallet={wallet}/><div className="home-content">{desktop ? <HomeDesktopContent/> : <><HomeFunnelSections/><HomeActivity/><HomeEcosystem/></>}</div></main>;
}