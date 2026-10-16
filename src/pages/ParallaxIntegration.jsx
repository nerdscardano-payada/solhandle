import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import ParallaxGuideAssets from '@/components/solhandle/parallax/ParallaxGuideAssets';
import ParallaxGuideSections from '@/components/solhandle/parallax/ParallaxGuideSections';
import { guideSections } from '@/components/solhandle/parallax/parallaxGuide';

export default function ParallaxIntegration() {
  return <main lang="en" data-no-translate className="dark min-h-screen bg-background text-foreground"><div className="mx-auto max-w-7xl border-x border-border"><Header/>
    <article className="mx-auto min-w-0 max-w-6xl px-5 py-10 lg:px-9 lg:py-16">
      <Link to="/integrations" className="text-sm text-names-accent">← Integration Center</Link>
      <header className="mt-8 border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">Partner implementation guide · v1 · 16 October 2026</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-6xl">SolHandle × Parallax</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Verified creator identities for Project Passports and Project Atlas. Connect a wallet, prove control and preserve historical attribution when handles move.</p>
        <div className="mt-6 rounded-xl border border-names-accent/25 bg-names-accent/5 p-4 text-sm leading-7"><strong className="text-names-accent">The core rule:</strong> a wallet is the stable historical reference; an @handle is a transferable identity label, never an automatic transfer of project access.</div>
        <ParallaxGuideAssets/>
      </header>
      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav aria-label="Guide contents" className="self-start lg:sticky lg:top-6"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Implementation steps</p><ol className="mt-4 space-y-3">{guideSections.map(section => <li key={section.id}><a href={'#' + section.id} className="block text-sm leading-6 text-muted-foreground hover:text-names-accent">{section.title}</a></li>)}</ol></nav>
        <ParallaxGuideSections/>
      </div>
    </article>
  </div></main>;
}