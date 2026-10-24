import { useEffect, useRef } from 'react';
import { X, Fingerprint, ArrowRight, Wallet, ShieldCheck } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import PayPreview from '@/components/solhandle/design/PayPreview';
import PreviewProfileEditor from '@/components/solhandle/design/PreviewProfileEditor';
export default function PreviewDialog() {
  const d = useDesign();
  const ref = useRef(null);
  useEffect(() => { if (d.dialog && ref.current) ref.current.showModal(); }, [d.dialog]);
  if (!d.dialog) return null;
  const content = {
    reply: ['Reageren op een bericht', 'Reacties horen bij de openbare tijdlijn, niet bij privégesprekken. In het uiteindelijke ontwerp opent hier de berichtthread met een reactieveld.', 'Terug naar de tijdlijn', null],
    identity: ['Jouw Identity', 'Je sociale profiel en NFT-handles beheer je vanuit dezelfde accountingang, met gescheiden rechten.', 'Mijn handles', 'Sociaal profiel bewerken'],
    wallet: ['Je eigen wallet. Jouw controle.', 'Dit is een visuele walletstap. Er wordt geen echte wallet geopend of verbonden.', 'Bekijk verbonden toestand', null],
    session: ['Eén naam. Een eigen sociaal account.', 'Een verbonden wallet is nog geen sociale aanmelding. Publieke walletaanmelding moet veilig worden ontwikkeld voordat deze flow live gaat.', 'Bekijk aangemelde toestand', null],
    claim: [`Jouw naam: @${d.search || 'ansem'}`, 'Dit toont de claimervaring, niet de werkelijke beschikbaarheid of prijs. De bestaande claimfunctie blijft ongewijzigd.', 'Bekijk Identity', 'Ontdek Network'],
    token: ['$HANDLE. Onze ecosysteemtoken.', 'Jouw @handle is je unieke identiteit als NFT. $HANDLE is onze afzonderlijke, uitwisselbare token binnen SolHandle. Tokenbezit geeft op zichzelf geen eigendom van een @handle en is geen bewijs van identiteit of vertrouwen.', 'Terug naar het ecosysteem', null],
    developers: ['Bouw verder met SolHandle', 'De bestaande SDK, resolver en integratiehandleidingen blijven de basis. Dit concept bouwt geen tweede infrastructuur.', 'Terug naar het ontwerp', null],
    share: ['Jouw profiel delen', 'Een publieke @handle-URL vraagt een actuele, geverifieerde sociale koppeling. Dit prototype maakt geen echte profielkoppeling aan.', 'Begrepen', null]
  };
  const item = content[d.dialog];
  const primary = () => { if (['wallet','session'].includes(d.dialog)) { d.setScenario('ready'); d.setDialog(null); } else if (d.dialog === 'claim') d.setDialog('identity'); else if (d.dialog === 'identity') d.setDialog('handles'); else d.setDialog(null); };
  return <dialog ref={ref} className="sd-dialog" aria-label="Ontwerpdetail" onCancel={() => d.setDialog(null)} onClick={e => { if (e.target === ref.current) d.setDialog(null); }}><button className="sd-dialog-close sd-icon-button" aria-label="Sluiten" onClick={() => d.setDialog(null)}><X size={20}/></button>{d.dialog === 'edit-profile' ? <PreviewProfileEditor/> : d.dialog === 'pay' ? <PayPreview/> : d.dialog === 'handles' ? <div className="sd-dialog-body"><span className="sd-dialog-symbol"><Fingerprint size={32}/></span><span className="sd-eyebrow">IDENTITY / VOORBEELD</span><h2>Mijn handles</h2><div className="sd-owned-handle"><strong>{d.handle || 'Nog geen handle'}</strong><span className="sd-tiny-pill">{d.handle ? 'Primary · voorbeeld' : 'Claim je eerste naam'}</span></div><p>Een handle verkopen draagt nooit je sociale account, posts of berichten over.</p><button className="sd-button sd-gradient" onClick={() => d.go('public')}>Een handle zoeken <ArrowRight size={16}/></button></div> : <div className="sd-dialog-body"><span className="sd-dialog-symbol">{d.dialog === 'wallet' ? <Wallet size={32}/> : <Fingerprint size={32}/>}</span><span className="sd-eyebrow">SOLHANDLE / ONTWERPVOORBEELD</span><h2>{item?.[0]}</h2><p>{item?.[1]}</p>{d.dialog === 'identity' && <div className="sd-owned-handle"><strong>{d.handle || 'Nog geen handle'}</strong><span className="sd-tiny-pill">Primary · voorbeeld</span></div>}<button className="sd-button sd-gradient" onClick={primary}>{item?.[2]} <ArrowRight size={16}/></button>{item?.[3] && <button className="sd-button sd-secondary" onClick={() => d.dialog === 'identity' ? (d.go('profile'), d.setDialog('edit-profile')) : d.go('home')}>{item[3]}</button>}<small className="sd-dialog-note"><ShieldCheck size={14}/> Alleen ontwerp; bestaande functies blijven ongewijzigd.</small></div>}</dialog>;
}