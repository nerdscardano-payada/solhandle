import { ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import HandleSearch from '@/components/solhandle/HandleSearch';

export default function HomeMobileHero({ wallet, refreshVersion }) {
  return <section className="home-mobile-hero" aria-labelledby="home-mobile-title">
    <Image className="home-mobile-city" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" alt="" aria-hidden="true" focalPointX={0.68}/>
    <div className="home-mobile-shade" aria-hidden="true"/>
    <span className="sd-eyebrow"><span className="sd-status-dot"/> YOUR IDENTITY ON SOLANA</span>
    <h1 id="home-mobile-title">Your @handle.<br/>Your <em>identity.</em><br/>Your <em>network.</em></h1>
    <p>One name to call your own. Find your handle and discover the SolHandle Network.</p>
    <div id="claim-handle"><HandleSearch wallet={wallet} personalSearch compact funnel hideEmptyHint presentation="preview" refreshVersion={refreshVersion}/></div>
    <span className="home-mobile-trust"><ShieldCheck size={17} aria-hidden="true"/> Search freely. Connect when you're ready to claim.</span>
    <Link to="/network" className="sd-button sd-secondary home-mobile-explore"><Users size={19}/> Explore the Network <ArrowRight size={17}/></Link>
  </section>;
}