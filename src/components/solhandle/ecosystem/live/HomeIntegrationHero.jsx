import { Link } from 'react-router-dom';
import { ArrowUpRight, AtSign, Fingerprint, Code2, Blocks } from 'lucide-react';
import '@/components/solhandle/ecosystem/live/home-integrations.css';
import HomeResolveExample from '@/components/solhandle/ecosystem/live/HomeResolveExample';
const capabilities = [[AtSign, 'Resolve', '@ → Wallet'], [Fingerprint, 'Identify', 'Wallet → Primary @'], [Code2, 'Integrate', 'SDK · API · On-chain']];
export default function HomeIntegrationHero() {
  return <section className="el-home-integration" aria-labelledby="home-integration-title">
    <div className="el-integration-layout"><div className="el-integration-copy">
      <p className="ep-eyebrow"><Blocks size={19}/>BUILT FOR DEVELOPERS & SOLANA PROJECTS</p>
      <h2 id="home-integration-title">Bring @handles to your platform.</h2>
      <p>Replace long wallet addresses with recognizable @handles in your wallet, dApp or payment experience. Build with the public SolHandle SDK, REST API and direct on-chain ownership verification, with product-specific guides to get started.</p>
      <div className="el-home-actions"><Link to="/developers" className="ep-button el-integration-action ep-primary">Explore SDK & Tools <ArrowUpRight size={16}/></Link><Link to="/docs" className="ep-button el-integration-action ep-secondary">Documentation</Link><Link to="/integrations" className="ep-button el-integration-action ep-secondary">Integration Guides</Link><Link to="/live-integrations" className="ep-button el-integration-action ep-secondary">Verified Integrations</Link></div>
    </div><HomeResolveExample/></div>
    <div className="el-integration-capabilities">{capabilities.map(([Icon, title, value]) => <div key={title}><Icon size={23}/><h3>{title}</h3><strong>{value}</strong></div>)}</div>
    <p className="el-integration-note">Verified Integrations and Integration Guides are separate: guides are technical examples, not proof of an official partnership or completed integration. On-chain data remains authoritative for ownership.</p>
  </section>;
}