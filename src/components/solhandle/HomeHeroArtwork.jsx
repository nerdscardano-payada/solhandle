import { Image } from '@/components/ui/image';

export default function HomeHeroArtwork() {
  return <figure className="relative -mx-6 my-0 w-[calc(100%+3rem)]">
    <div className="pointer-events-none absolute inset-12 rounded-full bg-names-accent/10 blur-3xl"/>
    <Image
      src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/403a3d786_generated_image.png"
      alt="Neon smartphone with an @ansem identity and glowing cyan-purple @ symbols on dark rocks"
      className="relative aspect-[5/4] w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_78%,transparent_100%)]"
      fittingType="fit"
    />
    <figcaption className="mt-2 text-center text-xs text-muted-foreground">Illustrative identity · @ansem</figcaption>
  </figure>;
}