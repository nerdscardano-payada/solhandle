import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Link, useLocation } from 'react-router-dom';
import { Fingerprint, ArrowUpRight, QrCode, Wallet } from 'lucide-react';

const tabs = [['Mint', '/', Fingerprint], ['Send', '/pay', ArrowUpRight], ['Receive', '/receive', QrCode], ['My Handles', '/my-handles', Wallet]];
export default function MobileAppNavigation() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  return <div className="mobile-app-navigation dark lg:hidden">
    <nav className="mobile-app-tabs mobile-app-tabs-four" aria-label={t('App navigation')}>
      {tabs.map(([label, to, Icon]) => {
        const active = pathname === to || (to === '/' && pathname === '/search');
        return <Link key={to} to={to} aria-current={active ? 'page' : undefined} className={`mobile-app-tab ${active ? 'mobile-app-tab-active' : ''}`}><Icon className="h-5 w-5" aria-hidden="true"/><span>{t(label)}</span></Link>;
      })}
    </nav>
  </div>;
}