import { ArrowLeftRight, ChevronDown, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export default function ProjectPassportTrade({mint}) {
  if(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint||''))return null;
  const token=encodeURIComponent(mint),sol='So11111111111111111111111111111111111111112';
  const platforms=[
    {name:'Jupiter',url:`https://jup.ag/swap/SOL-${token}`},
    {name:'Raydium',url:`https://raydium.io/swap/?inputMint=sol&outputMint=${token}`},
    {name:'Orca',url:`https://www.orca.so/trade?tokenIn=${sol}&tokenOut=${token}`}
  ];
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><button type="button" className="ep-button min-h-11"><ArrowLeftRight size={16}/>Trade<ChevronDown size={16}/></button></DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-72 max-w-[calc(100vw-2rem)] border-ecosystem-border bg-ecosystem-card text-ecosystem-text">
      <DropdownMenuLabel>Trade on an external platform</DropdownMenuLabel>
      {platforms.map(platform=><DropdownMenuItem key={platform.name} asChild className="min-h-11 cursor-pointer focus:bg-ecosystem-raised focus:text-ecosystem-text"><a href={platform.url} target="_blank" rel="noopener noreferrer">{platform.name}<ExternalLink className="ml-auto"/></a></DropdownMenuItem>)}
      <DropdownMenuSeparator className="bg-ecosystem-border"/>
      <p className="px-2 py-2 text-xs text-ecosystem-muted">Links use this passport’s exact token address. Availability and liquidity are not checked. Verify the address and fees before trading. A passport is not a safety endorsement or investment advice.</p>
    </DropdownMenuContent>
  </DropdownMenu>;
}