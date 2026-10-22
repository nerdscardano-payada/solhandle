import { Fingerprint, ShieldAlert, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IdentityEmpty({ address, loading, error, refresh }) {
  return <article className="identity-passport identity-empty">
    <div className="identity-monogram" aria-hidden="true"><Fingerprint size={52}/></div>
    <span className="identity-eyebrow">YOUR IDENTITY STARTS HERE</span>
    <h2>{loading ? 'Finding your identity' : error ? 'Unable to verify' : address ? 'Make it your @' : 'Your wallet. Your identity.'}</h2>
    <p>{loading ? 'Checking your primary handle on Solana…' : error ? 'We could not check ownership right now. No verified identity is being shown.' : address ? 'No verified primary handle was found for this wallet. Claim a handle or choose your primary in My Handles.' : 'Connect your existing wallet to see your personal @handle and its on-chain details. No new wallet required.'}</p>
    {loading ? <div role="status" className="identity-loading">Checking Solana…</div> : error ? <button className="identity-main-button" onClick={refresh}><ShieldAlert size={17}/> Try again</button> : address ? <div className="identity-empty-actions"><Link className="identity-main-button" to="/my-handles">My Handles</Link><Link to="/search">Find a handle →</Link></div> : <button className="identity-main-button" onClick={() => window.dispatchEvent(new CustomEvent('solhandle:connect-wallet'))}><Wallet size={17}/> Connect wallet</button>}
  </article>;
}