import { passportFailure } from './tokenPassportTestStore.ts';
export function passportRecord(row) {return {...row,record_id:row.id,id:row.registration_id};}
export async function getPassport(db,id,wallet) {
  if(typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))throw passportFailure('Invalid registration.');
  const page=await db.TokenPassportRegistration.filter({registration_id:id,...(wallet?{wallet,source:'MEMBER'}:{})},{limit:2});
  if(page.items.length>1)throw passportFailure('Conflicting registration records require administrator review.',409);
  if(!page.items.length)throw passportFailure('Registration not found for this wallet.',404);
  return passportRecord(page.items[0]);
}
export async function flushPassportEvent(db,event) {
  if(event)await db.TokenPassportEvent.upsert([event],{key:'event_key'});
}
export function passportAudit(item,actor,action,reason='') {
  return {event_key:`${item.id}:${item.version}:${action}`,association_id:item.id,revision:item.revision,actor,action,reason,at:new Date().toISOString()};
}
export async function commitPassport(db,item,changes,actor,action,guard,reason='') {
  await flushPassportEvent(db,item.last_event);
  const next={...item,...changes,version:item.version+1};
  const event=passportAudit(next,actor,action,reason);
  await guard();
  const result=await db.TokenPassportRegistration.updateMany({id:item.record_id,version:item.version},{$set:{...changes,version:next.version,last_event:event}});
  if(result.updated!==1)throw passportFailure('This registration changed. Reload before continuing.',409);
  await flushPassportEvent(db,event);
  return {...next,last_event:event};
}
export async function insertPassport(db,item,guard) {
  const existing=await db.TokenPassportRegistration.filter({wallet:item.wallet,mint:item.mint,asset:item.asset},{limit:2});
  if(existing.items.length>1)throw passportFailure('Conflicting registrations require administrator review.',409);
  if(existing.items.length) {
    if(existing.items[0].member_nonce===item.member_nonce)return {id:existing.items[0].registration_id};
    const live=passportRecord(existing.items[0]);
    if(item.flow!=='PROJECT_V1'||live.public_active||live.flow==='PROJECT_V1'&&live.status==='pending'&&live.publication_opt_in)throw passportFailure('This token and handle already have an active application. Open the existing registration.',409);
    await guard();
    await flushPassportEvent(db,{...passportAudit(live,item.operator,'submission_archived'),evidence:{signature:live.signature,signed_message:live.signed_message,payload_hash:live.payload_hash,token:live.token,source:live.source,project_website:live.project_website,project_evidence_url:live.project_evidence_url,submission_consent:live.submission_consent?{scope:live.submission_consent.scope,signed_at:live.submission_consent.signed_at}:null,public_consent:live.public_consent?.message===live.signed_message?{...live.public_consent,message:undefined,signature:undefined}:live.public_consent,project_verification:live.project_verification}});
    const {id,version,...replacement}=item;
    await commitPassport(db,live,{...replacement,created_at:live.created_at,revision:live.revision+1,publication_challenge:null},item.operator,'project_application_submitted',guard);
    return {id:live.id};
  }
  const event=passportAudit(item,item.operator,'signed_association_created');
  const {id,...data}=item;
  await guard();
  await db.TokenPassportRegistration.create({...data,registration_id:id,last_event:event});
  await flushPassportEvent(db,event);
  return {id};
}