import { Image } from '@/components/ui/image';

export default function IntroJourney() {
  return <section aria-label="From wallet address to SolHandle" className="mx-auto max-w-5xl">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c421a2415_image.png" alt="From 44 characters to your @name. Two phones show the same wallet as a long address and as @ansem, with Solana and SolHandle coins." className="intro-artwork block aspect-video w-full" fittingType="fit"/>
    <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">Illustrative example: this is not the actual wallet address behind @ansem.</p>
  </section>;
}