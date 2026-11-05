import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { readPassportTest, changePassportTest, passportFailure, passportEvent, passportItem } from '../../shared/tokenPassportTestStore.ts';
import { assertPassportMainnet, passportToken, passportAddress } from '../../shared/tokenPassportMetadata.ts';
import { passportInput, passportOwner, issuePassportChallenge, savePassportAssociation } from '../../shared/tokenPassportTestProof.ts';
import { resolveOnChain } from '../../shared/solhandleResolver.ts';
import { passportTestPage, passportEvidenceCsv } from '../../shared/tokenPassportTestQueries.ts';
import { passportPublication } from '../../shared/tokenIdentityPublication.ts';
import { passportTokenLogo } from '../../shared/passportTokenLogo.ts';
export default async function(req) {
  const headers={'Cache-Control':'no-store'};
  try {
    if(req.method!=='POST') return Response.json({error:'Use POST.'},{status:405,headers});
    const client=createClientFromRequest(req), user=await client.auth.me().catch(error=>error.status===401?null:Promise.reject(error));
    if(!user) return Response.json({error:'Sign in as an administrator.'},{status:401,headers});
    if(user.role!=='admin') return Response.json({error:'This test workspace is administrator-only.'},{status:403,headers});
    const raw=await req.text();
    if(raw.length>7000) return Response.json({error:'Request too large.'},{status:413,headers});
    let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'Invalid request.'},{status:400,headers});}
    if(!body||typeof body!=='object'||Array.isArray(body)) return Response.json({error:'Invalid request.'},{status:400,headers});
    const action=body.action;
    if(!['list','lookup','challenge','create','inspect','review','exportEvidence','publication','publishChallenge','publish','withdrawPublic'].includes(action)) return Response.json({error:'Unknown test operation.'},{status:400,headers});
    const db=client.entities;
    const registry=await readPassportTest(db);
    if(action==='list') return Response.json(passportTestPage(registry,body),{headers});
    if(action==='exportEvidence') return Response.json(passportEvidenceCsv(registry,body),{headers});
    if(action==='lookup') passportAddress(body.mint);
    if(action==='challenge'||action==='create') passportInput(body);
    if(action==='inspect'||action==='review') passportItem(registry,body.id);
    const url=secrets.get('SOLANA_RPC_URL');
    const origin=new URL(req.headers.get('X-Base44-App-Url')||'https://sol-handle-core.base44.app').origin;
    if(['publication','withdrawPublic'].includes(action)) return Response.json(await passportPublication(db,url,user,registry,passportItem(registry,body.id),body,origin),{headers});
    await assertPassportMainnet(url);
    if(['publishChallenge','publish'].includes(action)) return Response.json(await passportPublication(db,url,user,registry,passportItem(registry,body.id),body,origin),{headers});
    if(action==='lookup') return Response.json({token:await passportToken(url,body.mint)},{headers});
    if(action==='challenge') return Response.json(await issuePassportChallenge(db,url,user,passportInput(body),origin),{headers});
    if(action==='create') return Response.json(await savePassportAssociation(db,url,user,body,origin,registry,await passportToken(url,body.mint)),{headers});
    const item=passportItem(registry,body.id);
    if(action==='inspect') {
      let current=null,ownership='unavailable';
      try {current=await resolveOnChain(url,item.handle);ownership=current?.address===item.wallet&&current.assetAddress===item.asset?'observed':'historical';} catch {ownership='unavailable';}
      const token_logo=await passportTokenLogo(url,item.mint);
      return Response.json({item,token_logo,history:registry.history.filter(row=>row.association_id===item.id),ownership,checked_at:new Date().toISOString(),preview_available:item.status==='approved'&&ownership==='observed',environment:'ADMIN_TEST'},{headers});
    }
    if(!['approved','rejected','suspended'].includes(body.status)||typeof body.reason!=='string'||body.reason.trim().length<5||body.reason.length>300||!Number.isInteger(body.revision)) return Response.json({error:'Choose a decision and give a reason of 5–300 characters.'},{status:400,headers});
    if(item.revision!==body.revision) throw passportFailure('This registration changed. Reload before reviewing.',409);
    if(body.status==='approved') await passportOwner(url,item.handle,item.wallet,item.asset);
    if(body.status!=='approved') {
      const published=await db.PublicTokenIdentity.filter({association_id:item.id,status:'ACTIVE'},{limit:2});
      for(const row of published.items) await db.PublicTokenIdentity.update(row.id,{status:'WITHDRAWN',withdrawn_at:new Date().toISOString()});
    }
    const result=await changePassportTest(db,state=>{
      const live=passportItem(state,body.id);
      if(live.revision!==body.revision) throw passportFailure('This registration changed. Reload before reviewing.',409);
      live.status=body.status;live.review_reason=body.reason.trim();live.revision+=1;live.reviewed_at=new Date().toISOString();
      if(body.status==='approved'){live.checked_at=new Date().toISOString();live.ownership='observed';}
      passportEvent(state,live,user.id,'review_'+body.status,live.review_reason);
      return {id:live.id};
    });
    return Response.json(result,{headers});
  } catch(error) {
    const status=error.status||503;
    return Response.json({error:error.status?error.message:'Chain verification is temporarily unavailable. Nothing has been published. Retry when the connection is available.'},{status,headers});
  }
}