import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';
import { rpc, PROGRAM_ID } from '../../shared/solanaRpc.ts';
import { weekendMintEvents } from '../../shared/weekendMintEvents.ts';
import { CAMPAIGN, START, END, campaignQuery } from '../../shared/weekendCampaign.ts';
import { requireWeekendMainnet } from '../../shared/weekendMainnet.ts';
export default async function(req: Request): Promise<Response> {
  let client, state;
  try {
    const base44 = createClientFromRequest(req), user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Admin access required.' }, { status: 403 });
    client = base44.asServiceRole;
    const url = secrets.get('SOLANA_RPC_URL');
    state = (await client.entities.WeekendMintScan.filter(campaignQuery, { limit: 1 })).items[0] || { campaign: CAMPAIGN, before: '', previous_head: '', complete: false, final: false };
    if (state.final) return Response.json({ final: true, scanned: 0 });
    await requireWeekendMainnet(url);
    if (!state.before) {
      const finalizedSlot = await rpc(url, 'getSlot', [{ commitment: 'finalized' }]);
      const finalizedTime = await rpc(url, 'getBlockTime', [finalizedSlot]);
      if (!Number.isFinite(finalizedTime)) throw new Error('Finalized chain timestamp is unavailable.');
      state = { ...state, started_at: new Date().toISOString(), head: '', finalized_through: new Date(finalizedTime * 1000).toISOString() };
    }
    const entries = await rpc(url, 'getSignaturesForAddress', [PROGRAM_ID, { commitment: 'finalized', limit: 40, ...(state.before ? { before: state.before } : {}), ...(state.previous_head ? { until: state.previous_head } : {}) }]);
    if (!state.head && entries[0]) state.head = entries[0].signature;
    const start = Date.parse(START) / 1000, end = Date.parse(END) / 1000;
    if (entries.some(e => e.blockTime === null)) throw new Error('RPC returned a missing block timestamp; scan checkpoint has not advanced.');
    const eligible = entries.filter(e => !e.err && e.blockTime >= start && e.blockTime < end), records = [];
    for (let i = 0; i < eligible.length; i += 4) {
      const transactions = await Promise.all(eligible.slice(i, i + 4).map(async entry => {
        const tx = await rpc(url, 'getTransaction', [entry.signature, { commitment: 'finalized', encoding: 'json', maxSupportedTransactionVersion: 0 }]);
        if (!tx) throw new Error('Finalized transaction unavailable; retrying this scan page is required.');
        return { entry, tx, mints: tx.meta?.err ? [] : weekendMintEvents(tx) };
      }));
      for (const { entry, tx, mints } of transactions) {
        if (!mints.length) continue;
        const block = await rpc(url, 'getBlock', [tx.slot, { commitment: 'finalized', transactionDetails: 'signatures', rewards: false, maxSupportedTransactionVersion: 0 }]);
        const txIndex = block?.signatures?.indexOf(entry.signature);
        if (!(txIndex >= 0 && txIndex < 10000) || mints.length >= 100) throw new Error('Unable to prove transaction order in the finalized block.');
        mints.forEach((mint, eventIndex) => records.push({ campaign: CAMPAIGN, wallet: mint.owner, handle: mint.handle, asset: mint.assetAddress, signature: entry.signature, slot: tx.slot, transaction_index: txIndex, event_index: eventIndex, order: tx.slot * 1000000 + txIndex * 100 + eventIndex, minted_at: new Date(entry.blockTime * 1000).toISOString() }));
      }
    }
    if (records.length) await client.entities.WeekendMintProof.upsert(records, { key: ['campaign', 'asset'] });
    const finished = entries.length < 40 || entries.some(e => e.blockTime < start);
    const final = finished && Date.parse(state.finalized_through || '') >= Date.parse(END);
    const next = { campaign: CAMPAIGN, before: finished ? '' : entries.at(-1).signature, head: state.head, previous_head: finished ? state.head || state.previous_head : state.previous_head, started_at: state.started_at, finalized_through: state.finalized_through, checked_at: new Date().toISOString(), complete: state.complete || finished, final, error: '' };
    await client.entities.WeekendMintScan.upsert([next], { key: 'campaign' });
    return Response.json({ scanned: entries.length, verified: records.length, ...next });
  } catch (error) {
    if (client && state) await client.entities.WeekendMintScan.upsert([{ campaign: CAMPAIGN, error: 'Chain scan interrupted. Selection remains provisional until a successful rescan.' }], { key: 'campaign' });
    return Response.json({ error: error.message }, { status: 500 });
  }
}