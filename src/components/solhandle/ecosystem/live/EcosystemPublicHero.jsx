import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HomeHeroMint from '@/components/solhandle/ecosystem/live/HomeHeroMint';
import { Image } from '@/components/ui/image';
import { useCityTransition } from '@/components/solhandle/ecosystem/live/EcosystemCityTransition';
export default function EcosystemPublicHero() {
  const { enter, entering } = useCityTransition();
  const heroRef = useRef(null);
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const search = hero.querySelector('.ep-claim-search');
    const entrance = hero.querySelector('.el-city-entrance');
    if (!search || !entrance) return;
    const alignLabel = () => {
      const field = search.getBoundingClientRect();
      hero.style.setProperty('--city-label-offset', `${field.top + field.height / 2 - entrance.getBoundingClientRect().top}px`);
    };
    const observer = new ResizeObserver(alignLabel);
    observer.observe(hero);
    observer.observe(hero.querySelector('.ep-public-copy'));
    observer.observe(search);
    alignLabel();
    return () => observer.disconnect();
  }, []);
  return <section ref={heroRef} className="ep-public-hero"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/fffee7add_image.png" alt="SolHandle skyline aan het water bij zonsondergang met een lichtgevend identiteitslogo" className="ep-public-city" loading="eager" focalPointX={0.72}/>
    <div className="ep-public-copy"><span className="ep-eyebrow">SIMPLE NAMES. BIGGER POSSIBILITIES.</span><h1>Your @handle.<br/>Your identity.<br/><span>Your Solana network.</span></h1><p>A name that is yours. People worth knowing.<br/>A simpler way to connect and pay on Solana.</p><HomeHeroMint/><small>Find your name → Claim with your wallet → Use your identity</small></div><Link className="el-city-entrance" to="/ecosystem" onClick={enter} aria-label="Explore Ecosystem" aria-disabled={entering}><span className="el-city-entrance-marker"><ArrowRight size={24}/></span><span className="el-city-entrance-label">Explore Ecosystem <ArrowRight size={16}/></span></Link>
  </section>;
}