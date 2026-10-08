import { Image } from '@/components/ui/image';
import '@/components/solhandle/home/home-background.css';

export default function HomeBackdrop() {
  return <div className="home-full-backdrop" aria-hidden="true">
    <Image src="https://cdn.wegic.ai/assets/onepage/agent/reference-assets/cosmic-hero-bg-01M4D6CE612GE314R7S18MGQQE-enhanced.png" alt="" className="home-full-backdrop-image" fittingType="fill" loading="eager" fetchPriority="high"/>
    <div className="home-full-backdrop-tint"/>
  </div>;
}