import { Image } from '@/components/ui/image';

export default function PartnerMintWalletExample() {
  return <figure className="mb-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Phase 3 · Wallet provider design concept</p>
    <h3 className="mt-2 text-lg font-semibold text-foreground">Native wallet — ordering & mint confirmation</h3>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A native wallet concept using the same dark background, cyan-purple accents and handle card styling as the partner website example.</p>
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/29be77423_generated_image.png" alt="Dark wallet provider concept matching the partner website design, showing @ansem ordering and successful mint confirmation" fittingType="fit" className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-background" />
    <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">Illustrative Phase 3 design, not a live wallet integration or confirmed partnership. The 0.10 SOL mint fee is an example price; network and account costs are separate.</figcaption>
  </figure>;
}