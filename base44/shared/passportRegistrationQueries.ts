import { passportFailure } from './tokenPassportTestStore.ts';
const states=['pending','approved','rejected','suspended'];
const columns=['registration_id','created_at','mint','token_name','token_symbol','handle','wallet','status','proof_level','ownership','source'];
export function passportCursor(value) {
  if(value!==undefined&&(typeof value!=='string'||value.length>4000))throw passportFailure('Invalid page cursor.');
  return value?{cursor:value}:{};
}
export async function passportPage(db,body,wallet) {
  const filter=body.filter||'all',sort=body.sort||'-created_at';
  if(!['all',...states].includes(filter)||!['created_at','token_name','handle','wallet','status'].includes(String(sort).replace(/^-/,'')))throw passportFailure('Invalid registration filter or sort.');
  const query={...(wallet?{wallet,source:'MEMBER'}:{}),...(filter==='all'?{}:{status:filter})};
  const page=await db.TokenPassportRegistration.filter(query,{sort,limit:wallet?25:8,fields:columns,...passportCursor(body.cursor)});
  const items=page.items.map(({registration_id,...row})=>({...row,id:registration_id}));
  if(wallet)return {...page,items};
  const grouped=await db.TokenPassportRegistration.aggregate({groupBy:'status'});
  const counts={all:0,...Object.fromEntries(states.map(s=>[s,0]))};
  for(const row of grouped.rows){counts[row.status]=row.count;counts.all+=row.count;}
  return {...page,items,counts,total:filter==='all'?counts.all:counts[filter]};
}
export async function passportHistory(db,id,cursor,pending) {
  const page=await db.TokenPassportEvent.filter({association_id:id},{sort:'-at',limit:25,...passportCursor(cursor)});
  const items=!cursor&&pending&&!page.items.some(e=>e.event_key===pending.event_key)?[{...pending,id:pending.event_key},...page.items]:page.items;
  return {items,next_cursor:page.next_cursor,has_more:page.has_more};
}
export async function passportExportPage(db,body) {
  const filter=body.filter||'all';
  if(!['all',...states].includes(filter)||(body.ids!==undefined&&(!Array.isArray(body.ids)||body.ids.length>200||body.ids.some(id=>typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id)))))throw passportFailure('Invalid evidence selection. Select up to 200 registrations per export.');
  const query=body.ids?{registration_id:{$in:body.ids}}:filter==='all'?{}:{status:filter};
  const page=await db.TokenPassportRegistration.filter(query,{sort:'-created_at',limit:200,...passportCursor(body.cursor)});
  const cell=value=>{let text=String(value??'');if(/^[=+@\-\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
  const lines=body.cursor?[]:[['Association ID','Mint','Handle','Authorizing wallet','Handle asset','Review status','Ownership observation','Checked at','Proof level','Signed message SHA-256','Signature']];
  for(const row of page.items)lines.push([row.registration_id,row.mint,'@'+row.handle,row.wallet,row.asset,row.status,row.ownership,row.checked_at,row.proof_level,row.payload_hash,row.signature]);
  return {csv:lines.map(line=>line.map(cell).join(',')).join('\r\n'),next_cursor:page.next_cursor,has_more:page.has_more};
}