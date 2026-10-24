import { useState } from 'react';
import { Users, ArrowUpRight, Fingerprint, Send } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import EcosystemCards from '@/components/solhandle/design/EcosystemCards';
import PreviewFeed from '@/components/solhandle/design/PreviewFeed';
export default function NetworkHomeContent() {
  const d = useDesign();
  const [tab, setTab] = useState('all');
  return <>
    <div className="sd-network-mobile-actions"><button className="sd-mobile-identity" onClick={() => d.setDialog('identity')}><span className="sd-avatar">a</span><div><small>JOUW IDENTITY</small><strong>{d.handle || 'Kies je @handle'}</strong></div><Fingerprint size={19}/></button><button className="sd-button sd-gradient" onClick={() => d.setDialog('pay')}><Send size={16}/> Betalen</button></div>
    <div className="sd-network-home-layout">
      <section className="sd-network-social-stream" aria-label="Sociale tijdlijn">
        <div className="sd-feed-panel"><header className="sd-network-social-title"><span><Users size={18}/><strong>Social</strong></span><small>Jouw tijdlijn</small></header><nav className="sd-feed-tabs" aria-label="Voorbeeldtijdlijn"><button aria-pressed={tab === 'all'} onClick={() => setTab('all')}>Voor jou</button><button aria-pressed={tab === 'following'} onClick={() => setTab('following')}>Volgend</button></nav>{tab === 'following' && !d.following ? <div className="sd-empty"><h3>Je netwerk begint met één connectie.</h3><p>Volg een voorbeeldprofiel om deze toestand te bekijken.</p><button className="sd-button sd-secondary" onClick={() => d.go('profile')}>Ontdek Ansem <ArrowUpRight size={15}/></button></div> : <PreviewFeed cinematic/>}</div>
      </section>
      <aside className="sd-network-context-stack" aria-label="Identity en Pay"><EcosystemCards cinematic sections={['identity', 'pay']}/><div className="sd-discovery"><span className="sd-eyebrow">MAAK VERBINDING</span><h3>Gebouwd om samen vooruit te gaan.</h3><p>Ontdek mensen en projecten die jouw wereld groter maken.</p><button className="sd-text-button" onClick={() => d.go('network')}>Bekijk je netwerk <ArrowUpRight size={15}/></button><small>Alle profielen en aantallen in dit ontwerp zijn fictief.</small></div></aside>
    </div>
  </>;
}