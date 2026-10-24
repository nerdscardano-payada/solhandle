import ScenarioNotice from '@/components/solhandle/design/ScenarioNotice';
import NetworkHomeContent from '@/components/solhandle/design/NetworkHomeContent';
import '@/components/solhandle/design/network-cinematic.css';
import '@/components/solhandle/design/network-responsive.css';
export default function NetworkHome() {
  return <div className="sd-network-home"><header className="sd-page-title"><div><span className="sd-eyebrow">YOUR SOLHANDLE</span><h1>Good to see you<span className="sd-title-dot">.</span></h1><p>Your network. Your name. All connected.</p></div><span className="sd-small-status"><span className="sd-status-dot"/> Design preview</span></header><ScenarioNotice/><NetworkHomeContent/></div>;
}