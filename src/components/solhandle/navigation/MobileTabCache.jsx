import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMobileTabs } from '@/components/solhandle/navigation/MobileTabProvider';
import MobilePageTransition from '@/components/solhandle/navigation/MobilePageTransition';

// Keep visited tab trees mounted: drafts, filters and local React state stay in memory.
// Never persist payment drafts or signing state to browser storage.
export default function MobileTabCache({ children, className }) {
  const location = useLocation();
  const navigation = useMobileTabs();
  const { publicKey } = useWallet();
  const owner = publicKey?.toBase58() || 'disconnected';
  const cache = useRef({ owner, tabs: new Map() });
  if (cache.current.owner !== owner) cache.current = { owner, tabs: new Map() };
  const tabs = cache.current.tabs;
  if (!navigation?.enabled) {
    tabs.clear();
    return <MobilePageTransition className={className}>{children}</MobilePageTransition>;
  }
  if (navigation.ready) tabs.set(navigation.activeTab, { children, className, location, version: navigation.cacheVersion });
  return <>{[...tabs].map(([tab, entry]) => {
    const active = tab === navigation.activeTab;
    return <div key={`${owner}:${tab}:${entry.version}`} hidden={!active} data-mobile-tab-active={active ? 'true' : 'false'}>
      <MobilePageTransition location={entry.location} active={active} className={entry.className}>{entry.children}</MobilePageTransition>
    </div>;
  })}</>;
}