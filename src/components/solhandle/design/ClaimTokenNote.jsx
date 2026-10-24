import { ArrowUpRight, Coins } from 'lucide-react';
import '@/components/solhandle/design/claim-token-note.css';

export default function ClaimTokenNote() {
  return <aside className="sd-claim-token" aria-label="$HANDLE binnen SolHandle">
    <span className="sd-claim-token-mark" aria-hidden="true"><Coins size={20}/></span>
    <div className="sd-claim-token-copy">
      <span className="sd-claim-token-label">ONDERDEEL VAN ONS ECOSYSTEEM</span>
      <h2>$HANDLE. De token achter het ecosysteem.</h2>
      <p>Jouw @handle is je identiteit. $HANDLE is onze token binnen SolHandle.</p>
      <details>
        <summary>Ontdek $HANDLE <ArrowUpRight size={14} aria-hidden="true"/></summary>
        <div className="sd-claim-token-details">
          <p>Een @handle en $HANDLE zijn niet hetzelfde: je handle is een unieke naam die je bezit als NFT. $HANDLE is een afzonderlijke, uitwisselbare token.</p>
          <p>Tokenbezit geeft op zichzelf geen eigendom van een @handle en is geen bewijs van identiteit of vertrouwen.</p>
        </div>
      </details>
    </div>
  </aside>;
}