import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { getPrimaryHandle } from '../../shared/solanaRpc.ts';
import { getOwnedActiveHandles } from '../../shared/ownedHandles.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const { wallet } = await req.json();
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(wallet || ''))) return Response.json({ error: 'Invalid Solana wallet.' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const [primary, handles] = await Promise.all([getPrimaryHandle(rpcUrl, wallet), getOwnedActiveHandles(base44, rpcUrl, wallet)]);
    const enrichedHandles = handles.map((handle) => ({ ...handle, isPrimary: primary?.handle === handle.handle && primary?.assetAddress === handle.asset }));
    console.info('getOwnerHandles RPC calls', { rpcCalls: 2, recordsMatched: enrichedHandles.length });
    return Response.json({ wallet, handles: enrichedHandles, primaryHandle: primary?.handle || null });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}