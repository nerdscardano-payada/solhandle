import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import DiscoverMenu from '@/components/solhandle/DiscoverMenu';
import DevelopersMenu from '@/components/solhandle/DevelopersMenu';
const main = [['Marketplace', '/market'], ['Pay', '/pay'], ['Integrations', '/live-integrations'], ['My Handles', '/my-handles']];
const groups = [
  [['About', '/about'], ['FAQ', '/faq'], ['Roadmap', '/roadmap'], ['Brand Protection', '/protected-brands']],
  [['$HANDLE', '/upcoming/token-launch'], ['Share & Earn', '/earn'], ['Earn Litepaper', '/earn-litepaper'], ['Growth Curve', '/growth'], ['Burn Dashboard', '/growth/burn'], ['Flywheel', '/flywheel'], ['Mint Weekend · Proof archive', '/mint-weekend']]
];
export default function HomeDesktopNavigation() {
  return <nav className="dark hidden items-center gap-5 lg:flex" aria-label="Main navigation"><DiscoverMenu/>{main.map(([label, path]) => <NavLink key={path} to={path} className={({ isActive }) => `border-b-2 pb-1 text-sm ${isActive ? 'border-names-accent text-names-accent' : 'border-transparent text-foreground/75 hover:text-names-accent'}`}>{label}</NavLink>)}<DevelopersMenu/><DropdownMenu><DropdownMenuTrigger className="flex items-center gap-1 pb-1 text-sm text-foreground/75">More<ChevronDown className="h-3.5 w-3.5"/></DropdownMenuTrigger><DropdownMenuContent className="dark max-h-96 overflow-y-auto border-border bg-card text-card-foreground">{groups.map((items, index) => <div key={index}>{index > 0 && <DropdownMenuSeparator/>}{items.map(([label, path]) => <DropdownMenuItem key={path} asChild><NavLink to={path}>{label}</NavLink></DropdownMenuItem>)}</div>)}</DropdownMenuContent></DropdownMenu></nav>;
}