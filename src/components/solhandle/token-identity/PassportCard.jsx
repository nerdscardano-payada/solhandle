import { useState } from 'react';
import { Fingerprint, Link2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import '@/components/solhandle/token-identity/passport-card.css';
const reviews={pending:'Pending review',approved:'Approved (test)',rejected:'Rejected',suspended:'Suspended'};
export default function PassportCard({data,visitor=false}) {
  const {item,ownership,checked_at,preview_available,token_logo}=data;
  const [failedLogo,setFailedLogo]=useState(null);
  const showLogo=token_logo&&failedLogo!==token_logo;
  const ownershipLabel=ownership==='observed'?'Original wallet owns the handle':ownership==='historical'?'Historical: handle has a different owner':'Current ownership not confirmed';
  return <article className="token-passport-card" aria-label="Token Identity test passport">
    <header className="token-passport-top"><div className="token-passport-brand"><Fingerprint size={26} aria-hidden="true"/><div><strong>SOLHANDLE</strong><span>TOKEN IDENTITY PASSPORT</span></div></div><span className="token-passport-private">{visitor?'PREVIEW':'PRIVATE TEST'}</span></header>
    <div className="token-passport-identity"><div className="token-passport-monogram overflow-hidden">{showLogo?<Image key={token_logo} src={token_logo} alt={`Logo of ${item.token_name||item.token_symbol||'the token'}`} fittingType="fit" className="h-full w-full object-contain" referrerPolicy="no-referrer" onError={()=>setFailedLogo(token_logo)}/>:<span aria-hidden="true">{(item.token_symbol||item.token_name||'T').slice(0,2).toUpperCase()}</span>}</div><div><span className="token-passport-caption">TOKEN</span><h2>{item.token_name||'Name unavailable'}</h2><p>{item.token_symbol?'$'+item.token_symbol.replace(/^\$/,'').toUpperCase():'Symbol unavailable'} · Solana Mainnet</p></div></div>
    <div className="token-passport-binding"><Link2 size={22} aria-hidden="true"/><div><span className="token-passport-caption">WALLET-SIGNED ASSOCIATION</span><strong>@{item.handle}</strong></div><span className="token-passport-review" data-review={item.status}>{visitor&&item.status==='approved'?'Association reviewed':reviews[item.status]||item.status}</span></div>
    <dl className="token-passport-fields"><div><dt>Token address</dt><dd className="select-text">{item.mint}</dd></div><div><dt>Signed by</dt><dd className="select-text">{item.wallet}</dd></div><div><dt>Recorded</dt><dd>{new Date(item.created_at).toLocaleString('en-GB')}</dd></div><div><dt>Passport reference</dt><dd className="select-text">{item.id}</dd></div></dl>
    <div className="token-passport-observation" data-current={preview_available?'yes':'no'}><strong>{preview_available?(visitor?'Signed association; ownership confirmed at check':'Test passport approved; ownership confirmed at check'):'No current approved passport confirmed'}</strong><p>{ownershipLabel} · checked {new Date(checked_at).toLocaleString('en-GB')}</p></div>
    <footer className="token-passport-footer"><strong>What does this prove?</strong><p>This wallet signed the association between this token address and @{item.handle}. {visitor?'A reviewed association is not an endorsement of the token itself.':'Approval is an administrator review within this test.'}</p><p>{visitor?'No proof of token creation, safety or investment value. Ownership verification is a snapshot in time.':'No proof of token creation or safety. No new NFT and not publicly visible. Ownership verification is a snapshot in time.'}</p></footer>
  </article>;
}