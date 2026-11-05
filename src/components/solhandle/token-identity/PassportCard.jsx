import { Fingerprint, Link2 } from 'lucide-react';
import '@/components/solhandle/token-identity/passport-card.css';
const reviews={pending:'Wacht op beoordeling',approved:'Goedgekeurd (test)',rejected:'Afgewezen',suspended:'Opgeschort'};
export default function PassportCard({data}) {
  const {item,ownership,checked_at,preview_available}=data;
  const ownershipLabel=ownership==='observed'?'Oorspronkelijke wallet is eigenaar':ownership==='historical'?'Historisch: handle heeft een andere eigenaar':'Huidig eigendom niet bevestigd';
  return <article className="token-passport-card" aria-label="Token Identity testpaspoort">
    <header className="token-passport-top"><div className="token-passport-brand"><Fingerprint size={26} aria-hidden="true"/><div><strong>SOLHANDLE</strong><span>TOKEN IDENTITY PASSPORT</span></div></div><span className="token-passport-private">PRIVÉTEST</span></header>
    <div className="token-passport-identity"><div className="token-passport-monogram" aria-hidden="true">{(item.token_symbol||item.token_name||'T').slice(0,2).toUpperCase()}</div><div><span className="token-passport-caption">TOKEN</span><h2>{item.token_name||'Naam niet beschikbaar'}</h2><p>{item.token_symbol?'$'+item.token_symbol.replace(/^\$/,'').toUpperCase():'Symbool niet beschikbaar'} · Solana Mainnet</p></div></div>
    <div className="token-passport-binding"><Link2 size={22} aria-hidden="true"/><div><span className="token-passport-caption">DOOR WALLET ONDERTEKENDE KOPPELING</span><strong>@{item.handle}</strong></div><span className="token-passport-review" data-review={item.status}>{reviews[item.status]||item.status}</span></div>
    <dl className="token-passport-fields"><div><dt>Tokenadres</dt><dd className="select-text">{item.mint}</dd></div><div><dt>Ondertekend door</dt><dd className="select-text">{item.wallet}</dd></div><div><dt>Vastgelegd</dt><dd>{new Date(item.created_at).toLocaleString('nl-BE')}</dd></div><div><dt>Paspoortreferentie</dt><dd className="select-text">{item.id}</dd></div></dl>
    <div className="token-passport-observation" data-current={preview_available?'yes':'no'}><strong>{preview_available?'Testpaspoort goedgekeurd; eigendom bij controle bevestigd':'Geen actueel goedgekeurd paspoort bevestigd'}</strong><p>{ownershipLabel} · gecontroleerd {new Date(checked_at).toLocaleString('nl-BE')}</p></div>
    <footer className="token-passport-footer"><strong>Wat bewijst dit?</strong><p>Deze wallet heeft de koppeling tussen dit tokenadres en @{item.handle} ondertekend. Goedkeuring is een beheerbeoordeling binnen deze test.</p><p>Geen bewijs van tokenmakerschap of veiligheid. Geen nieuwe NFT en niet publiek zichtbaar. De eigendomscontrole is een momentopname.</p></footer>
  </article>;
}