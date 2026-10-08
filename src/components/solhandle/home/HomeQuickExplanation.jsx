import { ArrowRight } from 'lucide-react';

export default function HomeQuickExplanation() {
  return <section className="home-content-section hidden lg:block">
    <h2 className="home-section-title">Your @ identity. Receive SOL. Yours forever.</h2>
    <ol className="flex flex-wrap items-center gap-3 text-sm text-foreground/70" aria-label="How to claim your SolHandle">
      {['Search', 'Connect', 'Mint', 'Use'].map((step, index) => <li key={step} className="flex items-center gap-3">
        {index > 0 && <ArrowRight className="h-4 w-4 text-names-accent" aria-hidden="true"/>}
        <span>{step}</span>
      </li>)}
    </ol>
  </section>;
}