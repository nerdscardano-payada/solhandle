import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { tokenLinks } from '@/components/solhandle/navigationLinks';

export default function TokenGrowthMenu() {
  return <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1 border-b-2 border-transparent pb-1 text-sm text-names-secondary">$HANDLE<ChevronDown className="h-3.5 w-3.5" aria-hidden="true"/></DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="dark max-h-96 overflow-y-auto border-border bg-card text-card-foreground">
      {tokenLinks.map(([label, to]) => <DropdownMenuItem key={to} asChild><NavLink to={to}>{label}</NavLink></DropdownMenuItem>)}
    </DropdownMenuContent>
  </DropdownMenu>;
}