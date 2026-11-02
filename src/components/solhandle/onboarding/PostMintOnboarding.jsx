import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
import useDashboardOwnership from '@/components/solhandle/ecosystem/live/useDashboardOwnership';
import PostMintSteps from '@/components/solhandle/onboarding/PostMintSteps';
import '@/components/solhandle/onboarding/post-mint.css';
export default function PostMintOnboarding({ handle, expectedWallet = '', expectedAsset = '' }) {
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || '';
  const valid = /^[a-z0-9]{1,20}$/.test(handle);
  const allowed = valid && (!expectedWallet || wallet === expectedWallet);
  const query = useDashboardOwnership(allowed ? wallet : '');
  const shell = content => <section className="ep-card post-mint" aria-label="Identity setup">{content}</section>;
  if (!valid) return shell(<><h2>Choose an owned handle</h2><Link className="ep-link" to="/my-handles">Open My Handles</Link></>);
  if (!wallet || !allowed) return shell(<><h2>Connect the owner wallet to set up @{handle}</h2><p>{wallet ? 'The connected wallet differs from the wallet in this mint receipt. Switch to the owner wallet to continue.' : 'Setup requires the wallet that owns this handle. Your private profile is never loaded automatically.'}</p>{!wallet && <button className="ep-button" type="button" onClick={() => window.dispatchEvent(new CustomEvent('solhandle:connect-wallet'))}>Connect wallet</button>}<Link className="ep-link" to="/ecosystem">Skip setup for now</Link></>);
  if (query.isPending) return shell(<p role="status">Verifying current ownership on Solana…</p>);
  if (query.isError) return shell(<div role="alert"><h2>Ownership could not be checked</h2><p>Setup is paused until ownership can be verified.</p><button className="ep-button" type="button" onClick={() => query.refetch()} disabled={query.isFetching}>Check again</button></div>);
  const owned = query.data?.handles.find(item => item.handle.replace(/^@/, '') === handle && (!expectedAsset || item.asset === expectedAsset));
  if (!owned) return shell(<><h2>Ownership not verified for @{handle}</h2><p>This wallet does not currently have a verified matching asset. If your mint just confirmed, check again shortly.</p><button className="ep-button" type="button" onClick={() => query.refetch()} disabled={query.isFetching}>Check again</button><Link className="ep-link" to="/my-handles">My Handles</Link></>);
  return <PostMintSteps key={`${wallet}:${handle}:${owned.asset}`} wallet={wallet} handle={handle} owned={query.data} onRefresh={() => query.refetch()}/>;
}