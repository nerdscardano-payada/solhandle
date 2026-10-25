import { Home, Compass, ContactRound, Send, UserRound, Plus } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/previewData';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
const items = [[Home, 'Home', 'home'], [Compass, 'Discover', 'discover'], [ContactRound, 'Contacts', 'contacts'], [Send, 'Pay', 'pay'], [UserRound, 'Profile', 'profile']];
export default function EcosystemNavigation({ mobile = false }) {
  const d = useEcosystem();
  return <aside className={mobile ? 'ep-bottomnav' : 'ep-sidebar'}>
    {!mobile && <p className="ep-eyebrow">YOUR ECOSYSTEM</p>}
    <nav aria-label={mobile ? 'Mobile ecosystem navigation' : 'Ecosystem navigation'}>{items.map(([Icon, label, screen]) => <button type="button" key={screen} onClick={() => d.go(screen)} aria-current={d.screen === screen ? 'page' : undefined}><Icon size={20}/><span>{label}</span></button>)}</nav>
    {!mobile && <><button className="ep-button ep-primary ep-claim" onClick={() => d.setModal({ type: 'claim' })}><Plus size={18}/>Claim Handle</button><div className="ep-sidebar-city"><Image src={ecosystemAssets.city} alt="" className="ep-city-image" focalPointX={0.82} focalPointY={0.5}/><p>Simple Names.<br/>Bigger Possibilities.</p><span className="ep-eyebrow">BUILT AROUND YOU.</span></div><button className="ep-link ep-sidebar-status" onClick={() => d.setModal({ type: 'status' })}>Prototype & release status</button></>}
  </aside>;
}