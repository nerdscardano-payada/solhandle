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

  return <div className="border-b border-orange-300/20 bg-gradient-to-r from-orange-400/10 via-slate-900/90 to-violet-400/10 px-5 py-2.5 md:px-9">
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-xs sm:text-sm">
      {isLoading ? <span className="text-slate-400">Loading burn activity…</span> : <div className="flex min-w-0 items-center gap-2 text-slate-200"><Flame className="h-4 w-4 shrink-0 text-orange-300" aria-hidden="true"/><span><strong className="text-orange-200">On-chain burn:</strong> {Number(burn.token_amount).toLocaleString('en-US', { maximumFractionDigits: 9 })} $HANDLE burned.</span></div>}
      <div className="flex items-center gap-4">
        {burn && <a href={`https://solscan.io/tx/${burn.signature}`} target="_blank" rel="noopener noreferrer" className="text-orange-200 underline underline-offset-2 hover:text-white">View transaction <ArrowUpRight className="inline h-3.5 w-3.5"/></a>}
        <Link to="/flywheel" className="font-semibold text-violet-200 underline underline-offset-2 hover:text-white">Explore the Flywheel <ArrowUpRight className="inline h-3.5 w-3.5"/></Link>
      </div>
    </div>
  </div>;
}