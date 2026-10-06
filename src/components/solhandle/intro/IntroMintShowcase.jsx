import { Image } from '@/components/ui/image';

export default function IntroMintShowcase() {
  return <section aria-labelledby="intro-showcase-title" className="mx-auto mt-10 max-w-4xl">
    <h2 id="intro-showcase-title" className="font-heading text-2xl font-semibold text-foreground">Your identity, made collectible.</h2>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">A look at SolHandle NFT cards and a short video.</p>
    <figure className="mt-5 overflow-hidden rounded-2xl border border-names-accent/20 bg-background">
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/5e7d5c44d_generated_image.png" alt="Illustrative SolHandle NFT cards for @ansem and @solcat, with glowing cyan and purple borders." fittingType="fit" className="block aspect-video w-full"/>
      <figcaption className="px-4 pb-4 pt-2 text-[11px] leading-5 text-muted-foreground">Illustrative card artwork featuring @ansem and @solcat.</figcaption>
    </figure>
    <div className="mt-5 overflow-hidden rounded-2xl border border-names-secondary/20 bg-background">
      <video controls playsInline preload="metadata" aria-label="SolHandle introduction video" className="block max-h-[70dvh] w-full" src="https://media.base44.com/videos/public/6a86b7e4bcec5dfac8ee9a44/a9f6beb27_grok-video-556e9b71-460d-4bc7-8d8b-3dfc8febb17f.mp4">
        Your browser does not support embedded video. <a href="https://media.base44.com/videos/public/6a86b7e4bcec5dfac8ee9a44/a9f6beb27_grok-video-556e9b71-460d-4bc7-8d8b-3dfc8febb17f.mp4">Watch the SolHandle video</a>.
      </video>
    </div>
  </section>;
}