import { useEffect, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import useDemoLookup from '@/components/solhandle/demos/useDemoLookup';
import DemoPresentationScene from '@/components/solhandle/demos/DemoPresentationScene';
import DemoPresentationControls from '@/components/solhandle/demos/DemoPresentationControls';
import DemoPresentationViewport from '@/components/solhandle/demos/DemoPresentationViewport';
import { demoCatalog } from '@/components/solhandle/demos/demoCatalog';
import usePresentationVoice from '@/components/solhandle/demos/usePresentationVoice';
import { SCENE_SECONDS, PRESENTATION_SECONDS } from '@/components/solhandle/demos/presentationTiming';
export default function DemoPresentation({ slug, input, mode = 'resolve', rpcUrl = '', disabled = false }) {
  const [open, setOpen] = useState(false), [elapsed, setElapsed] = useState(-3), [paused, setPaused] = useState(false), [replay, setReplay] = useState(0);
  const { result, error, stage, lookup, reset } = useDemoLookup(); const demo = demoCatalog.find(item => item.slug === slug);
  const voice = usePresentationVoice({ open, result, elapsed, paused, slug, mode, rpcUrl });
  const finished = elapsed >= PRESENTATION_SECONDS;
  useEffect(() => {
    if (!open || !result || paused || finished) return;
    let lastTick = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(), delta = Math.min(0.25, (now - lastTick) / 1000); lastTick = now;
      setElapsed(previous => {
        if (previous >= PRESENTATION_SECONDS) return previous;
        const boundary = previous < 0 ? 0 : (Math.floor(previous / SCENE_SECONDS) + 1) * SCENE_SECONDS;
        const next = Math.min(boundary, previous + delta);
        return previous >= 0 && voice.busy.current && next >= boundary ? boundary - 0.001 : Math.min(PRESENTATION_SECONDS, next);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [open, result, paused, replay, finished]);
  function launch() { setElapsed(-3); setPaused(false); setOpen(true); lookup(input, mode, false, rpcUrl); }
  function close() { setOpen(false); reset(); setElapsed(-3); setPaused(false); }
  function restart() { setElapsed(-3); setPaused(false); setReplay(value => value + 1); }
  return <div className="mt-4"><Button type="button" variant="outline" disabled={disabled || !input.trim()} onClick={launch} className="min-h-11 border-names-accent/40 text-names-accent"><Play/>Play automatic presentation</Button><Dialog open={open} onOpenChange={value => { if (!value) close(); }}><DialogContent data-demo-presentation data-demo-localization data-localize-slots className="dark left-0 top-0 h-[100dvh] max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-none border-0 bg-background p-4 text-foreground sm:rounded-none md:p-6"><header className="space-y-2 pr-8"><div className="flex flex-wrap items-center justify-between gap-2"><DialogTitle className="font-heading text-lg font-semibold">SolHandle · {demo.title}</DialogTitle><span className="text-xs text-names-accent">Automatic presentation · Concept UI</span></div><DialogDescription className="text-xs text-muted-foreground">Real lookup data. No wallet connection, signing, minting or money transfer. Replay uses the same lookup snapshot.</DialogDescription></header><DemoPresentationViewport>{result ? <DemoPresentationScene slug={slug} result={result} input={input} elapsed={elapsed} mode={mode} rpcUrl={rpcUrl}/> : <div className="flex min-h-full flex-col items-center justify-center gap-5 text-center">{error ? <><p role="alert" className="max-w-xl text-names-warning">{error}</p><p className="text-sm text-muted-foreground">Presentation stopped. No sample identity replaces a failed lookup.</p><Button variant="outline" onClick={launch}>Retry live lookup</Button></> : <><Loader2 className="h-8 w-8 animate-spin text-names-accent"/><p role="status" className="text-lg">{stage || 'Preparing your live lookup…'}</p><p className="max-w-lg text-sm text-muted-foreground">The countdown begins only after the real result arrives.</p></>}</div>}</DemoPresentationViewport><DemoPresentationControls voice={voice} elapsed={elapsed} paused={paused} ready={Boolean(result)} onPause={() => setPaused(value => !value)} onReplay={restart} onClose={close}/></DialogContent></Dialog></div>;
}