import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
const states={
  ACTIVE:['Association currently confirmed','The signing wallet owns this official handle at the time of this check.'],
  NOT_REGISTERED:['No public association','This token address exists, but has no public SolHandle association. This does not mean the token is unsafe.'],
  OWNERSHIP_CHANGED:['Association no longer current','Current handle ownership no longer matches the published association, or the handle no longer exists.'],
  WITHDRAWN:['Association withdrawn','This association has been withdrawn. No current relationship is confirmed.'],
  UNAVAILABLE:['Check temporarily unavailable','The blockchain check could not be completed. A previous confirmation is not a current confirmation.'],
  NOT_TOKEN:['Unsupported token address','This address is not an initialized SPL or Token-2022 token mint on Solana Mainnet.']
};
const date=value=>value?new Date(value).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'long'}):'Unavailable';
export default function TokenCheckResult({result}) {
  const [label,description]=states[result.status],binding=result.binding;
  const [failedLogo,setFailedLogo]=useState(null);
  const logo=result.token?.logo,showLogo=logo&&failedLogo!==logo;
  return <article className="token-check-result" data-status={result.status} aria-live="polite"><span className="ep-eyebrow">RESULT · SOLANA MAINNET</span><h2>{label}</h2><p>{description}</p>
    {result.token&&<div className="token-check-identity"><div className="token-check-logo">{showLogo?<Image key={logo} src={logo} alt={`Logo of ${result.token.name||result.token.symbol||'the token'}`} fittingType="fit" className="h-full w-full object-contain" referrerPolicy="no-referrer" onError={()=>setFailedLogo(logo)}/>:<span aria-hidden="true">{(result.token.symbol||result.token.name||'T').slice(0,2).toUpperCase()}</span>}</div><p><strong>{result.token.name||'Name unavailable'}</strong>{result.token.symbol&&` · $${result.token.symbol}`}</p></div>}
    {binding?.project_reviewed&&result.status==='ACTIVE'&&<section className="my-4 space-y-2"><h3 className="font-heading font-semibold text-names-success">Project passport · representation reviewed</h3><p>Official project evidence was manually reviewed on {date(binding.project_reviewed_at)}. This is not proof of token creation or a safety endorsement.</p>{binding.project_website?.startsWith('https://')&&<a className="ep-link" href={binding.project_website} target="_blank" rel="noopener noreferrer">Official project website</a>}<Link className="ep-link block" to="/discover?tab=passports">Explore project passports</Link></section>}
    <dl><div><dt>Exact token address checked</dt><dd className="select-text">{result.mint}</dd></div>
    {binding&&<><div><dt>Published handle</dt><dd><Link to={`/profile/${binding.handle}`}>@{binding.handle}</Link></dd></div><div><dt>Signing wallet</dt><dd className="select-text">{binding.wallet}</dd></div><div><dt>Published on</dt><dd>{date(binding.published_at)}</dd></div></>}
    <div><dt>Last completed blockchain check</dt><dd>{date(result.checked_at)}</dd></div>
    {binding&&<div><dt>Last association confirmation</dt><dd>{date(result.last_verified_at)}</dd></div>}
    {binding?.withdrawn_at&&<div><dt>Withdrawn on</dt><dd>{date(binding.withdrawn_at)}</dd></div>}
    <div><dt>Requested on</dt><dd>{date(result.attempted_at)}</dd></div></dl>
    {result.cached&&<p className="ep-small">Cached result, no more than 30 seconds old; the check time above remains authoritative.</p>}
    {result.status==='WITHDRAWN'&&<p className="ep-small">No new ownership check is performed for a withdrawn association.</p>}
    <a className="ep-link" href={`https://explorer.solana.com/address/${result.mint}`} target="_blank" rel="noopener noreferrer">View address on Solana Explorer</a>
  </article>;
}