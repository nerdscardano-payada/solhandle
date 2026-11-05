import { passportCursor } from './passportRegistrationQueries.ts';
import { handleProfileArtwork } from './handleProfileArtwork.ts';
import { passportFailure } from './tokenPassportTestStore.ts';
export async function publicProjectPassports(client,body,rpcUrl) {
  if(body.q!==undefined&&(typeof body.q!=='string'||body.q.length>80))throw passportFailure('Search with up to 80 characters.');
  const q=(body.q||'').trim(),query={status:'ACTIVE',project_reviewed:true};
  if(q){const text=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');query.$or=['token_name','token_symbol','handle','mint'].map(key=>({[key]:{$regex:text,$options:'i'}}));}
  const page=await client.entities.PublicTokenIdentity.filter(query,{sort:'-published_at',limit:12,...passportCursor(body.cursor)});
  // Only registrations referenced by this bounded page of already-public
  // projections are checked. Private evidence and notes never leave this helper.
  const ids=page.items.map(row=>row.association_id);
  const registrations=ids.length?await client.asServiceRole.entities.TokenPassportRegistration.filter({registration_id:{$in:ids},flow:'PROJECT_V1',status:'approved',public_active:true},{limit:12}):{items:[]};
  const records=new Map();
  for(const row of registrations.items)records.set(row.registration_id,records.has(row.registration_id)?null:row);
  const items=page.items.flatMap(row=>{const record=records.get(row.association_id);if(!record?.public_consent||record.project_verification?.status!=='reviewed'||record.wallet!==row.wallet||record.handle!==row.handle||record.asset!==row.asset||record.mint!==row.mint)return [];return [{id:row.association_id,mint:row.mint,handle:row.handle,assetAddress:row.asset,owner:row.wallet,token_name:row.token_name,token_symbol:row.token_symbol,token_logo:row.token_logo,project_website:row.project_website,project_reviewed_at:row.project_reviewed_at,last_verified_at:row.last_verified_at}];});
  return {items:await handleProfileArtwork(rpcUrl,items),next_cursor:page.next_cursor,has_more:page.has_more};
}