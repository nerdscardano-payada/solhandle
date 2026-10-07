import { Image } from '@/components/ui/image';

export default function HeroClaimTitle() {
  return <h1 className="font-hero text-[clamp(3.5rem,4.7vw,4.5rem)] font-black leading-[1.02] tracking-[-0.065em]" aria-label="Claim your @ on Solana">
    <span className="flex items-center gap-3 whitespace-nowrap">
      <span className="bg-gradient-to-br from-foreground via-foreground to-names-accent bg-clip-text text-transparent">Claim your</span>
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="" aria-hidden="true" className="h-[1.35em] w-[1.35em] shrink-0 mix-blend-screen" fittingType="fit"/>
    </span>
    <span className="mt-1 block whitespace-nowrap">on <span className="bg-gradient-to-tr from-names-secondary via-names-accent to-names-success bg-clip-text text-transparent">Solana</span></span>
  </h1>;
}