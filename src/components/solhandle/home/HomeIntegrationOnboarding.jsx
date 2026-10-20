import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function HomeIntegrationOnboarding() {
  return <section aria-labelledby="home-integration-title" className="relative w-full border-t border-names-accent/20 bg-names-accent/5 px-[5vw] py-12">
    <h2 id="home-integration-title" className="font-heading text-3xl font-semibold tracking-tight">Could SolHandle fit your project?</h2>
    <p className="mt-4 text-base text-muted-foreground">Tell us what you’re building. We’ll suggest the easiest integration path.</p>
    <div className="mt-7 grid grid-cols-2 gap-5">
      <Link to="/integrate?flow=project" className="group rounded-2xl border border-names-accent/30 bg-card p-6 hover:border-names-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-names-accent">
        <div className="flex items-center justify-between gap-4"><h3 className="font-heading text-xl font-semibold">I’m part of this project</h3><ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-names-accent"/></div>
        <p className="mt-3 text-sm text-muted-foreground">Five short steps. No technical expertise required.</p>
      </Link>
      <Link to="/integrate?flow=nomination" className="group rounded-2xl border border-names-secondary/30 bg-card p-6 hover:border-names-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-names-secondary">
        <div className="flex items-center justify-between gap-4"><h3 className="font-heading text-xl font-semibold">I want to suggest a project</h3><ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-names-secondary"/></div>
        <p className="mt-3 text-sm text-muted-foreground">Share a possibility, not a partnership claim.</p>
      </Link>
    </div>
    <p className="mt-6 text-sm text-muted-foreground">No account needed. Contact information is never published.</p>
  </section>;
}