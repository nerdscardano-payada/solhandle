import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fingerprint, ShieldCheck } from 'lucide-react';
import { Image } from '@/components/ui/image';
export default function DiscoverPassportCard({item}) {
  const [failed,setFailed]=useState(false);
  return <article className="rounded-2xl border border-ecosystem-border bg-ecosystem-card p-5 text-ecosystem-text">
    <header className="mb-5 flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-xs font-semibold tracking-widest text-ecosystem-cyan"><Fingerprint size={18}/>TOKEN PASSPORT</span><span className="flex items-center gap-1 text-xs text-ecosystem-success"><ShieldCheck size={15}/>Project reviewed</span></header>
    <div className="mb-4 flex items-center gap-3"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ecosystem-raised text-xl font-bold">{item.token_logo&&!failed?<Image src={item.token_logo} alt={item.token_name||'Token logo'} fittingType="fit" className="h-full w-full" onError={()=>setFailed(true)}/>:<span>{(item.token_symbol||item.token_name||'T').slice(0,2).toUpperCase()}</span>}</div><div className="min-w-0"><h2 className="break-words text-xl font-bold">{item.token_name||'Unnamed token'}</h2><p className="text-sm text-ecosystem-muted">{item.token_symbol?'$'+item.token_symbol.replace(/^\$/,''): 'Solana Mainnet'}</p></div></div>
    <Link className="ep-link text-lg" to={`/profile/${item.handle}`}>@{item.handle}</Link><p className="my-3 break-all font-mono text-xs text-ecosystem-muted">{item.mint}</p>
    <p className="mb-4 text-xs text-ecosystem-muted">Project evidence reviewed {new Date(item.project_reviewed_at).toLocaleDateString('en-GB')}.</p>
    <div className="flex flex-wrap items-center gap-4"><Link className="ep-button ep-primary" to={`/token-check?mint=${encodeURIComponent(item.mint)}`}>Open passport</Link>{item.project_website?.startsWith('https://')&&<a className="ep-link" href={item.project_website} target="_blank" rel="noopener noreferrer">Project website</a>}</div>
  </article>;
}