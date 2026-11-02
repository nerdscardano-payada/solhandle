import { Link } from 'react-router-dom';
import { ArrowUpRight, Wallet } from 'lucide-react';

export default function DashboardNextAction({ state, ownership, profileQuery }) {
  if (!state.address) return <section className="ep-card dashboard-next"><h2>Connect your wallet</h2><p>Access your identity and private contacts. Public profiles and projects are open to everyone.</p><button type="button" className="ep-button ep-primary" onClick={() => window.dispatchEvent(new CustomEvent('solhandle:connect-wallet'))}><Wallet size={18}/>Connect wallet</button></section>;
  if (state.loading || ownership.isPending) return <section className="ep-card" role="status">Checking your identity and owned handles on Solana…</section>;
  if (state.error || ownership.isError) return <section className="ep-card dashboard-next" role="alert"><h2>Your identity could not be checked</h2><p>No ownership or setup status is inferred from an unsuccessful check.</p><button type="button" className="ep-button" onClick={() => { state.refresh(); ownership.refetch(); }} disabled={state.refreshing || ownership.isFetching}>Check again</button></section>;
  const owned = ownership.data?.handles.length > 0;
  const primary = state.identity?.primaryHandle;
  if (primary && profileQuery.isPending) return <p role="status">Checking your public profile…</p>;
  if (primary && profileQuery.isError) return <section className="ep-card dashboard-next" role="alert"><h2>Public profile status unavailable</h2><button type="button" className="ep-button" disabled={profileQuery.isFetching} onClick={() => profileQuery.refetch()}>Check profile again</button></section>;
  const ready = primary && profileQuery.data?.profile;
  const title = !owned && !primary ? 'Claim your first @handle' : !primary ? 'Set your Primary Handle' : !ready ? 'Complete your public profile' : 'Your identity is ready';
  const description = !owned && !primary ? 'Start with a name owned by your wallet on Solana.' : !primary ? 'Choose which of your owned handles represents your wallet. Nothing is changed automatically.' : !ready ? 'Add your bio, avatar and links, then choose whether to publish.' : 'Open your contacts or send a payment. Every payment is reviewed and approved in your wallet.';
  const to = !owned && !primary ? '/search' : !primary ? '/my-handles' : !ready ? '/profile' : '/contacts';
  return <section className="ep-card dashboard-next"><span className="ep-eyebrow">YOUR NEXT STEP</span><h2>{title}</h2><p>{description}</p><Link className="ep-button ep-primary" to={to}>{ready ? 'Open My Contacts' : title}<ArrowUpRight size={16}/></Link>{ready && <><Link className="ep-link" to="/pay">Send Payment <ArrowUpRight size={16}/></Link><Link className="ep-link" to={`/profile/${primary.replace(/^@/, '')}`}>Your public profile <ArrowUpRight size={16}/></Link></>}</section>;
}