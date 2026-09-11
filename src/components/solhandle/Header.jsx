import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Brand from "@/components/solhandle/Brand";
import DevelopersMenu from "@/components/solhandle/DevelopersMenu";
import MoreMenu from "@/components/solhandle/MoreMenu";
import HeaderExternalLinks from "@/components/solhandle/HeaderExternalLinks";
import WalletButton from "@/components/solhandle/WalletButton";

const links = [["Search", "/"], ["Directory", "/directory"], ["Explore", "/explore"], ["My Handles", "/my-handles"], ["Earn", "/earn"], ["Upcoming", "/upcoming"]];
const developerLinks = [["Integrate SolHandle", "/integrations"], ["SDK / API", "/developers"], ["Documentation", "/docs"]];
const moreLinks = [["Brand Protection", "/protected-brands"], ["About / How it works", "/about"], ["FAQ", "/faq"]];

export default function Header({ onConnected }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass = ({ isActive }) => `border-b-2 pb-1 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`;
  return <header className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 lg:px-9"><Brand /><nav className="hidden items-center gap-5 lg:flex">{links.map(([label, path]) => <NavLink key={path} to={path} className={linkClass}>{label}</NavLink>)}<DevelopersMenu /><MoreMenu /></nav><div className="flex items-center gap-3"><HeaderExternalLinks/><span className="hidden text-xs text-emerald-300 sm:inline">MAINNET</span><WalletButton onConnected={onConnected} /><button type="button" onClick={() => setMenuOpen((open) => !open)} className="text-slate-300 lg:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>{menuOpen && <nav className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-slate-950 px-5 py-4 shadow-xl lg:hidden">{links.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className={({ isActive }) => `block border-l-2 py-3 pl-4 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400"}`}>{label}</NavLink>)}<p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Developers</p>{developerLinks.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className="block py-2 pl-7 text-sm text-slate-400">{label}</NavLink>)}<p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">More</p>{moreLinks.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className="block py-2 pl-7 text-sm text-slate-400">{label}</NavLink>)}</nav>}</header>;
}