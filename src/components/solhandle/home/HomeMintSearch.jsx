import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { lamportsToSol, validateHandle } from '@/lib/solhandle';
import HandleCard from '@/components/solhandle/HandleCard';

export default function HomeMintSearch({ input, onChange, handle, result, launch, onMint, onTokenMint, onOfficialClaim, onCheck }) {
  const empty = !handle;
  const checking = result?.state === 'checking' || result?.handle !== handle;
  const available = !checking && result?.available;
  const claimed = !checking && result?.status === 'CLAIMED';
  const reserved = !checking && ['RESERVED', 'PROTECTED'].includes(result?.status);
  return <div id="search-handles" className="home-mint-search scroll-mt-8">
    <form onSubmit={(event) => {event.preventDefault();onCheck();}} className="home-search-form">
      <label className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4"><span className="text-2xl text-names-accent">@</span><input id="home-handle-input" value={input.replace(/^@+/, '')} onChange={(event) => onChange(event.target.value.replace(/^@+/, ''))} placeholder="yourname" aria-label="Search your @ name" autoComplete="off" spellCheck={false} className="min-w-0 w-full bg-transparent text-foreground outline-none text-3xl md:text-2xl" /></label>
      <button disabled={Boolean(validateHandle(handle))} className="home-primary-button">Check availability <ArrowRight className="h-4 w-4" /></button>
    </form>
    <div aria-live="polite" className="mt-4">
      {empty ? <p className="text-sm text-foreground/75">Search your @ name</p> : result?.state === 'invalid' ? <p className="text-sm text-destructive">{result.message}</p> : checking ? <p className="flex items-center gap-2 text-sm text-names-accent"><LoaderCircle className="h-4 w-4 animate-spin" />Checking @{handle}...</p> : available ? <div className="home-result-card"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex min-w-0 items-center gap-2 text-xl font-bold"><Check className="h-5 w-5 text-names-success" /><span className="break-all">@{handle} is available</span></h2><b className="text-xl text-names-accent">{lamportsToSol(result.priceLamports)} SOL</b></div><div className="home-mint-artwork lg:hidden"><HandleCard handle={handle} /></div><p className="mt-2 text-xs text-foreground/70">One-time name price · No renewals</p><p className="mt-2 hidden text-xs text-foreground/70 lg:block">Network and NFT account costs are additional. Review the estimated SOL total before signing.</p><button onClick={onMint} disabled={!launch.isLive} className="home-primary-button mt-4 w-full">{launch.isLive ? `Mint @${handle}` : 'Minting opens at launch'}<ArrowRight className="h-4 w-4" /></button>{launch.isLive && <button onClick={onTokenMint} className="mt-3 text-xs text-names-secondary">Prefer to pay with $HANDLE?</button>}</div> : result?.listing ? <div className="home-result-card"><p className="break-all text-lg font-semibold">@{handle} is available on the marketplace.</p><b className="mt-2 block text-names-secondary">{lamportsToSol(result.listing.price_lamports)} SOL</b><Link to={`/market?handle=${encodeURIComponent(handle)}`} className="home-primary-button mt-4">View listing →</Link></div> : claimed ? <div className="home-result-card"><p className="break-all text-lg font-semibold">@{handle} has already been claimed.</p><Link to={`/${handle}`} className="mt-3 inline-flex text-names-accent">View Handle →</Link></div> : reserved ? <div className="home-result-card"><p className="break-all">@{handle} is {result.status === 'PROTECTED' ? 'a protected brand name' : 'reserved'}.</p>{result.status === 'RESERVED' && onOfficialClaim && <button onClick={onOfficialClaim} className="home-primary-button mt-4">Request official claim</button>}</div> : <p className="home-result-card text-sm">Availability could not be verified. Please check again.</p>}
    </div>
    {empty && <><p className="mt-3 hidden text-xs leading-relaxed text-foreground/70 lg:block">Prices vary by name length and premium status. Search to see your name's price. Solana network and NFT account costs are additional.</p></>}
  </div>;
}