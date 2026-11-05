import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { passportFailure, passportItem, readPassportTest } from '../../shared/tokenPassportTestStore.ts';
import { passportAddress, assertPassportMainnet, passportToken } from '../../shared/tokenPassportMetadata.ts';
import { memberPassportChallenge, verifyMemberPassport } from '../../shared/memberPassportProof.ts';
import { memberRegistration } from '../../shared/memberPassportRegistration.ts';
import { passportPublication } from '../../shared/tokenIdentityPublication.ts';
import { inspectPassport } from '../../shared/passportInspection.ts';
export default async function(req) {
  const headers={'Cache-Control':'no-store'};
  try {
    if(req.method!=='POST')return Response.json({error:'Use POST.'},{status:405,headers});
    const raw=await req.text();
    if(raw.length>16000)return Response.json({error:'Request too large.'},{status:413,headers});
    let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'Invalid request.'},{status:400,headers});}
    if(!body||typeof body!=='object'||Array.isArray(body))return Response.json({error:'Invalid request.'},{status:400,headers});
    if(!['accessChallenge','list','lookup','challenge','create','inspect','publication','publishChallenge','publish','withdrawPublic'].includes(body.action))return Response.json({error:'Unsupported member operation.'},{status:400,headers});
    const origin=new URL(req.headers.get('X-Base44-App-Url')||'https://sol-handle-core.base44.app').origin;
    if(body.action==='accessChallenge')return Response.json(await memberPassportChallenge(passportAddress(body.wallet),origin,'access'),{headers});
    // A wallet signature authenticates this narrow operation, not a Base44 login.
    // No entity access occurs before the server-issued wallet proof is verified.
    const auth=await verifyMemberPassport(body.accessProof,body.accessSignature,origin,'access');
    const db=createClientFromRequest(req).asServiceRole.entities,url=secrets.get('SOLANA_RPC_URL');
    const registry=await readPassportTest(db);
    if(body.action==='list')return Response.json({items:registry.items.filter(item=>item.source==='MEMBER'&&item.wallet===auth.wallet).map(({id,handle,mint,status,token_name,created_at})=>({id,handle,mint,status,token_name,created_at})),pilot_capacity:20},{headers});
    if(body.action==='lookup') {await assertPassportMainnet(url);return Response.json({token:await passportToken(url,body.mint)},{headers});}
    if(['challenge','create'].includes(body.action)) {
      await assertPassportMainnet(url);
      if(registry.items.length>=20)throw passportFailure('This limited pilot is full. Contact the operator before registering another association.',409);
      return Response.json(await memberRegistration(db,url,auth.wallet,origin,body),{headers});
    }
    const item=passportItem(registry,body.id);
    if(item.source!=='MEMBER'||item.wallet!==auth.wallet)throw passportFailure('Registration not found for this wallet.',404);
    if(body.action==='inspect') {await assertPassportMainnet(url);return Response.json(await inspectPassport(url,item),{headers});}
    if(['publishChallenge','publish'].includes(body.action))await assertPassportMainnet(url);
    return Response.json(await passportPublication(db,url,{id:auth.wallet},registry,item,body,origin),{headers});
  }catch(error){return Response.json({error:error.status?error.message:'Token Passport is temporarily unavailable. Please try again.'},{status:error.status||503,headers});}
}