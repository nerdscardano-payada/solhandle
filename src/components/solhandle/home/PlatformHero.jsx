import { ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import HandleSearch from '@/components/solhandle/HandleSearch';
import ClaimTokenNote from '@/components/solhandle/design/ClaimTokenNote';
import PlatformOverview from '@/components/solhandle/home/PlatformOverview';

export default function PlatformHero({ wallet, refreshVersion }) {
  return <section className="sd-public-hero sd-hero-cinematic">
    <Image className="sd-city sd-cinematic-city" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" alt="" aria-hidden="true" focalPointX={0.68} focalPointY={0.5} loading="eager" fetchPriority="high"/>
    <div className="sd-cinematic-shade"/>
    <div className="sd-cinematic-copy">
      <div className="sd-eyebrow"><span className="sd-status-dot"/> YOUR SOCIAL IDENTITY ON SOLANA</div>
      <h1>Your @handle.<br/>Your <em>identity.</em><br/>Your <em>network.</em></h1>
      <p>One recognizable name for everything you do.<br/>Meet people, build your network and pay<br className="sd-cinematic-break"/> easily with @handles.</p>
      <div id="claim-handle" className="platform-live-claim scroll-mt-6"><h2>Find your @handle</h2><HandleSearch wallet={wallet} personalSearch compact funnel hideEmptyHint refreshVersion={refreshVersion}/></div>
      <ClaimTokenNote/>
      <div className="sd-cinematic-cta-row"><Link className="sd-cinematic-explore" to="/network"><Users size={19}/> Explore Social <ArrowRight size={15}/></Link><span><ShieldCheck size={14}/> Your wallet. Your ownership.</span></div>
    </div>
    <PlatformOverview/>
    <div className="sd-cinematic-caption"><span>SOCIAL <b>·</b> IDENTITY <b>·</b> PAY</span><small>One name. A world of possibilities.</small></div>
  </section>;
}