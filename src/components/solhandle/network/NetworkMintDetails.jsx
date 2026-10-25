import { Link } from 'react-router-dom';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { Image } from '@/components/ui/image';
import IdentityCopy from '@/components/solhandle/profile/IdentityCopy';

export default function NetworkMintDetails({ identity, refresh }) {
  const facts = [['Current owner', identity.address], ['Asset address', identity.assetAddress], ['Official collection', identity.collectionAddress], ['Handle record', identity.handlePda]];
  return <section className="sd-profile-detail sd-profile-identity" aria-label="Live handle NFT details">
    <h2>Your handle, your identity</h2><p>The mint image belongs to the handle NFT. Your profile picture and social history are separate.</p>
    <div className="sd-profile-identity-grid">
      <figure className="sd-profile-mint">{identity.image ? <Image src={identity.image} alt={`Mint image of ${identity.handle}`} className="sd-profile-mint-image" fittingType="fit"/> : <div className="sd-profile-mint-placeholder">The mint image is currently unavailable. No example image is substituted.</div>}<figcaption>{identity.handle} · NFT metadata image</figcaption></figure>
      <div className="sd-profile-identity-data"><span className="sd-eyebrow">PRIMARY HANDLE · ON-CHAIN DETAILS</span><h3 data-no-translate>{identity.handle}</h3><dl><div><dt>Network / NFT standard</dt><dd>Solana Mainnet · {identity.standard}</dd></div>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><span><a href={`https://explorer.solana.com/address/${value}`} target="_blank" rel="noopener noreferrer">{value}<ArrowUpRight size={14}/></a><IdentityCopy value={value} label={`Copy ${label.toLowerCase()}`}/></span></dd></div>)}<div><dt>Ownership / collection</dt><dd>Checked on-chain</dd></div><div><dt>Primary handle</dt><dd>{identity.primaryActive === null ? 'Could not be checked' : identity.primaryActive ? 'Active for current owner' : 'Not active for current owner'}</dd></div><div><dt>Last checked</dt><dd>{new Date(identity.checkedAt).toLocaleString('en-US')}</dd></div></dl><small>Ownership is not a trust, KYC or investment endorsement. The image alone does not prove ownership.</small><Link to={`/${encodeURIComponent(identity.handle.replace(/^@/, ''))}`} className="sd-button sd-secondary">Open public handle page <ArrowUpRight size={15}/></Link></div>
    </div>
    <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={refresh} className="sd-button sd-secondary"><RefreshCw size={15}/>Refresh on-chain</button>{identity.metadataUri && <a href={identity.metadataUri} target="_blank" rel="noopener noreferrer" className="sd-button sd-secondary">NFT metadata<ArrowUpRight size={15}/></a>}</div>
    <p>Transferring this NFT does not transfer the Network account, posts or contacts. Original mint price, date and transaction are not supplied by this lookup.</p>
  </section>;
}