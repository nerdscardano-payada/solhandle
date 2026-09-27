import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function HomeBurnNotice() {
  const { data, isLoading } = useQuery({
    queryKey: ['home-flywheel-burn'],
    queryFn: async () => (await base44.functions.invoke('flywheelStats', {})).data,
    staleTime: 60_000,
  });
  const burn = data?.burnProofs?.find(item => item.type === 'BURN');
  if (!isLoading && !burn) return null;

  return <section className="relative overflow-hidden rounded-2xl border border-orange-300/40 bg-gradient-to-r from-orange-950/55 via-slate-900/95 to-violet-950/55 px-5 py-5 shadow-[0_0_38px_rgba(249,115,22,0.18)] sm:px-7" aria-label="Latest on-chain burn">
    <div className="relative flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-orange-300/40 bg-orange-400/15 shadow-[0_0_28px_rgba(251,146,60,0.35)]" aria-hidden="true"><Flame className="buyback-burn-flicker h-10 w-10 text-orange-300 drop-shadow-[0_0_12px_rgba(251,146,60,0.95)]"/></span>
        {isLoading ? <span className="text-sm text-slate-400">Loading burn activity…</span> : <div><p className="text-xs font-semibold uppercase tracking-widest text-orange-300">On-chain burn</p><p className="mt-1 text-lg font-semibold text-white sm:text-xl">{Number(burn.token_amount).toLocaleString('en-US', { maximumFractionDigits: 9 })} $HANDLE burned</p></div>}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {burn && <a href={`https://solscan.io/tx/${burn.signature}`} target="_blank" rel="noopener noreferrer" className="text-orange-200 underline underline-offset-2 hover:text-white">View transaction <ArrowUpRight className="inline h-4 w-4"/></a>}
        <Link to="/flywheel" className="font-semibold text-violet-200 underline underline-offset-2 hover:text-white">Explore the Flywheel <ArrowUpRight className="inline h-4 w-4"/></Link>
      </div>
    </div>
  </section>;
}