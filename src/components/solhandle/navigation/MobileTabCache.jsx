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
  const cache = useRef({ owner, generation: 0, tabs: new Map() });
  if (cache.current.owner !== owner) {
    // Initial connection keeps the active draft; switching/disconnecting wallets clears private state.
    if (cache.current.owner !== 'disconnected') cache.current = { owner, generation: cache.current.generation + 1, tabs: new Map() };
    else cache.current.owner = owner;
  }
  const tabs = cache.current.tabs;
  if (!navigation?.enabled) {
    tabs.clear();
    return <MobilePageTransition className={className}>{children}</MobilePageTransition>;
  }
  if (navigation.ready) tabs.set(navigation.activeTab, { children, className, location, version: navigation.cacheVersion });
  return <>{[...tabs].map(([tab, entry]) => {
    const active = tab === navigation.activeTab;
    return <div key={`${cache.current.generation}:${tab}:${entry.version}`} hidden={!active} data-mobile-tab-active={active ? 'true' : 'false'}>
      <MobilePageTransition location={entry.location} active={active} className={entry.className}>{entry.children}</MobilePageTransition>
    </div>;
  })}</>;
}