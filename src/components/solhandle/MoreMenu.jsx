import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const links = [["Discord Verification", "/discord-verify"], ["Brand Protection", "/protected-brands"], ["About / How it works", "/about"], ["FAQ", "/faq"]];

export default function MoreMenu() {
  return <DropdownMenu><DropdownMenuTrigger className="flex items-center gap-1 border-b-2 border-transparent pb-1 text-sm text-slate-400 outline-none hover:text-white">More <ChevronDown className="h-3.5 w-3.5" /></DropdownMenuTrigger><DropdownMenuContent align="start" className="border-white/10 bg-slate-950 text-slate-200">{links.map(([label, path]) => <DropdownMenuItem key={path} asChild className="focus:bg-white/10 focus:text-white"><NavLink to={path}>{label}</NavLink></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>;
}