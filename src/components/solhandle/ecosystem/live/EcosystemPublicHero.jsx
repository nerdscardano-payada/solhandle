import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import HomeHeroEntries from '@/components/solhandle/ecosystem/live/HomeHeroEntries';
import '@/components/solhandle/ecosystem/live/home-hero-entries.css';
import { Image } from '@/components/ui/image';
import { useCityTransition } from '@/components/solhandle/ecosystem/live/EcosystemCityTransition';
export default function EcosystemPublicHero() {
  const { enter, entering } = useCityTransition();
  return <section className="ep-public-hero el-dual-hero"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/fffee7add_image.png" alt="SolHandle skyline aan het water bij zonsondergang met een lichtgevend identiteitslogo" className="ep-public-city" loading="eager" focalPointX={0.72}/>
    <div className="ep-public-copy"><span className="ep-eyebrow">SIMPLE NAMES. BIGGER POSSIBILITIES.</span><h1>Your identity.<br/><span>Built for Solana.</span></h1><div className="el-hero-intro-row"><p>Claim your name. Bring @handles to your product.</p><Link className="el-intro-ecosystem-link" to="/ecosystem" onClick={enter} aria-disabled={entering}>Explore Ecosystem <ArrowUpRight size={24}/></Link></div></div>
    <HomeHeroEntries/>
    <Link className="el-city-logo-link" to="/ecosystem" onClick={enter} aria-disabled={entering} aria-label="Explore Ecosystem via het SolHandle-logo"/>
  </section>;
}