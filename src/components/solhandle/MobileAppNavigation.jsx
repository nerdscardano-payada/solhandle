import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Wallet, Menu, X } from 'lucide-react';
import MobileNavigation from '@/components/solhandle/MobileNavigation';
import useTokenLaunchSettings from '@/hooks/useTokenLaunchSettings';

const tabs = [['Home', '/', Home], ['Search', '/search', Search], ['Market', '/market', ShoppingBag], ['My handles', '/my-handles', Wallet]];
export default function MobileAppNavigation() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const { tokenMint } = useTokenLaunchSettings();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = event => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return <div className="mobile-app-navigation lg:hidden">
    {open && <><button type="button" className="mobile-app-menu-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)}/><div id="mobile-app-more" className="mobile-app-more"><MobileNavigation onNavigate={() => setOpen(false)} tokenIsLive={Boolean(tokenMint)}/></div></>}
    <nav className="mobile-app-tabs" aria-label="App navigation">
      {tabs.map(([label, to, Icon]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `mobile-app-tab ${isActive ? 'mobile-app-tab-active' : ''}`}><Icon className="h-5 w-5" aria-hidden="true"/><span>{t(label === 'Market' ? 'Marketplace' : label === 'My handles' ? 'My Handles' : label)}</span></NavLink>)}
      <button type="button" className={`mobile-app-tab ${open ? 'mobile-app-tab-active' : ''}`} aria-expanded={open} aria-controls="mobile-app-more" onClick={() => setOpen(value => !value)}>{open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}<span>{t('More')}</span></button>
    </nav>
  </div>;
}