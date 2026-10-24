import { Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import NetworkPublicTimeline from '@/components/solhandle/network/NetworkPublicTimeline';

export default function LiveHeroSocial() {
  return <article className="sd-visual-panel sd-visual-social">
    <Link to="/network" className="sd-visual-panel-title"><span><Users size={15}/></span><strong>Social</strong><ArrowUpRight size={13}/></Link>
    <div className="sd-visual-feed-tabs"><span>For you</span><Link to="/network?view=following">Following</Link><Link to="/network/discover">Solana</Link></div>
    <div className="live-hero-feed"><NetworkPublicTimeline/></div>
  </article>;
}