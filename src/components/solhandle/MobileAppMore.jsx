import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, TrendingUp, Store, Blocks, Info, ExternalLink, BarChart3, Clock, BookUser, Smartphone } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import useTokenLaunchSettings from '@/hooks/useTokenLaunchSettings';
import CommunityLinks from '@/components/solhandle/CommunityLinks';
import { useAuth } from '@/lib/AuthContext';

const links = [['Android app', '/android', Smartphone], ['My Contacts', '/contacts', BookUser], ['Market', '/market', Store], ['Integrations', '/integrations', Blocks], ['About us', '/about', Info], ['Statistics', '/statistics', BarChart3], ['Last minted', '/last-minted', Clock]];
const card = 'flex min-h-24 min-w-0 flex-col items-start justify-center gap-2 rounded-xl border border-names-accent/20 bg-card p-4 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-names-accent';
export default function MobileAppMore() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const visibleLinks = links.filter(([, path]) => path !== '/android' || user?.role === 'admin');
  const { tokenMint, loading } = useTokenLaunchSettings();
  const active = open || links.some(([, path]) => pathname === path || pathname.startsWith(`${path}/`));
  useEffect(() => { setOpen(false); }, [pathname]);
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild><button type="button" aria-label={t('More')} className={`mobile-app-tab ${active ? 'mobile-app-tab-active' : ''}`}><Menu className="h-5 w-5" aria-hidden="true"/><span>{t('More')}</span></button></SheetTrigger>
    <SheetContent side="bottom" className="dark z-[70] max-h-[80dvh] overflow-y-auto rounded-t-2xl border-names-accent/25 bg-hero-canvas text-foreground md:hidden" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}>
      <SheetTitle className="pr-8 text-foreground">{t('More')}</SheetTitle>
      <SheetDescription className="mt-1 text-muted-foreground">SolHandle</SheetDescription>
      <nav aria-label={t('More')} className="mt-5 grid grid-cols-2 gap-3">
        {tokenMint ? <a href={`https://dexscreener.com/solana/${tokenMint}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={card}><TrendingUp className="h-5 w-5 text-names-accent"/><span className="flex items-center gap-2">{t('Trade')}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true"/></span><span className="text-xs font-normal text-muted-foreground">DexScreener</span></a> : <button type="button" disabled className={`${card} opacity-50`}><TrendingUp className="h-5 w-5"/>{t('Trade')}<span className="text-xs font-normal">{t(loading ? 'Loading…' : 'Not available')}</span></button>}
        {visibleLinks.map(([label, path, Icon]) => <Link key={path} to={path} onClick={() => setOpen(false)} aria-current={pathname === path ? 'page' : undefined} className={card}><Icon className="h-5 w-5 text-names-accent"/>{t(label)}</Link>)}
      </nav>
      <div className="mt-5 border-t border-border pt-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t('Community')}</h3>
        <CommunityLinks iconsOnly includeTelegram onNavigate={() => setOpen(false)} />
      </div>
    </SheetContent>
  </Sheet>;
}