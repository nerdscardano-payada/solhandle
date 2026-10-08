import { Send, Link as LinkIcon, Layers } from 'lucide-react';
import HomeHandleTiles from '@/components/solhandle/home/HomeHandleTiles';
import { Image } from '@/components/ui/image';

export default function HomeProductVisual() {
  return <div className="home-product-visual" aria-label="Example of a SolHandle wallet identity">
    <div className="home-phone"><div className="mx-auto mb-8 h-5 w-24 rounded-full bg-hero-canvas"/><div className="text-center"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle logo" className="home-phone-logo mx-auto h-28 w-28 mix-blend-screen" fittingType="fit"/><b className="mt-3 block text-3xl tracking-tight">@yourname</b><span className="mt-2 block text-sm text-foreground/65">On Solana</span></div><div className="mt-8 space-y-3">{[[Send, 'Receive payments'], [LinkIcon, 'Share your handle'], [Layers, 'Use across apps']].map(([Icon, text]) => <div key={text} className="flex items-center gap-3 rounded-xl border border-names-accent/15 bg-names-accent/5 p-3 text-sm"><Icon className="h-5 w-5 text-names-accent"/>{text}</div>)}</div><p className="mt-8 text-center font-mono text-xs text-foreground/60">7xA9...Kp82 → <span className="text-names-accent">@yourname</span></p><p className="mt-3 text-center text-[10px] uppercase tracking-widest text-foreground/40">Identity preview</p></div>
    <div className="home-floating-names"><h2 className="text-xl font-semibold">Find your handle</h2><p className="mt-1 text-xs text-foreground/60">Live availability</p><HomeHandleTiles compact/></div>
  </div>;
}