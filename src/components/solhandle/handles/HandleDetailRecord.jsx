import { Database, ExternalLink } from 'lucide-react';
import { lamportsToSol, shortenAddress } from '@/lib/solhandle';
export default function HandleDetailRecord({ handle, data, invalid, available, owner }) {
  const restriction = data?.restriction;
  const rarity = handle.length === 1 ? 'Legendary' : handle.length === 2 ? 'Ultra Rare' : handle.length === 3 ? 'Rare' : handle.length === 4 ? 'Uncommon' : 'Standard';
  const rows = [
    { label: 'Status', value: !data ? 'Checking…' : invalid ? 'Invalid handle' : data.status || 'AVAILABLE', tone: available ? 'success' : '' },
    ...(restriction ? [{ label: restriction.restrictionType === 'RESERVED' ? 'Reserved for' : 'Protection reason', value: restriction.reservedFor }] : []),
    { label: 'Current owner', value: owner ? shortenAddress(owner) : '—' },
    { label: 'Mint price', value: data?.priceLamports ? `${lamportsToSol(data.priceLamports)} SOL` : '—' },
    { label: 'Rarity tier', value: rarity, tone: 'purple' },
    { label: 'Name class', value: data?.nameClass || 'Standard' },
    ...(data?.handleScore ? [{ label: 'Handle Score', value: `${data.handleScore} / 100`, tone: 'cyan' }] : []),
    ...(data?.categories?.length ? [{ label: 'Categories', value: data.categories.join(' · ') }] : []),
    ...(data?.tags?.length ? [{ label: 'Tags', value: data.tags.join(' · ') }] : []),
    { label: 'Metaplex Core asset', value: data?.assetAddress ? <a href={`https://explorer.solana.com/address/${data.assetAddress}`} target="_blank" rel="noreferrer" className="ep-link">{shortenAddress(data.assetAddress)}<ExternalLink size={13}/></a> : '—' },
    { label: 'Collection', value: 'Metaplex Core · SOLHANDLE Collection' },
    { label: 'Handle length', value: `${handle.length} characters` }
  ];
  return <section className="ep-card el-handle-record"><div className="ep-card-heading"><h2><Database size={19}/>Handle record</h2></div><dl>{rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd data-tone={row.tone}>{row.value}</dd></div>)}</dl></section>;
}