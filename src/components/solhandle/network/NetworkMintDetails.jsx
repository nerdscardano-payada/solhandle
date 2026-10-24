import { Link } from 'react-router-dom';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { Image } from '@/components/ui/image';
import IdentityCopy from '@/components/solhandle/profile/IdentityCopy';

export default function NetworkMintDetails({ identity, refresh }) {
  const facts = [['Current owner', identity.address], ['Asset address', identity.assetAddress], ['Official collection', identity.collectionAddress], ['Handle record', identity.handlePda]];
  return <section className="space-y-5 p-5" aria-label="Live handle NFT details">
    <div><h2 className="text-xl font-semibold">Your handle, your identity</h2><p className="mt-2 text-sm text-identity-muted">The mint image belongs to the handle NFT. Your profile picture and social history are separate.</p></div>
    <div className="grid gap-6 width-min-[1100px]:grid-cols-2">
      <figure className="min-w-0"><div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-identity-border bg-hero-surface">{identity.image ? <Image src={identity.image} alt={`Mint image of ${identity.handle}`} className="h-full w-full" fittingType="fit"/> : <p className="p-6 text-center text-sm text-identity-muted">The mint image is currently unavailable. No example image is substituted.</p>}</div><figcaption className="mt-2 text-xs text-identity-muted">{identity.handle} · NFT metadata image</figcaption></figure>
      <div className="min-w-0 space-y-4"><h3 className="break-words text-2xl font-semibold" data-no-translate>{identity.handle}</h3><dl className="space-y-4 text-sm">
        <div><dt className="text-identity-muted">Network / NFT standard</dt><dd>Solana Mainnet · {identity.standard}</dd></div>
        {facts.map(([label, value]) => <div key={label}><dt className="text-identity-muted">{label}</dt><dd className="mt-1 flex items-start gap-2"><a href={`https://explorer.solana.com/address/${value}`} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all font-mono text-xs text-names-accent">{value} ↗</a><IdentityCopy value={value} label={`Copy ${label.toLowerCase()}`}/></dd></div>)}
        <div><dt className="text-identity-muted">Ownership / collection</dt><dd>Checked on-chain</dd></div>
        <div><dt className="text-identity-muted">Primary handle</dt><dd>{identity.primaryActive === null ? 'Could not be checked' : identity.primaryActive ? 'Active for current owner' : 'Not active for current owner'}</dd></div>
        <div><dt className="text-identity-muted">Last checked</dt><dd>{new Date(identity.checkedAt).toLocaleString()}</dd></div>
      </dl></div>
    </div>
    <div className="flex flex-wrap gap-3"><button type="button" onClick={refresh} className="social-action social-action-secondary"><RefreshCw className="h-4 w-4"/>Refresh on-chain</button><Link to={`/${encodeURIComponent(identity.handle.replace(/^@/, ''))}`} className="social-action social-action-secondary">Open handle page<ArrowUpRight className="h-4 w-4"/></Link>{identity.metadataUri && <a href={identity.metadataUri} target="_blank" rel="noopener noreferrer" className="social-action social-action-secondary">NFT metadata<ArrowUpRight className="h-4 w-4"/></a>}</div>
    <p className="text-xs leading-relaxed text-identity-muted">Ownership is not a trust, KYC or investment endorsement. Transferring this NFT does not transfer the Network account, posts or contacts. Original mint price, date and transaction are not supplied by this lookup.</p>
  </section>;
}