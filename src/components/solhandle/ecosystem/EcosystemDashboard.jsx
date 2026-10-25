import { Clock3, ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/previewData';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
import EcosystemSummary from '@/components/solhandle/ecosystem/EcosystemSummary';
import EcosystemIdentity from '@/components/solhandle/ecosystem/EcosystemIdentity';
import EcosystemProjects from '@/components/solhandle/ecosystem/EcosystemProjects';
import EcosystemContacts from '@/components/solhandle/ecosystem/EcosystemContacts';
import EcosystemQuickActions from '@/components/solhandle/ecosystem/EcosystemQuickActions';
export default function EcosystemDashboard() {
  const d = useEcosystem();
  return <div className="ep-dashboard"><div className="ep-dashboard-main">
    <div className="ep-welcome"><div><p className="ep-eyebrow">YOUR SOLANA, CONNECTED.</p><h1>{d.handle ? `Welcome, ${d.handle}.` : 'Make yourself at home.'}</h1><p>One identity. A world of possibilities.</p></div><span className="ep-demo-pill">EXAMPLE DASHBOARD</span></div>
    <EcosystemSummary/><EcosystemIdentity/><EcosystemQuickActions mobile/>
    <div className="ep-dashboard-lower"><EcosystemProjects compact/><EcosystemContacts compact/></div>
  </div><aside className="ep-context"><EcosystemQuickActions/><section className="ep-card ep-activity"><h2><Clock3 size={18}/>Recent Activity</h2><div className="ep-empty"><Clock3 size={25}/><p>No personal activity connected.</p><small>Only confirmed events you are allowed to see will appear here. No demo transactions or social events.</small></div></section><section className="ep-brand-card"><Image src={ecosystemAssets.city} alt="" className="ep-cover-image" focalPointX={0.8} focalPointY={0.5}/><div><p>A more open<br/>Solana, together.</p><button className="ep-link" onClick={() => d.go('public')}>Explore SolHandle <ArrowUpRight size={15}/></button></div></section></aside></div>;
}