import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import HomeHeroMint from '@/components/solhandle/ecosystem/live/HomeHeroMint';
import { Image } from '@/components/ui/image';
import { useCityTransition } from '@/components/solhandle/ecosystem/live/EcosystemCityTransition';
export default function EcosystemPublicHero() {
  const { enter, entering } = useCityTransition();
  return <section className="ep-public-hero"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/fffee7add_image.png" alt="SolHandle skyline aan het water bij zonsondergang met een lichtgevend identiteitslogo" className="ep-public-city" loading="eager" focalPointX={0.72}/>
    <div className="ep-public-copy"><span className="ep-eyebrow">SIMPLE NAMES. BIGGER POSSIBILITIES.</span><h1>Your @handle.<br/>Your identity.<br/><span>Your Solana network.</span></h1><div className="el-hero-intro-row"><p><span className="el-hero-desktop-description">A name that is yours. People worth knowing.<br/>A simpler way to connect and pay on Solana.</span><span className="el-hero-mobile-description">Claim your name. Connect and pay on Solana.</span></p><Link className="el-intro-ecosystem-link" to="/ecosystem" onClick={enter} aria-disabled={entering}>Explore Ecosystem <ArrowUpRight size={24}/></Link></div><HomeHeroMint/><small>Find your name → Claim with your wallet → Use your identity</small></div>
    <Link className="el-city-logo-link" to="/ecosystem" onClick={enter} aria-disabled={entering} aria-label="Explore Ecosystem via het SolHandle-logo"/>
  </section>;
}