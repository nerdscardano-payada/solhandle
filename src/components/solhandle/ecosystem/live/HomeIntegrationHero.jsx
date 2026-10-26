import { Link } from 'react-router-dom';
import { ArrowRight, ArrowRightLeft, Fingerprint, Code2 } from 'lucide-react';
import HomeIntegrationVisual from '@/components/solhandle/ecosystem/live/HomeIntegrationVisual';
import '@/components/solhandle/ecosystem/live/home-integrations.css';
const capabilities = [[ArrowRightLeft, 'Forward Resolution', '@handle → Wallet', 'Resolve a handle to its current owner.'], [Fingerprint, 'Reverse Resolution', 'Wallet → Primary @', 'Identify a wallet by its primary handle.'], [Code2, 'Developer Tools', 'SDK · REST API · On-chain', 'Build with the existing resolution infrastructure.']];
export default function HomeIntegrationHero() {
  return <section className="el-home-integration" aria-labelledby="home-integration-title">
    <div className="el-integration-layout"><div className="el-integration-copy">
      <p className="ep-eyebrow">BUILT FOR DEVELOPERS & SOLANA PROJECTS</p>
      <h2 id="home-integration-title">Bring @handles<br/>to your platform.</h2>
      <h3>One identity. Across Solana.</h3>
      <p>Let your users interact with recognizable @handles instead of long wallet addresses. Integrate SolHandle into your wallet, dApp, payment experience or Solana platform using our existing SDK, API and on-chain resolution infrastructure.</p>
      <div className="el-home-actions"><Link to="/developers" className="ep-button ep-primary">Start Integrating <ArrowRight size={18}/></Link><Link to="/integrations" className="ep-button ep-secondary">Integration Guides <ArrowRight size={18}/></Link></div>
    </div><HomeIntegrationVisual/></div>
    <div className="el-integration-capabilities">{capabilities.map(([Icon, title, value, description]) => <div key={title}><Icon size={23}/><h3>{title}</h3><strong>{value}</strong><p>{description}</p></div>)}</div>
    <p className="el-integration-note">On-chain data is authoritative for ownership. Integration guides do not imply official third-party support. Partner Mint is planned / in testing, not a verified production release.</p>
  </section>;
}