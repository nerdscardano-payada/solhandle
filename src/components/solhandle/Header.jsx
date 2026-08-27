import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Brand from "@/components/solhandle/Brand";
import WalletButton from "@/components/solhandle/WalletButton";
import { useAuth } from "@/lib/AuthContext";

export default function Header({ onConnected }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["Search", "/"], ["Explore", "/explore"], ["My Handles", "/my-handles"], ["Brand Protection", "/protected-brands"], ["Integrate", "/integrations"], ["Developers", "/developers"], ["Docs", "/docs"], ...(user?.role === "admin" ? [["Admin", "/admin"]] : [])];
  const linkClass = ({ isActive }) => `border-b-2 pb-1 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`;
  return <header className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-9"><Brand /><nav className="hidden items-center gap-5 md:flex">{links.map(([label, path]) => <NavLink key={path} to={path} className={linkClass}>{label}</NavLink>)}</nav><div className="flex items-center gap-3"><span className="hidden text-xs text-emerald-300 sm:inline">MAINNET BETA</span><WalletButton onConnected={onConnected} /><button type="button" onClick={() => setMenuOpen((open) => !open)} className="text-slate-300 md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>{menuOpen && <nav className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-slate-950 px-5 py-4 shadow-xl md:hidden">{links.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className={({ isActive }) => `block border-l-2 py-3 pl-4 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400"}`}>{label}</NavLink>)}</nav>}</header>;
}