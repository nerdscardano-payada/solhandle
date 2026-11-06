import { Link } from 'react-router-dom';
import { ArrowUpRight, Fingerprint, Repeat2, ShieldCheck } from 'lucide-react';
import '@/components/solhandle/names/secondary-market.css';

export default function SecondaryMarketGuide({handle, asset, onBrowse}) {
  const validAsset=/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(asset || '');
  const marketUrl=validAsset ? `https://magiceden.io/item-details/${asset}` : 'https://magiceden.io/marketplace/solhandle';
  return <section className="secondary-market-guide" aria-label="Secondary market">
    <div className="secondary-market-intro">
      <div><p className="secondary-market-eyebrow"><Repeat2 size={16}/>SECONDARY MARKET · EXTERNAL TRADING</p><h2>{handle ? `A new chapter for @${handle}.` : 'Great @handles can find a new owner.'}</h2><p>Discover already-minted handles and explore resale on external marketplaces. You keep control of your NFT; SolHandle does not run the sale.</p></div>
      <a className="secondary-market-provider" href={marketUrl} target="_blank" rel="noopener noreferrer"><Repeat2 size={32}/><strong>Magic Eden</strong><span>{validAsset ? `View @${handle} NFT` : 'Explore the marketplace'}<ArrowUpRight size={16}/></span></a>
    </div>
    <ol className="secondary-market-steps">
      <li><Fingerprint size={20}/><div><strong>01 · Own your @</strong><p>Your handle is an NFT held in your wallet, not a SolHandle account balance.</p></div></li>
      <li><Repeat2 size={20}/><div><strong>02 · List externally</strong><p>Connect the owning wallet on a marketplace that supports your NFT. Review its fees and listing terms before signing.</p></div></li>
      <li><ShieldCheck size={20}/><div><strong>03 · Trade with care</strong><p>Check the official collection, exact NFT address and current price there. Completed NFT transfers change handle ownership.</p></div></li>
    </ol>
    <div className="secondary-market-footer">{onBrowse ? <button type="button" className="ep-link" onClick={onBrowse}>Browse checked offers<ArrowUpRight size={16}/></button> : <Link className="ep-link" to="/names?tab=for-sale">Browse checked offers<ArrowUpRight size={16}/></Link>}<p>A marketplace link is not proof of an active listing. Availability, fees and purchases are confirmed externally.</p></div>
  </section>;
}