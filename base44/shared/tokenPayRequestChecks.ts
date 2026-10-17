import { Keypair, Transaction, TransactionInstruction, PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { assertPayLink, transactionHasRequest, requestMemo, PAY_MEMO } from './payRequestRules.ts';
import { matchTokenPayRequest, requestAmountRaw } from './payRequestAmounts.ts';
import { usdtTransaction, validateUsdtSigned, to64 } from './usdtPayTransaction.ts';
import { claimPayLink } from './payRequestLifecycle.ts';
import { paymentPurpose } from './payRequestRecords.ts';
export default async function tokenPayRequestChecks() {
  const results = [], sender = Keypair.generate(), recipient = Keypair.generate(), blockhash = Keypair.generate().publicKey.toBase58();
  const check = (name, test) => { test(); results.push(name); };
  const reject = (name, test) => check(name, () => { let failed = false; try { test(); } catch { failed = true; } if (!failed) throw new Error(`Did not reject ${name}`); });
  const encode = tx => { tx.sign(sender); return to64(tx.serialize()); };
  for (const asset of ['USDC', 'USDT', 'HANDLE']) {
    const context = { asset, sender: sender.publicKey.toBase58(), recipient: recipient.publicKey.toBase58(), handle: 'ansem', amountRaw: '1234567', lastValidBlockHeight: 123456, requestId: '000000000000000000000001' };
    const link = { id: context.requestId, handle: context.handle, asset, recipient_wallet_at_creation: context.recipient, requested_amount_raw: context.amountRaw, kind: 'SINGLE_USE', status: 'OPEN', expires_at: '' };
    const tx = usdtTransaction(context, blockhash, true), signed = encode(tx);
    check(`${asset}: signed request reference`, () => { validateUsdtSigned(signed, context); if (!transactionHasRequest(tx, link)) throw new Error('Request reference missing'); });
    check(`${asset}: exact amount and currency`, () => { assertPayLink(link, context.amountRaw, '', asset); matchTokenPayRequest(link, context); if (requestAmountRaw('1.234567', asset) !== context.amountRaw) throw new Error('Amount changed'); });
    reject(`${asset}: changed reference`, () => validateUsdtSigned(signed, { ...context, requestId: '000000000000000000000002' }));
    reject(`${asset}: removing reference`, () => validateUsdtSigned(signed, { ...context, requestId: undefined }));
    reject(`${asset}: attaching direct transfer`, () => validateUsdtSigned(encode(usdtTransaction({ ...context, requestId: undefined }, blockhash, true)), context));
    reject(`${asset}: duplicate request memo`, () => validateUsdtSigned(encode(usdtTransaction(context, blockhash, true).add(new TransactionInstruction({ programId: new PublicKey(PAY_MEMO), keys: [], data: new TextEncoder().encode(requestMemo(link.id)) }))), context));
    reject(`${asset}: wrong fixed amount`, () => matchTokenPayRequest(link, { ...context, amountRaw: '1' }));
    reject(`${asset}: original recipient changed`, () => matchTokenPayRequest(link, { ...context, recipient: sender.publicKey.toBase58() }));
    reject(`${asset}: SOL route rejected`, () => assertPayLink(link, 1234567));
    for (const status of ['PROCESSING', 'PAID', 'CANCELLED', 'EXPIRED', 'INVALID']) reject(`${asset}: ${status} blocks new payments`, () => assertPayLink({ ...link, status }, context.amountRaw, '', asset));
    check(`${asset}: same pending signature can recover`, () => assertPayLink({ ...link, status: 'PROCESSING', processing_signature: 'same' }, context.amountRaw, 'same', asset));
    check(`${asset}: reusable amount can vary`, () => assertPayLink({ ...link, kind: 'REUSABLE' }, '2000000', '', asset));
    reject(`${asset}: too many decimal places`, () => requestAmountRaw('0.0000001', asset));
    reject(`${asset}: overflow`, () => requestAmountRaw('18446744073709.551616', asset));
    check(`${asset}: wallet authorization binds currency`, () => { const body = { action: 'create_link', asset, handle: 'ansem' }; if (paymentPurpose(body) === paymentPurpose({ ...body, asset: 'SOL' })) throw new Error('Currency not signed'); });
    let state = structuredClone(link);
    const client = { entities: { PayLink: { updateMany: async (query, update) => { if (state.status !== query.status) return { updated: 0 }; state = { ...state, ...update.$set }; return { updated: 1 }; } } } };
    await claimPayLink(client, link, tx, 'first', context.sender, 0, context);
    let rejected = false; try { await claimPayLink(client, link, tx, 'second', context.sender, 0, context); } catch { rejected = true; }
    check(`${asset}: one-time claim is atomic and keeps exact amount`, () => { if (!rejected || state.processing_signature !== 'first' || state.processing_amount_raw !== context.amountRaw || state.processing_last_valid_height !== context.lastValidBlockHeight) throw new Error('Claim race protection failed'); });
  }
  return results;
}