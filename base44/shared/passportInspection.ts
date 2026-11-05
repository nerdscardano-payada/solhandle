import { resolveOnChain } from './solhandleResolver.ts';
import { passportTokenLogo } from './passportTokenLogo.ts';
export async function inspectPassport(url,item) {
  let ownership='unavailable';
  try {const current=await resolveOnChain(url,item.handle);ownership=current?.verified&&current.address===item.wallet&&current.assetAddress===item.asset?'observed':'historical';}catch{ownership='unavailable';}
  return {item,token_logo:await passportTokenLogo(url,item.mint),ownership,checked_at:new Date().toISOString(),preview_available:item.status==='approved'&&ownership==='observed'};
}