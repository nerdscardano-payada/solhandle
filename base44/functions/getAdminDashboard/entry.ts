import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const [configs, handles] = await Promise.all([
      base44.asServiceRole.entities.ProtocolStatus.list('-last_sync', 1),
      base44.asServiceRole.entities.HandleIndex.list('-minted_at', 250)
    ]);
    const config = configs[0];
    const balanceFor = async (address: string | undefined) => {
      if (!address) return null;
      const response = await fetch(secrets.get('SOLANA_RPC_URL'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [address, { commitment: 'confirmed' }] })
      });
      const balance = await response.json();
      return balance?.result?.value ?? null;
    };
    const [treasuryLamports, rewardsLamports] = await Promise.all([balanceFor(config?.treasury), balanceFor(config?.rewards_vault)]);
    const confirmed = handles.filter((handle) => handle.status === 'active');
    const revenueLamports = confirmed.reduce((total, handle) => total + (handle.mint_price_lamports || 0), 0);
    return Response.json({
      treasury: config?.treasury || null, treasuryLamports, rewardsVault: config?.rewards_vault || null, rewardsLamports,
      totalMinted: config?.total_minted ?? confirmed.length, indexedRevenueLamports: revenueLamports,
      paused: config?.paused ?? false, lastSync: config?.last_sync || null,
      recentMints: handles.slice(0, 12).map((handle) => ({ handle: handle.display_handle, signature: handle.mint_signature, priceLamports: handle.mint_price_lamports, mintedAt: handle.minted_at, asset: handle.asset_address }))
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Unable to load dashboard.' }, { status: 500 });
  }
}