import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { getAssetOwner, getProtocolConfig, parseMintEvent, PROGRAM_ID, rpc } from '../../shared/solanaRpc.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const body = await req.json().catch(() => ({}));
    const signature = typeof body.signature === 'string' ? body.signature.trim() : '';
    if (signature && !/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(signature)) return Response.json({ error: 'Invalid transaction signature.' }, { status: 400 });
    const signatures = signature
      ? [{ signature, err: null }]
      : await rpc(rpcUrl, 'getSignaturesForAddress', [PROGRAM_ID, { limit: 250, commitment: 'confirmed' }]);
    let synced = 0;

    for (const entry of signatures) {
      if (entry.err) continue;
      const transaction = await rpc(rpcUrl, 'getTransaction', [entry.signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
      const dataLine = transaction?.meta?.logMessages?.find((line: string) => line.startsWith('Program data: '));
      if (!dataLine) continue;
      const mint = parseMintEvent(dataLine.replace('Program data: ', ''));
      if (!/^[a-z0-9]{1,20}$/.test(mint.handle)) continue;

      const owner = await getAssetOwner(rpcUrl, mint.assetAddress, mint.owner);
      const [existing, premiumRows] = await Promise.all([
        base44.asServiceRole.entities.HandleIndex.filter({ handle: mint.handle }, '-updated_date', 1),
        base44.asServiceRole.entities.PremiumHandle.filter({ handle: mint.handle }, '-updated_date', 1)
      ]);
      const length = mint.handle.length;
      const record = {
        handle: mint.handle,
        display_handle: `@${mint.handle}`,
        asset_address: mint.assetAddress,
        status: 'active',
        original_minter: mint.owner,
        current_owner_cached: owner,
        mint_price_lamports: mint.priceLamports,
        mint_signature: entry.signature,
        mint_slot: transaction.slot,
        minted_at: new Date((transaction.blockTime || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
        last_chain_sync: new Date().toISOString(),
        rarity: length === 1 ? 'LEGENDARY' : length === 2 ? 'ULTRA_RARE' : length === 3 ? 'RARE' : length === 4 ? 'UNCOMMON' : 'STANDARD',
        name_class: premiumRows.length ? 'Premium' : 'Standard',
        length,
        character_type: /^\d+$/.test(mint.handle) ? 'NUMBERS' : /^[a-z]+$/.test(mint.handle) ? 'LETTERS' : 'ALPHANUMERIC',
      };
      if (existing[0]) await base44.asServiceRole.entities.HandleIndex.update(existing[0].id, record);
      else await base44.asServiceRole.entities.HandleIndex.create(record);
      synced += 1;
    }

    const protocol = await getProtocolConfig(rpcUrl);
    const syncedAt = new Date().toISOString();
    const statusRecord = {
      paused: protocol.paused, total_minted: protocol.totalMinted, collection: protocol.collection,
      treasury: protocol.treasury, rewards_vault: protocol.rewardsVault,
      price_1_char: protocol.pricesLamports[0], price_2_char: protocol.pricesLamports[1],
      price_3_char: protocol.pricesLamports[2], price_4_char: protocol.pricesLamports[3],
      price_5_plus: protocol.pricesLamports[4], last_sync: syncedAt
    };
    const statuses = await base44.asServiceRole.entities.ProtocolStatus.list('-last_sync', 1);
    if (statuses[0]) await base44.asServiceRole.entities.ProtocolStatus.update(statuses[0].id, statusRecord);
    else await base44.asServiceRole.entities.ProtocolStatus.create(statusRecord);

    return Response.json({ scanned: signatures.length, synced, protocol: { paused: protocol.paused, totalMinted: protocol.totalMinted }, lastSync: syncedAt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}