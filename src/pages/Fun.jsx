import { Link } from 'react-router-dom';
import { LoaderCircle, RotateCw, Sparkles } from 'lucide-react';
import Header from '@/components/solhandle/Header';
import HandleWheel from '@/components/solhandle/fun/HandleWheel';
import useHandleWheel from '@/components/solhandle/fun/useHandleWheel';
import { lamportsToSol } from '@/lib/solhandle';

export default function Fun() {
  const game = useHandleWheel();
  const busy = game.phase !== 'idle';
  return <main className="dark min-h-screen bg-background text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border"><Header/>
    <section className="mx-auto max-w-2xl px-5 py-8 text-center sm:py-12">
      <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-names-secondary"><Sparkles className="h-4 w-4"/>Just for fun</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-5xl">Let your next @ find you.</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">Spin the Handle Wheel to pick a name from a selection of available handles. No wallet needed. No entry fee, prizes or free mints.</p>
      <div className="mt-8 rounded-3xl border border-names-secondary/25 bg-card p-4 sm:p-7">
        {game.loading ? <div className="flex min-h-64 items-center justify-center gap-2 text-muted-foreground"><LoaderCircle className="h-5 w-5 animate-spin"/>Finding available handles…</div> : game.names.length ? <HandleWheel names={game.names} rotation={game.rotation} onFinish={game.finish}/> : <p className="py-16 text-muted-foreground">No available handles could be loaded. Try again shortly.</p>}
        <button type="button" onClick={game.spin} disabled={busy || game.refreshing || !game.names.length} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-names-accent px-6 py-3 font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50">{busy || game.refreshing ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <RotateCw className="h-5 w-5"/>}{game.phase === 'spinning' ? 'Spinning…' : game.phase === 'checking' ? 'Checking availability…' : game.refreshing ? 'Loading names…' : 'Spin the wheel'}</button>
        {game.error && <p role="alert" className="mt-4 text-sm text-destructive">{game.error.response?.data?.error || game.error.message || 'Could not load names. Please try again.'}</p>}
        <div aria-live="polite" aria-atomic="true">{game.winner && <div className="mt-5 rounded-2xl border border-names-success/30 bg-names-success/5 p-5"><p className="text-xs uppercase tracking-wider text-names-success">Your random pick · available when checked</p><h2 className="mt-2 break-all font-display text-3xl font-semibold text-names-accent">@{game.winner.handle}</h2><p className="mt-2 text-sm text-muted-foreground">Mint price: {lamportsToSol(game.winner.priceLamports)} SOL</p><Link to={`/?claim=${encodeURIComponent(game.winner.handle)}`} className="mt-4 inline-flex rounded-xl border border-names-accent/30 bg-names-accent/10 px-5 py-2.5 font-semibold text-names-accent">Explore & mint this handle →</Link></div>}</div>
        <button type="button" onClick={game.reload} disabled={busy || game.refreshing} className="mt-5 text-sm text-names-secondary disabled:opacity-50">{game.error || !game.names.length ? 'Try loading names again' : 'Refresh wheel names'}</button>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">A playful name picker, not a raffle for ownership. Availability is checked again after each spin and before minting; names are not reserved. Automatic picks do not count toward search rankings.</p>
      <Link to="/names" className="mt-6 inline-block text-sm text-names-accent">Discover more names →</Link>
    </section>
  </div></main>;
}