import { useEffect, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import useDemoLookup from '@/components/solhandle/demos/useDemoLookup';
import DemoPresentationScene from '@/components/solhandle/demos/DemoPresentationScene';
import DemoPresentationControls from '@/components/solhandle/demos/DemoPresentationControls';
import { demoCatalog } from '@/components/solhandle/demos/demoCatalog';
import usePresentationVoice from '@/components/solhandle/demos/usePresentationVoice';
export default function DemoPresentation({ slug, input, mode = 'resolve', rpcUrl = '', disabled = false }) {
  const [open, setOpen] = useState(false), [elapsed, setElapsed] = useState(-3), [paused, setPaused] = useState(false), [replay, setReplay] = useState(0);
  const { result, error, stage, lookup, reset } = useDemoLookup(); const demo = demoCatalog.find(item => item.slug === slug);
  const voice = usePresentationVoice({ open, result, elapsed, paused, slug, mode, rpcUrl });
  useEffect(() => {
    if (!open || !result || paused) return;
    const start = performance.now(), offset = elapsed;
    const timer = setInterval(() => { const next = Math.min(24, offset + (performance.now() - start) / 1000); setElapsed(next); if (next >= 24) clearInterval(timer); }, 100);
    return () => clearInterval(timer);
  }, [open, result, paused, replay]);
  function launch() { setElapsed(-3); setPaused(false); setOpen(true); lookup(input, mode, false, rpcUrl); }
  function close() { setOpen(false); reset(); setElapsed(-3); setPaused(false); }
  function restart() { setElapsed(-3); setPaused(false); setReplay(value => value + 1); }
  return <div className="mt-4"><Button type="button" variant="outline" disabled={disabled || !input.trim()} onClick={launch} className="min-h-11 border-names-accent/40 text-names-accent"><Play/>Play automatic presentation</Button><p className="mt-2 text-xs text-muted-foreground">24 seconds + 3-second countdown after a fresh lookup. Record the presentation window yourself; no video file is generated.</p><Dialog open={open} onOpenChange={value => { if (!value) close(); }}><DialogContent className="dark left-0 top-0 h-[100dvh] max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-none border-0 bg-background p-4 text-foreground sm:rounded-none md:p-6"><header className="space-y-2 pr-8"><div className="flex flex-wrap items-center justify-between gap-2"><DialogTitle className="font-heading text-lg font-semibold">SolHandle · {demo.title}</DialogTitle><span className="text-xs text-names-accent">Automatic presentation · Concept UI</span></div><DialogDescription className="text-xs text-muted-foreground">Real lookup data. No wallet connection, signing, minting or money transfer. Replay uses the same lookup snapshot.</DialogDescription></header><div className="min-h-0 overflow-y-auto">{result ? <DemoPresentationScene slug={slug} result={result} input={input} elapsed={elapsed} mode={mode} rpcUrl={rpcUrl}/> : <div className="flex min-h-full flex-col items-center justify-center gap-5 text-center">{error ? <><p role="alert" className="max-w-xl text-names-warning">{error}</p><p className="text-sm text-muted-foreground">Presentation stopped. No sample identity replaces a failed lookup.</p><Button variant="outline" onClick={launch}>Retry live lookup</Button></> : <><Loader2 className="h-8 w-8 animate-spin text-names-accent"/><p role="status" className="text-lg">{stage || 'Preparing your live lookup…'}</p><p className="max-w-lg text-sm text-muted-foreground">The countdown begins only after the real result arrives.</p></>}</div>}</div><DemoPresentationControls voice={voice} elapsed={elapsed} paused={paused} ready={Boolean(result)} onPause={() => setPaused(value => !value)} onReplay={restart} onClose={close}/></DialogContent></Dialog></div>;
}