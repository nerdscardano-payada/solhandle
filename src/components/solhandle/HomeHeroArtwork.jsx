import { Image } from '@/components/ui/image';

export default function HomeHeroArtwork() {
  return <figure className="pointer-events-none absolute -inset-x-12 -inset-y-8 m-0 -z-10">
    <Image
      src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/a0becf818_image.png"
      alt="SolHandle identity illustration with a smartphone, handle search panel and glowing cyan-purple @ symbols"
      className="hero-artwork-image absolute right-0 top-0 h-full w-[70%]"
      fittingType="fill"
      focalPointX={0.5}
      focalPointY={0.48}
    />
    <figcaption className="sr-only">Illustrative SolHandle identity</figcaption>
  </figure>;
}