import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';
import { VersionedTransaction, PublicKey } from 'npm:@solana/web3.js@1.98.4';
import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@5.0.0';
import { rpc } from '../../shared/solanaRpc.ts';
import { CAMPAIGN, campaignQuery, weekendSnapshot } from '../../shared/weekendCampaign.ts';
import { prepareWeekendTokens, from64 } from '../../shared/weekendTokenPrepare.ts';
import { confirmWeekendSettlement } from '../../shared/weekendSettlementConfirm.ts';
import { requireWeekendMainnet } from '../../shared/weekendMainnet.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req), user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Admin access required.' }, { status: 403 });
    const client = base44.asServiceRole, url = secrets.get('SOLANA_RPC_URL'), body = await req.json();
    await requireWeekendMainnet(url);
    if (body.action === 'prepare') {
      const snapshot = await weekendSnapshot(client);
      if (!snapshot.scan?.final || snapshot.scan.error) throw new Error('Settlement opens after the weekend ends and the complete finalized-chain scan succeeds.');
      const wallet = new PublicKey(body.wallet).toBase58(), kind = body.kind;
      let recipient = '', tokens;
      if (kind === 'reward') {
        const winner = snapshot.winners.find(w => w.wallet === body.recipient);
        if (!winner) throw new Error('This wallet is not in the final first 25.');
        recipient = winner.wallet; tokens = 100000;
      } else if (kind === 'burn25' || kind === 'burn50') {
        if (snapshot.mintCount < (kind === 'burn25' ? 25 : 50)) throw new Error('This burn milestone has not been reached.');
        tokens = kind === 'burn25' ? 1000000 : 1500000;
      } else throw new Error('Invalid settlement type.');
      const key = kind === 'reward' ? `reward:${recipient}` : kind;
      if (snapshot.settlements.some(s => s.key === key)) throw new Error('This reward or burn has already been finalized.');
      let existing = (await client.entities.WeekendMintIntent.filter({ ...campaignQuery, key }, { limit: 1 })).items[0];
      if (existing?.signature && existing.status === 'submitted') {
        const result = await confirmWeekendSettlement(client, url, existing);
        if (result.status === 'confirmed') throw new Error('This settlement has already been finalized.');
        if (result.status === 'submitted') throw new Error('A transaction is pending for this settlement. Confirm it before preparing another.');
        existing = { ...existing, status: result.status };
      }
      if (existing?.status === 'prepared' && await rpc(url, 'getBlockHeight', [{ commitment: 'finalized' }]) <= existing.last_valid_height) {
        if (existing.wallet !== wallet || existing.admin_id !== user.id) throw new Error('Another wallet has an active preparation for this settlement. Wait until it expires.');
        return Response.json({ intent_id: existing.id, unsigned: existing.unsigned, tokens, kind, recipient });
      }
      if (existing?.status === 'confirmed') throw new Error('This settlement has already been finalized.');
      // Upsert immutable identity only. Never overwrite another request's signed transaction.
      const seed = await client.entities.WeekendMintIntent.upsert([{ campaign: CAMPAIGN, key, kind, recipient, tokens }], { key: ['campaign', 'key'] });
      const id = seed.records[0].id, lock = crypto.randomUUID(), now = new Date().toISOString();
      const height = await rpc(url, 'getBlockHeight', [{ commitment: 'finalized' }]);
      await client.entities.WeekendMintIntent.updateMany({ id, $or: [
        { status: { $exists: false } }, { status: null }, { status: { $in: ['expired','failed'] } },
        { status: 'prepared', last_valid_height: { $lt: height } },
        { status: 'preparing', lease_until: { $lt: now } }
      ] }, { $set: { status: 'preparing', lock_token: lock, lease_until: new Date(Date.now() + 300000).toISOString(), wallet, admin_id: user.id } });
      const claimed = await client.entities.WeekendMintIntent.get(id);
      if (claimed.lock_token !== lock || claimed.status !== 'preparing') throw new Error('Another settlement preparation is active. Refresh and retry after it resolves.');
      try {
        const prepared = await prepareWeekendTokens(url, wallet, recipient, tokens, kind);
        await client.entities.WeekendMintIntent.updateMany({ id, lock_token: lock, status: 'preparing' }, { $set: { ...prepared, signature: '', status: 'prepared' } });
        const saved = await client.entities.WeekendMintIntent.get(id);
        if (saved.lock_token !== lock || saved.status !== 'prepared' || saved.unsigned !== prepared.unsigned) throw new Error('Settlement preparation changed; no transaction was sent.');
        return Response.json({ intent_id: id, unsigned: prepared.unsigned, tokens, kind, recipient });
      } catch (error) {
        await client.entities.WeekendMintIntent.updateMany({ id, lock_token: lock, status: 'preparing' }, { $set: { status: 'failed' } });
        throw error;
      }
    }
    if (!['submit', 'confirm'].includes(body.action) || typeof body.intent_id !== 'string') throw new Error('Invalid action.');
    const intent = await client.entities.WeekendMintIntent.get(body.intent_id);
    if (!intent || intent.campaign !== CAMPAIGN || intent.admin_id !== user.id) return Response.json({ error: 'Invalid settlement access.' }, { status: 403 });
    if (body.action === 'confirm') return Response.json(await confirmWeekendSettlement(client, url, intent));
    if (typeof body.signed !== 'string' || body.signed.length > 3000) throw new Error('Invalid signed transaction.');
    const signed = VersionedTransaction.deserialize(from64(body.signed)), expected = VersionedTransaction.deserialize(from64(intent.unsigned));
    const message = signed.message.serialize(), expectedMessage = expected.message.serialize();
    if (message.length !== expectedMessage.length || !message.every((b, i) => b === expectedMessage[i])) throw new Error('Wallet changed the approved transaction. No transaction was sent.');
    if (signed.signatures.length !== 1 || !nacl.sign.detached.verify(message, signed.signatures[0], new PublicKey(intent.wallet).toBytes())) throw new Error('Invalid wallet signature.');
    const signature = bs58.encode(signed.signatures[0]);
    if (intent.signature && intent.signature !== signature) throw new Error('Settlement already has a different signed transaction.');
    if (intent.status === 'confirmed') return Response.json({ status: 'confirmed', signature: intent.signature, intent_id: intent.id });
    if (!['prepared','submitted'].includes(intent.status)) throw new Error('This preparation is no longer active.');
    if (await rpc(url, 'getBlockHeight', [{ commitment: 'finalized' }]) > intent.last_valid_height) {
      if (intent.signature) return Response.json(await confirmWeekendSettlement(client, url, intent));
      await client.entities.WeekendMintIntent.updateMany({ id: intent.id, unsigned: intent.unsigned, status: 'prepared', signature: '' }, { $set: { status: 'expired' } });
      return Response.json({ status: 'expired', intent_id: intent.id });
    }
    await client.entities.WeekendMintIntent.updateMany({ id: intent.id, unsigned: intent.unsigned, status: { $in: ['prepared','submitted'] } }, { $set: { signature, status: 'submitted' } });
    const locked = await client.entities.WeekendMintIntent.get(intent.id);
    if (locked.signature !== signature || locked.unsigned !== intent.unsigned || !['submitted','confirmed'].includes(locked.status)) throw new Error('Settlement changed while signing; no transaction was sent.');
    await rpc(url, 'sendTransaction', [body.signed, { encoding: 'base64', skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 3 }]);
    return Response.json(await confirmWeekendSettlement(client, url, { ...intent, signature, status: 'submitted' }));
  } catch (error) { return Response.json({ error: error.message }, { status: 400 }); }
}