import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { passportAddress } from '../../shared/tokenPassportMetadata.ts';
import { publicIdentityRows } from '../../shared/tokenIdentityPublication.ts';
import { publicTokenCheck } from '../../shared/publicTokenCheck.ts';
import { passportPublicAuthority } from '../../shared/passportPublicAuthority.ts';
import { publicProjectPassports } from '../../shared/publicProjectPassports.ts';
import { handleProfileArtwork } from '../../shared/handleProfileArtwork.ts';
const cache=new Map();
export default async function(req) {
  const headers={'Cache-Control':'no-store'};
  try {
    if(req.method!=='POST')return Response.json({error:'Use POST.'},{status:405,headers});
    const raw=await req.text();
    if(raw.length>4500)return Response.json({error:'Request too large.'},{status:413,headers});
    let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'Invalid request.'},{status:400,headers});}
    if(body?.action==='directory')return Response.json(await publicProjectPassports(createClientFromRequest(req),body,secrets.get('SOLANA_RPC_URL')),{headers});
    if(!body||typeof body.mint!=='string')return Response.json({error:'Enter a Solana token address.'},{status:400,headers});
    let mint;try{mint=passportAddress(body.mint.trim());}catch{return Response.json({error:'Enter a valid Solana address.'},{status:400,headers});}
    const client=createClientFromRequest(req);
    // Intentionally public, user-scoped reads of the public projection only. Never reads the private test register.
    const projection=await publicIdentityRows(client.entities,mint);
    const {binding,version}=await passportPublicAuthority(client.asServiceRole.entities,projection);
    if(body.action==='passport') {
      if(!binding?.project_reviewed)return Response.json({error:'No public project passport found.'},{status:404,headers});
      const result=await publicTokenCheck(secrets.get('SOLANA_RPC_URL'),mint,binding);
      const [passport]=await handleProfileArtwork(secrets.get('SOLANA_RPC_URL'),[{mint,reference:binding.association_id,handle:binding.handle,wallet:binding.wallet,owner:binding.wallet,assetAddress:binding.asset,token_name:binding.token_name||result.token?.name||'',token_symbol:binding.token_symbol||result.token?.symbol||'',token_logo:binding.token_logo||result.token?.logo||null,project_website:binding.project_website||null,project_reviewed_at:binding.project_reviewed_at||null,published_at:binding.published_at}]);
      return Response.json({passport,result},{headers});
    }
    const key=mint+':'+(binding?.id||'none')+':'+(binding?.updated_date||'')+':'+version,cached=cache.get(key);
    if(cached&&Date.now()-cached.at<30000)return Response.json({...cached.result,cached:true},{headers});
    const result=await publicTokenCheck(secrets.get('SOLANA_RPC_URL'),mint,binding);
    if(cache.size>=100)cache.delete(cache.keys().next().value);
    cache.set(key,{at:Date.now(),result});
    return Response.json({...result,cached:false},{headers});
  } catch(error) {
    if(error.status===400)return Response.json({error:error.message},{status:400,headers});
    return Response.json({error:error.status===409?'Multiple associations found. An administrator needs to review this.':'Token check temporarily unavailable. Please try again later.'},{status:error.status===409?409:503,headers});
  }
}