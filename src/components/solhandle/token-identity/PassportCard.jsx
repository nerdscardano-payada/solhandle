import { useState } from 'react';
import { Fingerprint, Link2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import '@/components/solhandle/token-identity/passport-card.css';
const reviews={pending:'Wacht op beoordeling',approved:'Goedgekeurd (test)',rejected:'Afgewezen',suspended:'Opgeschort'};
export default function PassportCard({data,visitor=false}) {
  const {item,ownership,checked_at,preview_available,token_logo}=data;
  const [failedLogo,setFailedLogo]=useState(null);
  const showLogo=token_logo&&failedLogo!==token_logo;
  const ownershipLabel=ownership==='observed'?'Oorspronkelijke wallet is eigenaar':ownership==='historical'?'Historisch: handle heeft een andere eigenaar':'Huidig eigendom niet bevestigd';
  return <article className="token-passport-card" aria-label="Token Identity testpaspoort">
    <header className="token-passport-top"><div className="token-passport-brand"><Fingerprint size={26} aria-hidden="true"/><div><strong>SOLHANDLE</strong><span>TOKEN IDENTITY PASSPORT</span></div></div><span className="token-passport-private">{visitor?'VOORBEELD':'PRIVÉTEST'}</span></header>
    <div className="token-passport-identity"><div className="token-passport-monogram overflow-hidden">{showLogo?<Image key={token_logo} src={token_logo} alt={`Logo van ${item.token_name||item.token_symbol||'het token'}`} fittingType="fit" className="h-full w-full object-contain" referrerPolicy="no-referrer" onError={()=>setFailedLogo(token_logo)}/>:<span aria-hidden="true">{(item.token_symbol||item.token_name||'T').slice(0,2).toUpperCase()}</span>}</div><div><span className="token-passport-caption">TOKEN</span><h2>{item.token_name||'Naam niet beschikbaar'}</h2><p>{item.token_symbol?'$'+item.token_symbol.replace(/^\$/,'').toUpperCase():'Symbool niet beschikbaar'} · Solana Mainnet</p></div></div>
    <div className="token-passport-binding"><Link2 size={22} aria-hidden="true"/><div><span className="token-passport-caption">DOOR WALLET ONDERTEKENDE KOPPELING</span><strong>@{item.handle}</strong></div><span className="token-passport-review" data-review={item.status}>{visitor&&item.status==='approved'?'Koppeling beoordeeld':reviews[item.status]||item.status}</span></div>
    <dl className="token-passport-fields"><div><dt>Tokenadres</dt><dd className="select-text">{item.mint}</dd></div><div><dt>Ondertekend door</dt><dd className="select-text">{item.wallet}</dd></div><div><dt>Vastgelegd</dt><dd>{new Date(item.created_at).toLocaleString('nl-BE')}</dd></div><div><dt>Paspoortreferentie</dt><dd className="select-text">{item.id}</dd></div></dl>
    <div className="token-passport-observation" data-current={preview_available?'yes':'no'}><strong>{preview_available?(visitor?'Ondertekende koppeling; eigendom bij controle bevestigd':'Testpaspoort goedgekeurd; eigendom bij controle bevestigd'):'Geen actueel goedgekeurd paspoort bevestigd'}</strong><p>{ownershipLabel} · gecontroleerd {new Date(checked_at).toLocaleString('nl-BE')}</p></div>
    <footer className="token-passport-footer"><strong>Wat bewijst dit?</strong><p>Deze wallet heeft de koppeling tussen dit tokenadres en @{item.handle} ondertekend. {visitor?'Een beoordeelde koppeling is geen goedkeuring van het token zelf.':'Goedkeuring is een beheerbeoordeling binnen deze test.'}</p><p>{visitor?'Geen bewijs van tokenmakerschap, veiligheid of investeringswaarde. De eigendomscontrole is een momentopname.':'Geen bewijs van tokenmakerschap of veiligheid. Geen nieuwe NFT en niet publiek zichtbaar. De eigendomscontrole is een momentopname.'}</p></footer>
  </article>;
}