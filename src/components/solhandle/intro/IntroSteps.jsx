import { AtSign, Link2, Send } from 'lucide-react';
const steps = [
  { icon: AtSign, title: 'Kies je @naam', text: 'Zoek een beschikbare naam en claim je eigen SolHandle.' },
  { icon: Link2, title: 'Bezit je identiteit', text: 'Je handle is een NFT in je wallet, niet een account bij ons.' },
  { icon: Send, title: 'Gebruik je @naam', text: 'Zoek een wallet op of ontvang betalingen via SolHandle Pay.' }
];
export default function IntroSteps() {
  return <section aria-label="Zo werkt SolHandle" className="mx-auto mt-7 grid max-w-4xl gap-4 text-left min-[768px]:grid-cols-3 min-[768px]:gap-6">
    {steps.map(({ icon: Icon, title, text }, i) => <div key={title} className="flex gap-3 border-t border-border pt-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-names-accent/10 text-names-accent"><Icon className="h-5 w-5"/></div><div><p className="text-sm font-semibold"><span className="mr-2 font-mono text-names-secondary">0{i + 1}</span>{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div></div>)}
  </section>;
}