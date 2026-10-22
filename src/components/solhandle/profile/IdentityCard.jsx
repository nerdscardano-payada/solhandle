import { BadgeCheck, ArrowUpRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import IdentityCopy from '@/components/solhandle/profile/IdentityCopy';

export default function IdentityCard({ identity }) {
  return <article className="identity-passport" aria-label="Your SolHandle identity">
    <div className="identity-passport-top"><span>SOLHANDLE / IDENTITY</span><span className="identity-network-dot">SOLANA MAINNET</span></div>
    <div className="identity-passport-core"><div className="identity-monogram" aria-hidden="true">@</div><span className="identity-eyebrow">ONE HANDLE. UNIQUELY YOURS.</span><h2>{identity.primaryHandle}</h2><span className="identity-seal"><BadgeCheck size={16}/> Official SolHandle asset</span></div>
    <div className="identity-passport-bottom"><Fingerprint size={34}/><div><span>WALLET-OWNED IDENTITY</span><p>Held by you. Recorded on Solana.</p></div><IdentityCopy value={identity.primaryHandle} label="Copy handle"/></div>
    <div className="identity-passport-proof"><ShieldCheck size={15}/><span>Primary handle ownership checked on-chain</span></div>
    <Link to={`/${encodeURIComponent(identity.primaryHandle.replace(/^@/, ''))}`} className="identity-card-link">View handle <ArrowUpRight size={16}/></Link>
  </article>;
}