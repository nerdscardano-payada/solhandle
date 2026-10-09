import { NavLink, Outlet } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
const links = [['Overzicht', '/quests'], ['Dashboard', '/quests/dashboard'], ['Quests', '/quests/explore'], ['Seizoenen', '/quests/seasons'], ['Ranglijst', '/quests/leaderboard'], ['Regels', '/quests/rules']];
export default function GrowthHubContent() {
  const { error } = useGrowthHub();
  return <main className="dark min-h-screen bg-background text-foreground font-body"><div className="mx-auto max-w-7xl"><Header/>
    <div className="px-5 py-8 lg:px-9 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-widest text-names-accent">SolHandle / Growth Hub</p><span className="rounded-full border border-names-secondary/40 px-3 py-1 text-xs text-names-secondary">Core pilot · geen tokenclaims</span></div>
      <nav aria-label="Growth Hub" className="my-7 flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-4">{links.map(([label, to]) => <NavLink key={to} to={to} end={to === '/quests'} className={({ isActive }) => `text-sm ${isActive ? 'text-names-accent font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>{label}</NavLink>)}</nav>
      {error && <p role="alert" className="mb-5 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">{error}</p>}
      <Outlet/>
    </div></div></main>;
}