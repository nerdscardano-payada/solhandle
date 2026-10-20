import { ChevronDown } from "lucide-react";
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { NavLink } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { developerLinks as links, canViewNavigationLink } from '@/components/solhandle/navigationLinks';
import { useAuth } from '@/lib/AuthContext';

export default function DevelopersMenu() {
  const { t } = useLanguage();
  const { user } = useAuth();
  return <DropdownMenu><DropdownMenuTrigger className="flex items-center gap-1 border-b-2 border-transparent pb-1 text-sm text-slate-400 outline-none hover:text-white">{t('Developers')} <ChevronDown className="h-3.5 w-3.5" /></DropdownMenuTrigger><DropdownMenuContent align="start" className="border-white/10 bg-slate-950 text-slate-200">{links.filter(([, path]) => canViewNavigationLink(path, user)).map(([label, path]) => <DropdownMenuItem key={path} asChild className="focus:bg-white/10 focus:text-white"><NavLink to={path}>{t(label)}</NavLink></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>;
}