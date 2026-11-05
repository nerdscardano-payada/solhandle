import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { assertPassportMainnet, passportToken } from '../../shared/tokenPassportMetadata.ts';
import { passportInput } from '../../shared/tokenPassportTestProof.ts';
import { getPassport } from '../../shared/passportRegistrationStore.ts';
import { passportPage, passportHistory, passportExportPage } from '../../shared/passportRegistrationQueries.ts';
import { memberRegistration } from '../../shared/memberPassportRegistration.ts';
import { reviewPassport } from '../../shared/passportReview.ts';
import { passportPublication } from '../../shared/tokenIdentityPublication.ts';
import { inspectPassport } from '../../shared/passportInspection.ts';
export default async function(req) {
  const headers={'Cache-Control':'no-store'};
  try {
    if(req.method!=='POST') return Response.json({error:'Use POST.'},{status:405,headers});
    const client=createClientFromRequest(req), user=await client.auth.me().catch(error=>error.status===401?null:Promise.reject(error));
    if(!user) return Response.json({error:'Sign in as an administrator.'},{status:401,headers});
    if(user.role!=='admin') return Response.json({error:'This review workspace is administrator-only.'},{status:403,headers});
    const raw=await req.text();
    if(raw.length>16000) return Response.json({error:'Request too large.'},{status:413,headers});
    let body;try{body=JSON.parse(raw);}catch{return Response.json({error:'Invalid request.'},{status:400,headers});}
    if(!body||typeof body!=='object'||Array.isArray(body)) return Response.json({error:'Invalid request.'},{status:400,headers});
    const action=body.action;
    if(!['list','history','lookup','challenge','create','inspect','review','exportEvidence','publication','publishChallenge','publish','withdrawPublic'].includes(action))return Response.json({error:'Unknown operation.'},{status:400,headers});
    const db=client.entities,url=secrets.get('SOLANA_RPC_URL');
    const origin=new URL(req.headers.get('X-Base44-App-Url')||'https://sol-handle-core.base44.app').origin;
    if(action==='list')return Response.json(await passportPage(db,body),{headers});
    if(action==='exportEvidence')return Response.json(await passportExportPage(db,body),{headers});
    if(action==='lookup'){await assertPassportMainnet(url);return Response.json({token:await passportToken(url,body.mint)},{headers});}
    if(['challenge','create'].includes(action)) {
      const input=passportInput(body);
      await assertPassportMainnet(url);
      return Response.json(await memberRegistration(db,url,input.wallet,origin,body,user.id,'ADMIN'),{headers});
    }
    const item=await getPassport(db,body.id);
    if(action==='history')return Response.json(await passportHistory(db,item.id,body.cursor,item.last_event),{headers});
    if(action==='inspect') {
      await assertPassportMainnet(url);
      const [detail,history]=await Promise.all([inspectPassport(url,item),passportHistory(db,item.id,undefined,item.last_event)]);
      return Response.json({...detail,history:history.items,history_next_cursor:history.next_cursor,history_has_more:history.has_more},{headers});
    }
    if(action==='review') {
      if(body.status==='approved')await assertPassportMainnet(url);
      return Response.json(await reviewPassport(db,url,user,item,body),{headers});
    }
    if(['publishChallenge','publish'].includes(action))await assertPassportMainnet(url);
    return Response.json(await passportPublication(db,url,user,null,item,body,origin),{headers});
  } catch(error) {
    const status=error.status||503;
    return Response.json({error:error.status?error.message:'Chain verification is temporarily unavailable. Nothing has been published. Retry when the connection is available.'},{status,headers});
  }
}