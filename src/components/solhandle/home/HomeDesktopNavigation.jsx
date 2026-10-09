import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import TokenGrowthMenu from '@/components/solhandle/TokenGrowthMenu';
import { aboutLinks, communityLinks } from '@/components/solhandle/navigationLinks';
import DiscoverMenu from '@/components/solhandle/DiscoverMenu';
import DevelopersMenu from '@/components/solhandle/DevelopersMenu';
const main = [['Marketplace', '/market'], ['Pay', '/pay'], ['Integrations', '/live-integrations'], ['My Handles', '/my-handles']];
const groups = [['About & Support', aboutLinks], ['Community', communityLinks]];
export default function HomeDesktopNavigation({ funnel = false }) {
  const { t } = useLanguage();
  const visibleMain = funnel ? main.filter(([, path]) => path !== '/live-integrations') : main;
  const visibleGroups = funnel ? [['Integrations', [['Supported integrations', '/live-integrations']]], ...groups] : groups;
  return <nav className="dark hidden min-w-0 flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:flex" aria-label="Main navigation"><DiscoverMenu/>{visibleMain.map(([label, path]) => <NavLink key={path} to={path} className={({ isActive }) => `border-b-2 pb-1 text-sm ${isActive ? 'border-names-accent text-names-accent' : 'border-transparent text-foreground/75 hover:text-names-accent'}`}>{t(label)}</NavLink>)}<TokenGrowthMenu/><DevelopersMenu/><DropdownMenu><DropdownMenuTrigger className="flex items-center gap-1 pb-1 text-sm text-foreground/75">{t('More')}<ChevronDown className="h-3.5 w-3.5"/></DropdownMenuTrigger><DropdownMenuContent className="dark max-h-96 overflow-y-auto border-border bg-card text-card-foreground"><div className="p-2"><LanguageSelector/></div><DropdownMenuSeparator/>{visibleGroups.map(([title, items], index) => <div key={t(title)}>{index > 0 && <DropdownMenuSeparator/>}<DropdownMenuLabel className="text-xs text-muted-foreground">{t(title)}</DropdownMenuLabel>{items.map(([label, path]) => <DropdownMenuItem key={path} asChild>{path.startsWith('https://') ? <a href={path} target="_blank" rel="noopener noreferrer">{t(label)}</a> : <NavLink to={path}>{t(label)}</NavLink>}</DropdownMenuItem>)}</div>)}</DropdownMenuContent></DropdownMenu></nav>;
}