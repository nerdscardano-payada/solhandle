import { Fingerprint, ArrowUpRight, BadgeCheck, UserRound } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useDesign } from '@/components/solhandle/design/DesignContext';
export default function HeroIdentityPanel() {
  const d = useDesign();
  return <article className="sd-visual-panel sd-visual-identity">
    <button className="sd-visual-panel-title" onClick={() => d.setDialog('identity')}><span><Fingerprint size={15}/></span><strong>Identity</strong><ArrowUpRight size={13}/></button>
    <Image className="sd-visual-profile-cover" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" focalPointX={0.88} alt="City skyline on Solana"/>
    <div className="sd-visual-profile-avatar"><UserRound size={34}/><span><BadgeCheck size={15}/></span></div>
    <div className="sd-visual-profile-body"><button className="sd-visual-profile-name" onClick={() => d.go('profile')}>{d.handle || 'Your @handle'} <BadgeCheck size={15}/></button><small>Ansem · example profile</small><p>Builder. Explorer.<br/>Uniquely you.</p><div className="sd-visual-tags"><span>Creator</span><span>Builder</span><span>Solana</span></div><div className="sd-visual-stats"><span><strong>420</strong><small>Following</small></span><span><strong>12.4K</strong><small>Followers</small></span><span><strong>128</strong><small>Posts</small></span></div><button className="sd-button sd-gradient" onClick={() => d.go('profile')}>View profile <ArrowUpRight size={13}/></button><small className="sd-visual-fineprint">Your handle. Your own identity.</small></div>
  </article>;
}