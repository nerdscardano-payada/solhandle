import { Loader2, TriangleAlert, ArrowLeft } from 'lucide-react';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
import EcosystemHeader from '@/components/solhandle/ecosystem/EcosystemHeader';
import EcosystemNavigation from '@/components/solhandle/ecosystem/EcosystemNavigation';
import EcosystemDashboard from '@/components/solhandle/ecosystem/EcosystemDashboard';
import EcosystemIdentity from '@/components/solhandle/ecosystem/EcosystemIdentity';
import EcosystemDiscover from '@/components/solhandle/ecosystem/EcosystemDiscover';
import EcosystemContacts from '@/components/solhandle/ecosystem/EcosystemContacts';
import EcosystemPay from '@/components/solhandle/ecosystem/EcosystemPay';
import EcosystemPublic from '@/components/solhandle/ecosystem/EcosystemPublic';
export default function EcosystemWorkspace() {
  const d = useEcosystem(), publicView = d.screen === 'public';
  const systemState = ['loading', 'error'].includes(d.scenario);
  return <div className={`ep-app ${publicView ? 'ep-public-app' : ''}`}><EcosystemHeader/>{publicView ? <EcosystemPublic/> : <div className="ep-app-layout"><EcosystemNavigation/><main className="ep-main" aria-label="Ecosystem prototype content">
    {d.screen !== 'home' && <button className="ep-link ep-back" onClick={() => d.go('home')}><ArrowLeft size={15}/>Home</button>}
    {d.notice && <p className="ep-notice ep-global-notice" role="status">{d.notice}</p>}
    {d.scenario === 'unsigned' && <div className="ep-notice ep-global-notice ep-warning">Connected wallet ≠ signed-in account. This is an unsigned example; sensitive account actions are paused.<button className="ep-link" onClick={() => d.setModal({ type: 'account' })}>View account status</button></div>}
    {systemState ? <section className="ep-card ep-system-state">{d.scenario === 'loading' ? <><Loader2 size={30}/><h1>Loading your ecosystem…</h1><p>Loading-state demonstration. No request is running.</p></> : <><TriangleAlert size={30}/><h1>We could not load your ecosystem.</h1><p>Error-state demonstration. No real service has failed.</p></>}<button className="ep-button" onClick={() => d.setScenario('ready')}>{d.scenario === 'error' ? 'Retry demo' : 'Finish loading demo'}</button></section> : d.screen === 'home' ? <EcosystemDashboard/> : d.screen === 'discover' ? <EcosystemDiscover/> : d.screen === 'contacts' ? <div className="ep-page"><header className="ep-page-heading"><p className="ep-eyebrow">YOUR PEOPLE. YOUR PRIVATE SPACE.</p><h1>Contacts</h1><p>A name worth remembering. A wallet you choose to keep.</p></header><EcosystemContacts/></div> : d.screen === 'pay' ? <EcosystemPay key={`${d.payTo}:${d.payContact}:${d.scenario}`}/> : <div className="ep-page"><EcosystemIdentity full/></div>}
  </main></div>}{!publicView && <EcosystemNavigation mobile/>}<footer className="ep-demo-footer">SOLHANDLE ECOSYSTEM · DESIGN V1.0 · All displayed data are examples, not blockchain or account evidence.</footer></div>;
}