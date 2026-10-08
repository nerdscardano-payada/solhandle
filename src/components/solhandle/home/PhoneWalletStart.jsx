import { Image } from '@/components/ui/image';

export default function PhoneWalletStart() {
  return <div className="flex h-full flex-col items-center justify-center gap-4 border border-foreground/10 bg-hero-canvas/40 p-5">
    <div className="flex items-center gap-2">
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle" className="h-8 w-8 mix-blend-screen" fittingType="fit"/>
      <span className="text-xs font-semibold text-foreground/70">SolHandle</span>
    </div>
    <span className="text-[10px] uppercase tracking-widest text-foreground/50">Example wallet address</span>
    <p className="w-full break-all font-mono text-sm leading-relaxed text-foreground/80">7xA9mKp82Vq4tR6nW3cY5dF8hJ2sB9uL1eG6zQ4vN5aP</p>
    <p className="text-xs leading-relaxed text-foreground/60">Hard to remember.<br/>Easy to mistype.</p>
  </div>;
}