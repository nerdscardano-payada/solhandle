import { passportFailure } from './tokenPassportTestStore.ts';
export async function withPassportLock(db,mint,operation) {
  const hash=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(mint))),bucket=hash[0]%64;
  const page=await db.TokenPassportLock.filter({bucket},{limit:2});
  if(page.items.length!==1)throw passportFailure('Registration storage requires administrator maintenance.',503);
  const row=page.items[0],holder=crypto.randomUUID(),expires_at=Date.now()+120000;
  const claim=await db.TokenPassportLock.updateMany({id:row.id,expires_at:{$lt:Date.now()}},{$set:{holder,expires_at}});
  if(claim.updated!==1)throw passportFailure('Another registration action is in progress. Please try again shortly.',409);
  const guard=async()=>{
    const live=await db.TokenPassportLock.get(row.id);
    if(live.holder!==holder||live.expires_at<=Date.now())throw passportFailure('The action expired before saving. Refresh and try again.',409);
  };
  try {return await operation(guard);}
  finally {await db.TokenPassportLock.updateMany({id:row.id,holder},{$set:{holder:'',expires_at:0}});}
}