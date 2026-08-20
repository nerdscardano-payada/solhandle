import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import Brand from "@/components/solhandle/Brand";
import WalletButton from "@/components/solhandle/WalletButton";

export default function Header({ onConnected }) {
  const links = [["Search", "/"], ["My Handles", "/my-handles"], ["Docs", "/docs"]];
  return <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-9"><Brand /><nav className="hidden items-center gap-8 md:flex">{links.map(([label, path]) => <NavLink key={path} to={path} className={({isActive}) => `border-b-2 pb-1 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>{label}</NavLink>)}</nav><div className="flex items-center gap-3"><span className="hidden text-xs text-slate-500 sm:inline">DEVNET READY</span><WalletButton onConnected={onConnected} /><Menu className="h-5 w-5 text-slate-300 md:hidden" /></div></header>;
}