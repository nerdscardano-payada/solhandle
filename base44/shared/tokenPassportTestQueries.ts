import { passportFailure } from './tokenPassportTestStore.ts';
const states=['pending','approved','rejected','suspended'];
export function passportTestPage(registry,body) {
  const filter=body.filter || 'all', allowed=['created_at','token_name','handle','wallet','status'];
  const sort=body.sort || '-created_at', key=String(sort).replace(/^-/,'');
  if (!['all',...states].includes(filter) || !allowed.includes(key)) throw passportFailure('Invalid table filter or sort.');
  const page=body.page ?? 1;
  if (!Number.isInteger(page) || page<1 || page>3) throw passportFailure('Invalid test page.');
  const counts=Object.fromEntries(['all',...states].map(status=>[status,status==='all'?registry.items.length:registry.items.filter(row=>row.status===status).length]));
  const matches=registry.items.filter(row=>filter==='all'||row.status===filter).sort((a,b)=>String(a[key]||'').localeCompare(String(b[key]||''))*(sort.startsWith('-')?-1:1));
  const items=matches.slice((page-1)*8,page*8).map(row=>Object.fromEntries(['id','created_at','token_name','token_symbol','handle','wallet','status','proof_level','ownership','source'].map(key=>[key,row[key]])));
  return {items,total:matches.length,counts,version:registry.version,capacity:20};
}
export function passportEvidenceCsv(registry,body) {
  const filter=body.filter || 'all';
  if (!['all',...states].includes(filter) || (body.ids!==undefined && (!Array.isArray(body.ids)||body.ids.length>20||body.ids.some(id=>typeof id!=='string')))) throw passportFailure('Invalid evidence selection.');
  const rows=registry.items.filter(row=>body.ids ? body.ids.includes(row.id) : filter==='all'||row.status===filter);
  const cell=value=>{let text=String(value??'');if(/^[=+@\-\t\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
  const lines=[['Test association ID','Mint','Handle','Authorizing wallet','Handle asset','Review status','Ownership observation','Checked at','Proof level','Signed message SHA-256','Signature']];
  for(const row of rows) lines.push([row.id,row.mint,'@'+row.handle,row.wallet,row.asset,row.status,row.ownership,row.checked_at,row.proof_level,row.payload_hash,row.signature]);
  return {csv:'\uFEFF'+lines.map(line=>line.map(cell).join(',')).join('\r\n')};
}