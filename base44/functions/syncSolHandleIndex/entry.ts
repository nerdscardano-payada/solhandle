import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { getAssetOwner, parseMintEvent, PROGRAM_ID, rpc } from '../../shared/solanaRpc.ts';
import { readLatestProtocolConfigCache } from '../../shared/protocolConfigCache.ts';
import { getHistoricalSolEur } from '../../shared/solEur.ts';

export default async function(req: Request): Promise<Response> {
  let stage = 'initialization';
  try {
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const body = await req.json().catch(() => ({}));
    const signature = typeof body.signature === 'string' ? body.signature.trim() : '';
    if (signature && !/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(signature)) return Response.json({ error: 'Invalid transaction signature.' }, { status: 400 });
    stage = 'loading_signatures';
    const signatures = signature
      ? [{ signature, err: null }]
      : await rpc(rpcUrl, 'getSignaturesForAddress', [PROGRAM_ID, { limit: 250, commitment: 'confirmed' }]);
    let synced = 0;
    stage = 'loading_protocol';
    const protocol = await readLatestProtocolConfigCache(base44);
    if (!protocol) throw new Error('Protocol configuration cache is unavailable.');

    for (const entry of signatures) {
      if (entry.err) continue;
      stage = 'loading_transaction';
      const transaction = await rpc(rpcUrl, 'getTransaction', [entry.signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
      const mint = (transaction?.meta?.logMessages || [])
        .filter((line: string) => line.startsWith('Program data: '))
        .map((line: string) => parseMintEvent(line.replace('Program data: ', '')))
        .find(Boolean);
      if (!mint) continue;

      stage = 'loading_asset_and_index';
      const owner = await getAssetOwner(rpcUrl, mint.assetAddress, mint.owner);
      const [existing, premiumRows] = await Promise.all([
        base44.asServiceRole.entities.HandleIndex.filter({ handle: mint.handle }, '-updated_date', 1),
        base44.asServiceRole.entities.PremiumHandle.filter({ handle: mint.handle }, '-updated_date', 1)
      ]);
      const length = mint.handle.length;
      const blockTimestamp = transaction.blockTime || Math.floor(Date.now() / 1000);
      const mintedAt = new Date(blockTimestamp * 1000).toISOString();
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
        minted_at: mintedAt,
        last_chain_sync: new Date().toISOString(),
        rarity: length === 1 ? 'LEGENDARY' : length === 2 ? 'ULTRA_RARE' : length === 3 ? 'RARE' : length === 4 ? 'UNCOMMON' : 'STANDARD',
        name_class: premiumRows.length ? 'Premium' : 'Standard',
        length,
        character_type: /^\d+$/.test(mint.handle) ? 'NUMBERS' : /^[a-z]+$/.test(mint.handle) ? 'LETTERS' : 'ALPHANUMERIC',
      };
      stage = 'saving_handle_index';
      if (existing[0]) await base44.asServiceRole.entities.HandleIndex.update(existing[0].id, record);
      else await base44.asServiceRole.entities.HandleIndex.create(record);

      if (mint.priceLamports > 0) {
        const financial = await base44.asServiceRole.entities.FinancialTransaction.filter({ transaction_signature: entry.signature }, '-timestamp', 1);
        if (!financial[0]) {
          const accountKeys = transaction.transaction.message.accountKeys.map((key) => typeof key === 'string' ? key : key.pubkey);
          const treasuryIndex = accountKeys.indexOf(protocol.treasury);
          if (treasuryIndex < 0) throw new Error(`Treasury was not included in confirmed mint ${entry.signature}.`);
          const receivedLamports = transaction.meta.postBalances[treasuryIndex] - transaction.meta.preBalances[treasuryIndex];
          const premiumSurchargeLamports = premiumRows.length ? 1_000_000_000 : 0;
          const expectedLamports = mint.priceLamports + premiumSurchargeLamports;
          if (receivedLamports !== expectedLamports) throw new Error(`Confirmed treasury receipt does not match pricing for @${mint.handle}.`);
          const solEurRate = await getHistoricalSolEur(blockTimestamp);
          await base44.asServiceRole.entities.FinancialTransaction.create({
            transaction_id: entry.signature, transaction_type: 'sale', handle: mint.handle, buyer_wallet: mint.owner,
            transaction_signature: entry.signature, asset_address: mint.assetAddress, block_slot: transaction.slot, timestamp: mintedAt,
            character_length: length, premium_status: premiumRows.length > 0, base_price_lamports: mint.priceLamports,
            premium_surcharge_lamports: premiumSurchargeLamports, total_paid_lamports: receivedLamports,
            sol_eur_rate: solEurRate, total_value_eur: receivedLamports / 1_000_000_000 * solEurRate,
            mint_source: 'direct', partner_id: '', partner_commission_percentage: 0, partner_fee_lamports: 0,
            net_solhandle_lamports: receivedLamports, treasury_address: protocol.treasury,
            rewards_vault_address: protocol.rewardsVault, status: 'completed'
          });
        }
      }
      synced += 1;
    }


    const syncedAt = new Date().toISOString();
    const statusRecord = {
      paused: protocol.paused, total_minted: protocol.totalMinted, collection: protocol.collection,
      treasury: protocol.treasury, rewards_vault: protocol.rewardsVault,
      price_1_char: protocol.pricesLamports[0], price_2_char: protocol.pricesLamports[1],
      price_3_char: protocol.pricesLamports[2], price_4_char: protocol.pricesLamports[3],
      price_5_plus: protocol.pricesLamports[4], last_sync: syncedAt
    };
    stage = 'saving_protocol_status';
    const statuses = await base44.asServiceRole.entities.ProtocolStatus.list('-last_sync', 1);
    if (statuses[0]) await base44.asServiceRole.entities.ProtocolStatus.update(statuses[0].id, statusRecord);
    else await base44.asServiceRole.entities.ProtocolStatus.create(statusRecord);

    return Response.json({ scanned: signatures.length, synced, protocol: { paused: protocol.paused, totalMinted: protocol.totalMinted }, lastSync: syncedAt });
  } catch (error) {
    console.error('syncSolHandleIndex failed', error?.stack || error?.message || String(error));
    return Response.json({ error: error?.message || 'Unable to synchronize the SolHandle index.', stage }, { status: 500 });
  }
}