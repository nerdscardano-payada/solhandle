import { useState } from "react";
import { useLanguage } from '@/components/i18n/LanguageProvider';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { mobileGroups as groups } from '@/components/solhandle/navigationLinks';
import CommunityLinks from '@/components/solhandle/CommunityLinks';

const mainLinks = [["Search handles", "/search"], ["Discover names", "/names"], ["Marketplace", "/market"], ["My Handles", "/my-handles"], ["$HANDLE Token", "/upcoming/token-launch"]];

export default function MobileNavigation({ onNavigate, tokenIsLive }) {
  const [expanded, setExpanded] = useState({});
  const { t } = useLanguage();
  return <nav className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-white/10 bg-slate-950 px-5 py-4 shadow-xl lg:hidden" aria-label="Mobile navigation">
    <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('Main pages')}</p>
    <div className="dark px-4 py-2"><LanguageSelector/></div>
    {mainLinks.map(([label, path]) => <NavLink key={path} to={path} onClick={() => { onNavigate(); if (path === "/#search-handles" && window.location.pathname === "/") window.setTimeout(() => document.getElementById("search-handles")?.scrollIntoView({ behavior: "smooth" }), 0); }} className={({ isActive }) => `block border-l-2 py-2.5 pl-4 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400"} ${path === "/upcoming/token-launch" && tokenIsLive ? "font-semibold text-emerald-300" : ""}`}>{t(label)}{path === "/upcoming/token-launch" && tokenIsLive && <span className="ml-2 rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9px] tracking-wider text-emerald-200">LIVE</span>}</NavLink>)}
    <div className="mt-3 border-t border-white/10 pt-2">
      {groups.map(([title, items]) => <div key={title}>
        <button type="button" onClick={() => setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))} aria-expanded={!!expanded[title]} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-300">{t(title)}<ChevronDown className={`h-4 w-4 transition-transform ${expanded[title] ? "rotate-180" : ""}`} /></button>
        {expanded[title] && <div className="pb-2">{items.map(([label, path]) => <NavLink key={path} to={path} onClick={onNavigate} className={({ isActive }) => `block border-l-2 py-2 pl-7 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400"}`}>{t(label)}</NavLink>)}</div>}
      </div>)}
    </div>
    <div className="mt-3 border-t border-white/10 pt-4"><p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{t('Community')}</p><CommunityLinks onNavigate={onNavigate}/></div>
  </nav>;
}