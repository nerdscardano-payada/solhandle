import { ArrowUpRight, Coins } from 'lucide-react';
import '@/components/solhandle/design/claim-token-note.css';

export default function ClaimTokenNote() {
  return <aside className="sd-claim-token" aria-label="$HANDLE within SolHandle">
    <span className="sd-claim-token-mark" aria-hidden="true"><Coins size={20}/></span>
    <div className="sd-claim-token-copy">
      <span className="sd-claim-token-label">PART OF OUR ECOSYSTEM</span>
      <h2>$HANDLE. The token behind the ecosystem.</h2>
      <p>Your @handle is your identity. $HANDLE is our token within SolHandle.</p>
      <details>
        <summary>Discover $HANDLE <ArrowUpRight size={14} aria-hidden="true"/></summary>
        <div className="sd-claim-token-details">
          <p>An @handle and $HANDLE are not the same: your handle is a unique name you own as an NFT. $HANDLE is a separate, fungible token.</p>
          <p>Holding tokens does not give you ownership of an @handle and is not proof of identity or trust.</p>
        </div>
      </details>
    </div>
  </aside>;
}