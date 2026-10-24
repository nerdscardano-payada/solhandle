import { ArrowRight, Fingerprint } from 'lucide-react';
import PublicHero from '@/components/solhandle/design/PublicHero';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import ScenarioNotice from '@/components/solhandle/design/ScenarioNotice';
export default function PublicHome() {
  const d = useDesign();
  return <div className="sd-public"><PublicHero/><div className="sd-public-under"><ScenarioNotice/><div className="sd-section-heading"><div><span className="sd-eyebrow">SOCIAL · IDENTITY · PAY</span><h2>It all starts with your @handle.</h2></div><p>No complicated addresses.<br/>Just you, connected.</p></div><div className="sd-explain-row">{[['01','Choose your name','Find a handle that suits you.'],['02','Make it yours','Claim with your own wallet.'],['03','Use it everywhere','For your network, identity and payments.']].map(([n,title,copy]) => <div key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></div>)}</div><footer className="sd-public-footer"><Fingerprint size={18}/><strong>SolHandle</strong><span>Your identity. Your possibilities.</span><button className="sd-text-button" onClick={() => d.setDialog('developers')}>For developers <ArrowRight size={14}/></button></footer></div></div>;
}