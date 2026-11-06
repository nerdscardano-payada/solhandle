import { useState } from 'react';
import { ArrowLeftRight, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export default function ProjectPassportTrade({mint}) {
  const [copyMessage,setCopyMessage]=useState('');
  async function copyAddress(event) {
    event.preventDefault();
    try { await navigator.clipboard.writeText(mint);setCopyMessage('Token address copied. Paste it into the platform’s token search.'); }
    catch { setCopyMessage('Copy the full address shown above manually.'); }
  }
  if(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint||''))return null;
  const token=encodeURIComponent(mint);
  const platforms=[
    {name:'Jupiter · token page',url:`https://jup.ag/tokens/${token}`}
  ];
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><button type="button" className="ep-button min-h-11"><ArrowLeftRight size={16}/>Trade<ChevronDown size={16}/></button></DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-72 max-w-[calc(100vw-2rem)] border-ecosystem-border bg-ecosystem-card text-ecosystem-text">
      <DropdownMenuLabel>Trade on an external platform</DropdownMenuLabel>
      <p className="px-2 py-1 text-xs text-ecosystem-muted">Exact passport token address</p>
      <p className="select-text break-all px-2 pb-2 font-mono text-xs">{mint}</p>
      <DropdownMenuItem onSelect={copyAddress} className="min-h-11 cursor-pointer focus:bg-ecosystem-raised focus:text-ecosystem-text"><Copy size={16}/>Copy token address</DropdownMenuItem>
      {copyMessage&&<p role="status" className="px-2 py-2 text-xs text-ecosystem-muted">{copyMessage}</p>}
      <DropdownMenuSeparator className="bg-ecosystem-border"/>
      {platforms.map(platform=><DropdownMenuItem key={platform.name} asChild className="min-h-11 cursor-pointer focus:bg-ecosystem-raised focus:text-ecosystem-text"><a href={platform.url} target="_blank" rel="noopener noreferrer">{platform.name}<ExternalLink className="ml-auto"/></a></DropdownMenuItem>)}
      <DropdownMenuSeparator className="bg-ecosystem-border"/>
      <p className="px-2 py-2 text-xs text-ecosystem-muted">Opens this token’s page on Jupiter. Verify the exact token address before trading. Availability and liquidity are not checked. A passport is not a safety endorsement or investment advice.</p>
    </DropdownMenuContent>
  </DropdownMenu>;
}