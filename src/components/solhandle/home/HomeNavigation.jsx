import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const links = [['Names', '/names'], ['Marketplace', '/market'], ['Pay', '/pay'], ['Developers', '/developers']];
const more = [['$HANDLE', '/upcoming/token-launch'], ['Growth', '/growth'], ['Share & Earn', '/earn'], ['FAQ', '/faq'], ['About', '/about']];
export default function HomeNavigation({ mobile = false, onNavigate }) {
  return <nav className={mobile ? 'absolute inset-x-0 top-full z-50 flex flex-col gap-4 border-b border-names-accent/20 bg-card p-5 lg:hidden' : 'hidden items-center gap-6 lg:flex'} aria-label="Homepage navigation">{links.map(([label, path]) => <NavLink key={path} to={path} onClick={onNavigate} className="text-sm text-foreground/80 hover:text-names-accent">{label}</NavLink>)}<DropdownMenu><DropdownMenuTrigger className="flex items-center gap-1 text-sm text-foreground/80">More<ChevronDown className="h-3 w-3"/></DropdownMenuTrigger><DropdownMenuContent className="dark border-names-accent/20 bg-card text-foreground">{more.map(([label, path]) => <DropdownMenuItem key={path} asChild><NavLink onClick={onNavigate} to={path}>{label}</NavLink></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu></nav>;
}