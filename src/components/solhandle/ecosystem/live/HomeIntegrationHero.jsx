import { Link } from 'react-router-dom';
import { ArrowUpRight, AtSign, Fingerprint, Code2, Blocks } from 'lucide-react';
import '@/components/solhandle/ecosystem/live/home-integrations.css';
const capabilities = [[AtSign, 'Resolve', '@ → Wallet'], [Fingerprint, 'Identify', 'Wallet → Primary @'], [Code2, 'Integrate', 'SDK · API · On-chain']];
export default function HomeIntegrationHero() {
  return <section className="el-home-integration" aria-labelledby="home-integration-title">
    <div className="el-integration-layout"><div className="el-integration-copy">
      <p className="ep-eyebrow"><Blocks size={19}/>BUILT FOR DEVELOPERS & SOLANA PROJECTS</p>
      <h2 id="home-integration-title">Bring @handles to your platform.</h2>
      <h3>One identity. Across Solana.</h3>
      <p>Let your users interact with recognizable @handles instead of long wallet addresses. Integrate SolHandle identity into wallets, dApps, payment experiences and other Solana platforms.</p>
      <div className="el-home-actions"><Link to="/developers" className="ep-button ep-primary">Start Integrating <ArrowUpRight size={16}/></Link><Link to="/integrations" className="ep-button ep-secondary">Integration Guides</Link></div>
    </div></div>
    <div className="el-integration-capabilities">{capabilities.map(([Icon, title, value]) => <div key={title}><Icon size={23}/><h3>{title}</h3><strong>{value}</strong></div>)}</div>
    <p className="el-integration-note">On-chain data is authoritative for ownership. Integration guides do not imply official third-party support. Partner Mint is planned / in testing, not a verified production release.</p>
  </section>;
}