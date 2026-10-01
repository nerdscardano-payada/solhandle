import useTokenSupply from '@/hooks/useTokenSupply';

const format = value => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(value);

export default function TokenSupply({ tokenMint }) {
  const { supply, status } = useTokenSupply(tokenMint);
  return <div className="mt-5 rounded-2xl border border-violet-300/20 bg-slate-900/60 p-5">
    <p className="text-sm text-violet-200">Current on-chain total supply</p>
    <p className="mt-2 text-2xl font-semibold text-white">{status === 'live' && Number.isFinite(supply) ? `${format(supply)} $HANDLE` : status === 'loading' ? 'Checking Solana…' : 'Temporarily unavailable'}</p>
    <p className="mt-2 hidden text-xs leading-relaxed text-slate-400 sm:block">Read from the official token mint on Solana, refreshed every minute. This measures current total supply after any on-chain burns, not circulating supply; circulation depends on how many tokens are held or locked.</p>
  </div>;
}