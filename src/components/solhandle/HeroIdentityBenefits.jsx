import { Zap, ShieldCheck, Globe } from 'lucide-react';

const benefits = [
  { Icon: Zap, title: 'Human-readable identity', description: 'Easier to share and remember' },
  { Icon: ShieldCheck, title: 'Truly yours, onchain', description: 'Own it. No renewals.' },
  { Icon: Globe, title: 'Built for Solana', description: 'Identity, payments and more' },
];
export default function HeroIdentityBenefits() {
  return <div className="mt-7 grid grid-cols-3 gap-3">
    {benefits.map(({ Icon, title, description }) => <div key={title} className="flex gap-2 border-r border-border pr-3 last:border-0 last:pr-0"><Icon className="h-5 w-5 shrink-0 text-names-accent"/><div><p className="text-xs font-bold leading-4 text-foreground">{title}</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{description}</p></div></div>)}
  </div>;
}