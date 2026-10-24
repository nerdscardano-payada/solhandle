import { Fingerprint, ArrowUpRight, BadgeCheck, UserRound } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Link } from 'react-router-dom';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';

export default function LiveHeroIdentity() {
  const { address, identity, loading, error } = useProfileIdentity();
  const verified = Boolean(identity?.primaryHandle && !error);
  const handle = verified ? `@${identity.primaryHandle.replace(/^@/, '')}` : loading ? 'Checking…' : 'Your @handle';
  return <article className="sd-visual-panel sd-visual-identity">
    <Link className="sd-visual-panel-title" to="/network/me"><span><Fingerprint size={15}/></span><strong>Identity</strong><ArrowUpRight size={13}/></Link>
    <Image className="sd-visual-profile-cover" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" focalPointX={0.88} alt="City skyline on Solana"/>
    <div className="sd-visual-profile-avatar"><UserRound size={34}/>{verified && <span title="On-chain Primary Handle"><BadgeCheck size={15}/></span>}</div>
    <div className="sd-visual-profile-body"><Link to="/network/me" className="sd-visual-profile-name" data-no-translate>{handle}{verified && <BadgeCheck size={15}/>}</Link><small>{error ? 'Identity could not be verified' : verified ? 'Primary Handle · on-chain' : address ? 'No Primary Handle selected' : 'Connect your own wallet'}</small><p>Builder. Explorer.<br/>Uniquely you.</p><div className="sd-visual-tags"><span>Identity</span><span>Ownership</span><span>Solana</span></div><div className="sd-visual-stats" aria-label="Social counts unavailable until a profile is loaded">{['Following', 'Followers', 'Posts'].map(label => <span key={label}><strong>—</strong><small>{label}</small></span>)}</div><Link className="sd-button sd-gradient" to="/network/me">View profile <ArrowUpRight size={13}/></Link><small className="sd-visual-fineprint">Your handle. Your own identity.</small></div>
  </article>;
}