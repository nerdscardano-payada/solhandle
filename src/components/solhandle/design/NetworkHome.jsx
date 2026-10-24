import ScenarioNotice from '@/components/solhandle/design/ScenarioNotice';
import NetworkHomeContent from '@/components/solhandle/design/NetworkHomeContent';
import '@/components/solhandle/design/network-cinematic.css';
import '@/components/solhandle/design/network-responsive.css';
export default function NetworkHome() {
  return <div className="sd-network-home"><header className="sd-page-title"><div><span className="sd-eyebrow">JOUW SOLHANDLE</span><h1>Goed je te zien<span className="sd-title-dot">.</span></h1><p>Jouw netwerk. Jouw naam. Alles verbonden.</p></div><span className="sd-small-status"><span className="sd-status-dot"/> Ontwerpvoorbeeld</span></header><ScenarioNotice/><NetworkHomeContent/></div>;
}