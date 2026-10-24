import { Fingerprint, Circle } from 'lucide-react';
import HeroSocialPanel from '@/components/solhandle/design/HeroSocialPanel';
import HeroIdentityPanel from '@/components/solhandle/design/HeroIdentityPanel';
import HeroPayPanel from '@/components/solhandle/design/HeroPayPanel';
export default function HeroEcosystemVisual({ children, footer = 'Interactive design preview' }) {
  return <div className="sd-visual-wrap"><div className="sd-visual-dashboard"><header className="sd-visual-dashboard-header"><span><Fingerprint size={21}/><strong>SolHandle</strong></span><small>PEOPLE · IDENTITY · POSSIBILITIES</small><span className="sd-visual-window-dots"><Circle size={5}/><Circle size={5}/><Circle size={5}/></span></header><div className="sd-visual-columns">{children || <><HeroSocialPanel/><HeroIdentityPanel/><HeroPayPanel/></>}</div><footer className="sd-visual-dashboard-footer"><span><i/> ONE ECOSYSTEM. ALL YOURS.</span><small>{footer}</small></footer></div><div className="sd-visual-reflection" aria-hidden="true"/></div>;
}