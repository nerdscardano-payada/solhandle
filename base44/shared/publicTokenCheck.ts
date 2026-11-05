import { assertPassportMainnet, passportToken } from './tokenPassportMetadata.ts';
import { resolveOnChain } from './solhandleResolver.ts';
export async function publicTokenCheck(url,mint,binding) {
  const base={mint,attempted_at:new Date().toISOString(),checked_at:null,last_verified_at:binding?.last_verified_at||null,binding:binding?{handle:binding.handle,wallet:binding.wallet,asset:binding.asset,published_at:binding.published_at,withdrawn_at:binding.withdrawn_at||null}:null};
  if(binding?.status==='WITHDRAWN') return {...base,status:'WITHDRAWN'};
  try {
    await assertPassportMainnet(url);
    let token;
    try {token=await passportToken(url,mint);} catch(error) {if(error.status===400)return {...base,status:'NOT_TOKEN',checked_at:new Date().toISOString()};throw error;}
    const tokenInfo={name:token.name,symbol:token.symbol};
    if(!binding)return {...base,status:'NOT_REGISTERED',token:tokenInfo,checked_at:new Date().toISOString()};
    const owner=await resolveOnChain(url,binding.handle),checked_at=new Date().toISOString();
    const active=owner?.verified===true&&owner.address===binding.wallet&&owner.assetAddress===binding.asset;
    return {...base,status:active?'ACTIVE':'OWNERSHIP_CHANGED',token:tokenInfo,checked_at,last_verified_at:active?checked_at:base.last_verified_at};
  } catch {return {...base,status:'UNAVAILABLE'};}
}