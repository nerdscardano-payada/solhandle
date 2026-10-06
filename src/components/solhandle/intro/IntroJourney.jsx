import { Image } from '@/components/ui/image';

export default function IntroJourney() {
  return <section aria-label="Van walletadres naar SolHandle" className="mx-auto max-w-5xl">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c421a2415_image.png" alt="From 44 characters to your @name. Twee smartphones tonen hetzelfde walletadres als lang adres en als @ansem, met Solana- en SolHandle-munten." className="block aspect-video w-full" fittingType="fit"/>
    <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">Illustratief voorbeeld: dit adres is niet het echte walletadres achter @ansem.</p>
  </section>;
}