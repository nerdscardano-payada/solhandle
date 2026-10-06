import { AtSign, Link2, Send } from 'lucide-react';
const steps = [
  { icon: AtSign, title: 'Choose your @name', text: 'Find an available name and claim your own SolHandle.' },
  { icon: Link2, title: 'Own your identity', text: 'Your handle is an NFT in your wallet, not an account with us.' },
  { icon: Send, title: 'Use your @name', text: 'Look up a wallet or receive payments through SolHandle Pay.' }
];
export default function IntroSteps() {
  return <section aria-label="How SolHandle works" className="mx-auto mt-7 grid max-w-4xl gap-4 text-left min-[768px]:grid-cols-3 min-[768px]:gap-6">
    {steps.map(({ icon: Icon, title, text }, i) => <div key={title} className="flex gap-3 border-t border-border pt-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-names-accent/10 text-names-accent"><Icon className="h-5 w-5"/></div><div><p className="text-sm font-semibold"><span className="mr-2 font-mono text-names-secondary">0{i + 1}</span>{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></div>)}
  </section>;
}