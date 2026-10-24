import { Users, ArrowUpRight, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useDesign } from '@/components/solhandle/design/DesignContext';
export default function HeroSocialPanel() {
  const d = useDesign();
  return <article className="sd-visual-panel sd-visual-social">
    <button className="sd-visual-panel-title" onClick={() => d.go('home')}><span><Users size={15}/></span><strong>Social</strong><ArrowUpRight size={13}/></button>
    <div className="sd-visual-feed-tabs"><span>Voor jou</span><small>Volgend</small><small>Solana</small></div>
    <button className="sd-visual-mini-post" onClick={() => d.go('home')}><div className="sd-visual-author"><span className="sd-visual-avatar">s</span><div><strong>@studio <span>✦</span></strong><small>2 uur · voorbeeld</small></div></div><p>Samen meer bouwen.<br/>Op Solana, met elkaar.</p><Image className="sd-visual-post-image" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" focalPointX={0.87} alt="Futuristische Solana-stad bij zonsondergang"/><span className="sd-visual-reactions"><span><MessageCircle size={10}/> 12</span><span><Repeat2 size={10}/> 24</span><span><Heart size={10}/> 128</span></span></button>
    <button className="sd-visual-mini-post sd-visual-second-post" onClick={() => d.go('home')}><div className="sd-visual-author"><span className="sd-visual-avatar sd-visual-avatar-alt">a</span><div><strong>@ansem</strong><small>4 uur · voorbeeld</small></div></div><p>Jouw mensen.<br/>Jouw mogelijkheden.</p><div className="sd-visual-orbit-art"><span>@</span><small>VERBIND. BOUW. GROEI.</small></div></button>
  </article>;
}