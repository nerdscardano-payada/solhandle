import Header from '@/components/solhandle/Header';
import LiveIntegrationList from '@/components/solhandle/LiveIntegrations';

export default function LiveIntegrations() {
  return <main className="dark min-h-screen bg-background text-foreground"><div className="mx-auto min-h-screen max-w-7xl border-x border-border"><Header /><section className="px-5 py-12 md:px-9">
    <p className="text-sm font-medium tracking-wider text-names-accent">SOLHANDLE ECOSYSTEM</p>
    <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Integrations</h1>
    <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Discover products bringing SolHandle @handles to their users.</p>
    <LiveIntegrationList />
    <section className="mt-10 rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-semibold">Upcoming integrations</h2><p className="mt-3 text-sm text-muted-foreground">No upcoming integrations announced yet.</p></section>
  </section></div></main>;
}