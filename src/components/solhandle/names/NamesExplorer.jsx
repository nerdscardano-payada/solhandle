import Header from '@/components/solhandle/Header';
import ExploreMascot from '@/components/solhandle/ExploreMascot';
import NamesControls from '@/components/solhandle/names/NamesControls';
import NamesResults from '@/components/solhandle/names/NamesResults';
import NamesWatchGate from '@/components/solhandle/names/NamesWatchGate';
import useNamesExplorer from '@/components/solhandle/names/useNamesExplorer';
export default function NamesExplorer() {
  const state = useNamesExplorer();
  return <main className="dark min-h-screen bg-background text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border"><Header/><section className="px-5 py-12 md:px-9"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium tracking-wider text-names-accent">SOLHANDLE NAMES</p><h1 className="mt-2 text-4xl font-semibold font-heading">Discover a name worth owning.</h1><p className="mt-3 max-w-xl text-muted-foreground">Explore free and owned handles, follow your favorites, and inspect real interest before you mint or make an offer.</p></div><ExploreMascot/></div><NamesControls {...state}/>{state.tab === 'watchlist' && !state.authorization ? <NamesWatchGate wallet={state.wallet} busy={state.busy} error={state.authError} onVerify={state.verify}/> : <NamesResults state={state}/>}</section></div></main>;
}