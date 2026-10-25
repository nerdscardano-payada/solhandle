import { useEffect, useRef, useState } from 'react';
import { Monitor, Smartphone, Scan, Info, ExternalLink } from 'lucide-react';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
import { ecosystemAssets, scenarioLabels } from '@/components/solhandle/ecosystem/previewData';
import EcosystemWorkspace from '@/components/solhandle/ecosystem/EcosystemWorkspace';
import EcosystemDialog from '@/components/solhandle/ecosystem/EcosystemDialog';
export default function EcosystemPreviewCanvas() {
  const d = useEcosystem(), ref = useRef(null);
  const [mode, setMode] = useState('responsive'), [width, setWidth] = useState(360);
  useEffect(() => { const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width)); if (ref.current) observer.observe(ref.current); return () => observer.disconnect(); }, []);
  const views = [['home', 'Dashboard'], ['public', 'Public homepage'], ['profile', 'Identity'], ['discover', 'Discover'], ['contacts', 'Contacts'], ['pay', 'Pay']];
  return <div className="eco-preview" lang="en" translate="no" data-no-translate>
    <section className="ep-toolbar" aria-label="Design review controls"><div className="ep-review-title"><span className="ep-demo-pill">DESIGN REVIEW · V1.0</span><strong>SolHandle Ecosystem</strong><span>Isolated prototype. The live website is unchanged.</span></div><div className="ep-review-controls"><div className="ep-device-controls" aria-label="Preview viewport">{[[Scan, 'responsive', 'Responsive'], [Monitor, 'desktop', 'Desktop'], [Smartphone, 'mobile', 'Mobile']].map(([Icon, value, label]) => <button aria-pressed={mode === value} key={value} onClick={() => setMode(value)}><Icon size={15}/>{label}</button>)}</div><button className="ep-link" onClick={() => d.setModal({ type: 'status' })}><Info size={16}/>Readiness</button><a className="ep-link" href={ecosystemAssets.reference} target="_blank" rel="noopener noreferrer">Reference <ExternalLink size={14}/></a></div><div className="ep-review-bottom"><nav aria-label="Prototype screens">{views.map(([value, label]) => <button key={value} aria-current={d.screen === value ? 'page' : undefined} onClick={() => d.go(value)}>{label}</button>)}</nav><label>Example state<select value={d.scenario} onChange={event => { d.setScenario(event.target.value); d.setModal(null); d.setNotice(''); }}>{Object.entries(scenarioLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div></section>
    <div ref={ref} className="ep-review-stage"><div className="ep-viewport" style={{ width: mode === 'desktop' ? 1440 : mode === 'mobile' ? Math.min(390, width) : '100%', zoom: mode === 'desktop' ? Math.min(1, width / 1440) : 1 }}><EcosystemWorkspace/></div></div><EcosystemDialog/>
  </div>;
}