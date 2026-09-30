import { ChevronDown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const links = [['Earn', '/earn'], ['Pay', '/pay']];

export default function UtilityMenu() {
  const { pathname } = useLocation();
  const active = links.some(([, path]) => pathname === path);
  return <DropdownMenu>
    <DropdownMenuTrigger className={`dark flex items-center gap-1 border-b-2 pb-1 text-sm outline-none hover:text-foreground ${active ? 'border-names-success text-foreground' : 'border-transparent text-muted-foreground'}`}>Utility <ChevronDown className="h-3.5 w-3.5" /></DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="dark border-border bg-card text-card-foreground">{links.map(([label, path]) => <DropdownMenuItem key={path} asChild className="focus:bg-accent focus:text-accent-foreground"><NavLink to={path}>{label}</NavLink></DropdownMenuItem>)}</DropdownMenuContent>
  </DropdownMenu>;
}