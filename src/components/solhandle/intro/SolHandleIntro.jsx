import { useEffect, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Image } from '@/components/ui/image';
import IntroJourney from '@/components/solhandle/intro/IntroJourney';
import IntroSteps from '@/components/solhandle/intro/IntroSteps';
import '@/components/solhandle/intro/intro.css';

export default function SolHandleIntro({ onContinue }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={dialog} aria-labelledby="intro-title" onCancel={(event) => { event.preventDefault(); onContinue(); }} className="solhandle-intro m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-background p-0 font-body text-foreground">
    <div className="intro-aura pointer-events-none fixed inset-0" aria-hidden="true"/>
    <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-5 py-5 min-[768px]:px-10 min-[768px]:py-7">
      <header className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="" className="h-10 w-10" fittingType="fit"/><span className="font-heading text-lg font-semibold tracking-tight">SolHandle<span className="text-names-accent">.</span></span></div><button onClick={onContinue} type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-names-accent">Intro overslaan<X className="h-4 w-4"/></button></header>
      <div className="my-auto pb-4 pt-8 text-center min-[768px]:pt-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-names-accent">Je wallet heeft een adres. Jij hebt een naam.</p>
        <h1 id="intro-title" className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight min-[768px]:text-6xl">Van 44 tekens naar<br className="min-[768px]:hidden"/> <span className="bg-gradient-to-r from-names-accent to-names-secondary bg-clip-text text-transparent">jouw @naam.</span></h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Dezelfde wallet. Een herkenbare identiteit.<br/>SolHandle koppelt jouw unieke @handle aan je wallet op Solana.</p>
        <IntroJourney/><IntroSteps/>
        <button type="button" onClick={onContinue} className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-names-accent to-names-secondary px-8 py-4 font-semibold text-background transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-names-accent">Ontdek SolHandle<ArrowRight className="h-5 w-5"/></button>
        <p className="mt-3 text-[11px] text-muted-foreground">Geen account nodig. Je houdt zelf controle over je wallet.</p>
      </div>
    </div>
  </dialog>;
}