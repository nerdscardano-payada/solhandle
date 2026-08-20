import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const reserved = new Set(['apple','google','nike','microsoft','amazon','cocacola','facebook','instagram','youtube','whatsapp','tiktok','meta','x','twitter','openai','chatgpt','solhandle','solana','sol','solanafoundation','solanalabs','phantom','solflare','backpack']);
const prices = { 1: 500000000, 2: 300000000, 3: 100000000, 4: 50000000, 5: 100000000 };
export default async function(req: Request): Promise<Response> {
  try {
    const { handle: rawHandle } = await req.json();
    const handle = String(rawHandle || '').trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9_]{1,20}$/.test(handle)) return Response.json({ handle, available: false, state: 'invalid' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const [indexed, protectedRows, overrides] = await Promise.all([
      base44.asServiceRole.entities.HandleIndex.filter({ handle }, '-updated_date', 1),
      base44.asServiceRole.entities.ProtectedName.filter({ handle, status: 'active' }, '-updated_date', 1),
      base44.asServiceRole.entities.PriceOverride.filter({ handle, status: 'active' }, '-updated_date', 1)
    ]);
    const isProtected = reserved.has(handle) || protectedRows.length > 0;
    const record = indexed[0];
    const priceLamports = overrides[0]?.price_lamports || prices[Math.min(handle.length, 5)];
    return Response.json({ handle, display: `@${handle}`, available: !record && !isProtected, protected: isProtected, status: record?.status || null, currentOwner: record?.current_owner_cached || null, priceLamports });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}