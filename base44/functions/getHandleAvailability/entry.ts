import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { findHandleOnChain, getAssetOwner } from '../../shared/solanaRpc.ts';

const reserved = new Set(['apple','google','nike','microsoft','amazon','cocacola','facebook','instagram','youtube','whatsapp','tiktok','meta','x','twitter','openai','chatgpt','solhandle','solana','sol','solanafoundation','solanalabs','phantom','solflare','backpack']);
const prices = { 1: 2000000000, 2: 1000000000, 3: 500000000, 4: 300000000, 5: 100000000 };
export default async function(req: Request): Promise<Response> {
  try {
    const { handle: rawHandle } = await req.json();
    const handle = String(rawHandle || '').trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ handle, available: false, state: 'invalid' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const [indexed, protectedRows, overrides, premiumRows] = await Promise.all([
      base44.asServiceRole.entities.HandleIndex.filter({ handle }, '-updated_date', 1),
      base44.asServiceRole.entities.ProtectedName.filter({ handle, status: 'active' }, '-updated_date', 1),
      base44.asServiceRole.entities.PriceOverride.filter({ handle, status: 'active' }, '-updated_date', 1),
      base44.asServiceRole.entities.PremiumHandle.filter({ handle }, '-updated_date', 1)
    ]);
    const isProtected = reserved.has(handle) || protectedRows.length > 0;
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const chainRecord = isProtected ? null : await findHandleOnChain(rpcUrl, handle);
    const record = indexed[0];
    const currentOwner = chainRecord ? await getAssetOwner(rpcUrl, chainRecord.assetAddress, record?.current_owner_cached || '') : record?.current_owner_cached || null;
    if (record && chainRecord && (record.current_owner_cached !== currentOwner || record.last_chain_sync === null)) {
      await base44.asServiceRole.entities.HandleIndex.update(record.id, { current_owner_cached: currentOwner, last_chain_sync: new Date().toISOString() });
    }
    const priceLamports = overrides[0]?.price_lamports || prices[Math.min(handle.length, 5)];
    const nameClass = premiumRows.length > 0 ? 'Premium' : 'Standard';
    return Response.json({ handle, display: `@${handle}`, available: !chainRecord && !record && !isProtected, protected: isProtected, status: chainRecord || record ? 'active' : null, currentOwner, assetAddress: chainRecord?.assetAddress || record?.asset_address || null, priceLamports, nameClass });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}