import { Image } from '@/components/ui/image';

export default function PartnerMintWebsiteExample() {
  return <section className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-6" aria-labelledby="partner-website-example">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Design concept · not live</p>
    <h2 id="partner-website-example" className="mt-2 text-xl font-semibold text-foreground">Partner website — ordering & mint confirmation</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">An illustrative SolHandle checkout inside a partner website, from ordering an @handle to the mint confirmation.</p>
    <figure className="mt-5">
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/7d8d45de0_generated_image.png" alt="Partner website concept showing the @ansem order screen and mint confirmation in the dark cyan-purple SolHandle style" fittingType="fit" className="aspect-video w-full overflow-hidden rounded-xl bg-background" />
      <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">Illustrative design only, not a live integration or confirmed partnership. The 0.10 SOL mint fee is an example price; network and account costs are separate.</figcaption>
    </figure>
  </section>;
}