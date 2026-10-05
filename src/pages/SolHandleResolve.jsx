import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import ResolveWizard from '@/components/solhandle/resolve/ResolveWizard';
import WidgetGallery from '@/components/solhandle/widgets/WidgetGallery';
import ResolveDocsContent from '@/components/solhandle/resolve/ResolveDocsContent';
import { sections } from '@/components/solhandle/resolve/resolveExamples';

export default function SolHandleResolve() {
  return <main className="dark min-h-screen bg-background font-body text-foreground"><div className="mx-auto max-w-7xl border-x border-border"><Header/>
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-9 lg:py-12">
      <Link to="/developers" className="text-sm text-names-accent">← Developer Center</Link>
      <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-names-secondary">SolHandle widgets · Built for your community</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight lg:text-5xl">Bring @names to your website.</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">Give visitors a name to claim, a wallet to find, or an identity to recognise. Choose a ready-made widget and add it with one embed. No API key. No custom lookup code.</p>
      <WidgetGallery/>
      <details className="mt-8 rounded-2xl border border-border p-4 lg:p-6"><summary className="cursor-pointer text-lg font-semibold text-names-accent">Advanced integrations: member names & payment forms</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">These routes require a developer to connect SolHandle to your existing member data or payment flow. They are not plug-and-play widgets. Your platform keeps its own wallet verification, accounts and payment approval.</p><ResolveWizard/></details>
      <details className="mt-8 rounded-2xl border border-border p-4 lg:p-6"><summary className="cursor-pointer text-lg font-semibold text-names-accent">Optional: technical reference and all examples</summary><p className="mt-3 text-sm text-muted-foreground">These are alternative examples and reference material, not a list of steps you must complete.</p>
      <nav aria-label="Resolve documentation contents" className="my-6 flex flex-wrap gap-3 text-sm text-names-accent">{sections.map(section => <a key={section.id} href={`#${section.id}`} className="rounded-lg border border-border px-3 py-2">{section.id === 'quick-start' ? 'Quick start' : section.id === 'website' ? 'Website example' : section.id === 'api' ? 'HTTP API' : section.id === 'response' ? 'Response' : 'On-chain SDK'}</a>)}<a href="#safety" className="rounded-lg border border-border px-3 py-2">Safety</a></nav>
      <ResolveDocsContent/>
      </details>
    </div>
  </div></main>;
}