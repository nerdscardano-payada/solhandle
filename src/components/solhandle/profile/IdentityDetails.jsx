import { ArrowUpRight, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import IdentityCopy from '@/components/solhandle/profile/IdentityCopy';

export default function IdentityDetails({ address, identity, refresh, refreshing }) {
  return <section className="identity-details" aria-label="Wallet and identity details">
    <div className="identity-panel-heading"><Wallet size={20}/><h2>Your wallet</h2><span className="identity-connected">Connected</span></div>
    <p className="identity-detail-intro">The wallet currently connected to SolHandle.</p>
    <div className="identity-address"><span className="identity-eyebrow">SOLANA WALLET ADDRESS</span><div><code>{address}</code><IdentityCopy value={address} label="Copy wallet address"/></div></div>
    <dl className="identity-facts"><div><dt>Network</dt><dd>Solana Mainnet</dd></div><div><dt>Primary handle</dt><dd>{identity?.primaryHandle || 'Not verified'}</dd></div><div><dt>Ownership</dt><dd>{identity ? <span className="identity-verified"><ShieldCheck size={15}/> Checked on-chain</span> : 'Not verified'}</dd></div>{identity && <div><dt>Last checked</dt><dd>{new Date(identity.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</dd></div>}</dl>
    <div className="identity-detail-actions"><a href={`https://solscan.io/account/${address}`} target="_blank" rel="noopener noreferrer">View on Solscan <ArrowUpRight size={15}/></a><button type="button" onClick={refresh} disabled={refreshing}><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''}/>{refreshing ? 'Checking…' : 'Refresh'}</button></div>
    <Link to="/my-handles" className="identity-manage">Manage my handles <ArrowUpRight size={17}/></Link>
    <p className="identity-boundary">Your handle can change. Your Network account and its history do not transfer with the NFT. This wallet view does not create or sign you into a Network account.</p>
  </section>;
}