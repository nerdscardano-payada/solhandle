import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import Header from '@/components/solhandle/Header';
import BurnDashboardContent from '@/components/solhandle/BurnDashboardContent';
export default function BurnDashboard() {
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border"><Header/><section className="mx-auto max-w-6xl px-5 py-6 sm:py-20">
    <Link to="/growth" className="text-sm text-burn-secondary">← Back to Growth Curve</Link>
    <p className="mt-5 flex items-center sm:mt-8 gap-2 text-xs font-semibold uppercase tracking-widest text-burn-accent"><Flame aria-hidden="true" className="h-4 w-4"/>Growth · token burns</p>
    <h1 className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-5xl">$HANDLE <span className="text-burn-highlight">Burn Dashboard</span></h1>
    <p className="mt-4 hidden max-w-2xl leading-relaxed text-muted-foreground sm:block">See how much $HANDLE has been permanently removed from supply, where recorded burns come from, and the on-chain proof behind each transaction.</p>
    <BurnDashboardContent/>
  </section></div></main>;
}