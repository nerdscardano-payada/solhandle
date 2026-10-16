import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Link, useLocation } from 'react-router-dom';
import { Fingerprint, ArrowUpRight, QrCode, Wallet } from 'lucide-react';
import MobileAppMore from '@/components/solhandle/MobileAppMore';
import { useMobileTabs } from '@/components/solhandle/navigation/MobileTabProvider';

const tabs = [['Mint', '/', Fingerprint], ['Send', '/pay', ArrowUpRight], ['Receive', '/receive', QrCode], ['My Handles', '/my-handles', Wallet]];
export default function MobileAppNavigation() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const navigation = useMobileTabs();
  return <div className="mobile-app-navigation dark lg:hidden">
    <nav className="mobile-app-tabs" aria-label={t('App navigation')}>
      {tabs.map(([label, to, Icon]) => {
        const active = navigation?.enabled ? navigation.activeTab === to : pathname === to || (to === '/' && pathname === '/search');
        return <Link key={to} to={navigation?.enabled ? navigation.target(to) : to} onClick={event => { if (navigation?.enabled && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); navigation.selectTab(to); } }} aria-current={active ? 'page' : undefined} className={`mobile-app-tab ${active ? 'mobile-app-tab-active' : ''}`}><Icon className="h-5 w-5" aria-hidden="true"/><span>{t(label)}</span></Link>;
      })}
      <MobileAppMore/>
    </nav>
  </div>;
}