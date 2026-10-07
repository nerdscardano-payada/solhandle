import { Image } from '@/components/ui/image';

export default function HeroClaimTitle() {
  return <h1 className="font-hero text-4xl lg:text-[clamp(2.75rem,3.6vw,3.75rem)] font-black leading-[1.02] tracking-[-0.065em]" aria-label="Claim your @ on Solana">
    <span className="flex items-center gap-3 whitespace-nowrap">
      <span className="hero-claim-gradient">Claim your</span>
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="" aria-hidden="true" className="hero-title-logo h-[1.35em] w-[1.35em] shrink-0" fittingType="fit"/>
    </span>
    <span className="mt-1 block whitespace-nowrap">on <span className="hero-solana-gradient">Solana</span></span>
  </h1>;
}