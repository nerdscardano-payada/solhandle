import { Keypair } from 'npm:@solana/web3.js@1.98.4';
import bs58 from 'npm:bs58@6.0.0';
import getPayToken from './payAssets.ts';
import { usdtTransaction, usdtAccounts, to64 } from './usdtPayTransaction.ts';
import confirmedTokenPayment from './tokenPayConfirmation.ts';
export default async function tokenRequestConfirmationChecks() {
  const checks = [], sender = Keypair.generate(), recipient = Keypair.generate();
  for (const asset of ['USDC', 'USDT', 'HANDLE']) {
    const token = getPayToken(asset), context = { asset, handle: 'ansem', sender: sender.publicKey.toBase58(), recipient: recipient.publicKey.toBase58(), amountRaw: '1234567', lastValidBlockHeight: 123456, requestId: '000000000000000000000001' };
    const tx = usdtTransaction(context, Keypair.generate().publicKey.toBase58(), true); tx.sign(sender);
    const signature = bs58.encode(tx.signature), keys = tx.compileMessage().accountKeys, accounts = usdtAccounts(context.sender, context.recipient, asset);
    const balance = (account, owner, amount) => ({ accountIndex: keys.findIndex(key => key.equals(account)), mint: token.mint, owner, uiTokenAmount: { amount, decimals: 6 } });
    const details = { transaction: [to64(tx.serialize()), 'base64'], meta: { err: null, preTokenBalances: [balance(accounts.source, context.sender, '2000000')], postTokenBalances: [balance(accounts.source, context.sender, '765433'), balance(accounts.destination, context.recipient, '1234567')] } };
    const link = { id: context.requestId, asset, handle: context.handle, recipient_wallet_at_creation: context.recipient, requested_amount_raw: context.amountRaw, kind: 'SINGLE_USE', status: 'PROCESSING', processing_signature: signature };
    const payment = { id: 'fixture-receipt', asset, token_mint: token.mint, amount_raw: context.amountRaw, sender_wallet: context.sender, receiver_wallet: context.recipient, handle: '@ansem', request_id: link.id, confirmed_at: '2026-10-17T00:00:00Z' };
    let state = { ...link }, writes = 0;
    const base44 = { asServiceRole: { entities: { Payment: { filter: async () => ({ items: [payment] }) }, PayLink: { updateMany: async (query, update) => { if (state.status !== query.status || state.processing_signature !== query.processing_signature) return { updated: 0 }; state = { ...state, ...update.$set }; writes++; return { updated: 1 }; } } } } };
    const result = await confirmedTokenPayment(base44, '', signature, context, details, link);
    if (result.payment.id !== payment.id || state.status !== 'PAID' || state.payment_id !== payment.id) throw new Error(`${asset}: receipt did not close request`);
    checks.push(`${asset}: confirmed receipt closes the reserved request`);
    await confirmedTokenPayment(base44, '', signature, context, details, { ...state });
    if (writes !== 1) throw new Error(`${asset}: duplicate settlement`);
    checks.push(`${asset}: repeated confirmation is idempotent`);
    const reject = async (name, changedLink, changedDetails = details) => { let failed = false; try { await confirmedTokenPayment(base44, '', signature, context, changedDetails, changedLink); } catch { failed = true; } if (!failed) throw new Error(`Did not reject ${name}`); checks.push(`${asset}: ${name}`); };
    await reject('unreserved payment rejected', { ...link, status: 'OPEN', processing_signature: '' });
    await reject('different reserved signature rejected', { ...link, processing_signature: 'different' });
    await reject('currency substitution rejected', { ...link, asset: 'SOL' });
    const wrong = structuredClone(details); wrong.meta.postTokenBalances[1].uiTokenAmount.amount = '1';
    await reject('underpayment cannot settle request', link, wrong);
    const failed = await confirmedTokenPayment(base44, '', signature, context, { ...details, meta: { err: 'fixture failure' } }, link);
    if (!failed.failed || writes !== 1) throw new Error('Failed payment changed settlement');
    checks.push(`${asset}: failed transfer does not settle request`);
  }
  return checks;
}