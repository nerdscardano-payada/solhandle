import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from 'npm:@solana/web3.js@1.98.4';
import { createApproveInstruction, TOKEN_PROGRAM_ID } from 'npm:@solana/spl-token@0.4.14';
import { usdtAmount, usdtAccounts, usdtTransaction, validateUsdtSigned, verifyUsdtBalances, to64 } from '../../shared/usdtPayTransaction.ts';
import getPayToken from '../../shared/payAssets.ts';
import tokenPayRequestChecks from '../../shared/tokenPayRequestChecks.ts';
import tokenRequestConfirmationChecks from '../../shared/tokenRequestConfirmationChecks.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const client = createClientFromRequest(req), user = await client.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const sender = Keypair.generate(), recipient = Keypair.generate(), blockhash = Keypair.generate().publicKey.toBase58();
    const passed = [];
    let testingAsset = '';
    const check = (name, test) => { test(); passed.push(`${testingAsset}: ${name}`); };
    const reject = (name, test) => check(name, () => { let rejected = false; try { test(); } catch { rejected = true; } if (!rejected) throw new Error(`Did not reject: ${name}`); });
    const encoded = tx => { tx.sign(sender); return to64(tx.serialize()); };
    for (const asset of ['USDT', 'USDC', 'HANDLE']) {
    testingAsset = asset;
    const token = getPayToken(asset);
    const context = { asset, sender: sender.publicKey.toBase58(), recipient: recipient.publicKey.toBase58(), handle: 'ansem', amountRaw: '1234567', lastValidBlockHeight: 123456 };
    for (const creates of [false, true]) check(`Valid ${asset} transfer, create ATA=${creates}`, () => validateUsdtSigned(encoded(usdtTransaction(context, blockhash, creates)), context));
    const signed = encoded(usdtTransaction(context, blockhash, true));
    reject('Different recipient', () => validateUsdtSigned(signed, { ...context, recipient: Keypair.generate().publicKey.toBase58() }));
    reject('Changed amount', () => validateUsdtSigned(signed, { ...context, amountRaw: '1234568' }));
    reject('Different handle', () => validateUsdtSigned(signed, { ...context, handle: 'other' }));
    reject('Changed expiry', () => validateUsdtSigned(signed, { ...context, lastValidBlockHeight: 123457 }));
    reject('Extra SOL transfer', () => validateUsdtSigned(encoded(usdtTransaction(context, blockhash, true).add(SystemProgram.transfer({ fromPubkey: sender.publicKey, toPubkey: recipient.publicKey, lamports: 1 }))), context));
    const accounts = usdtAccounts(context.sender, context.recipient, asset);
    for (const other of ['USDC', 'USDT', 'HANDLE'].filter(value => value !== asset)) {
      reject(`Cannot substitute ${other} for ${asset}`, () => validateUsdtSigned(signed, { ...context, asset: other }));
      check(`Independent token accounts from ${other}`, () => { if (accounts.source.equals(usdtAccounts(context.sender, context.recipient, other).source)) throw new Error('Token accounts overlap'); });
    }
    check('Correct canonical token program', () => { const tx = usdtTransaction(context, blockhash, true); if (tx.instructions[3].programId.toBase58() !== token.programId || tx.instructions[2].keys[5].pubkey.toBase58() !== token.programId) throw new Error('Wrong token program'); });
    reject('Changed token program', () => { const tx = usdtTransaction(context, blockhash, true); tx.instructions[3].programId = new PublicKey(token.programId === TOKEN_PROGRAM_ID.toBase58() ? getPayToken('HANDLE').programId : TOKEN_PROGRAM_ID); validateUsdtSigned(encoded(tx), context); });
    reject('Changed token decimals', () => { const tx = usdtTransaction(context, blockhash, true); tx.instructions[3].data[9] = 9; validateUsdtSigned(encoded(tx), context); });
    reject('Extra token approval', () => validateUsdtSigned(encoded(usdtTransaction(context, blockhash, true).add(createApproveInstruction(accounts.source, recipient.publicKey, sender.publicKey, 1n))), context));
    reject('Different token mint', () => { const tx = usdtTransaction(context, blockhash, true); tx.instructions[3].keys[1].pubkey = Keypair.generate().publicKey; validateUsdtSigned(encoded(tx), context); });
    reject('Writable mint escalation', () => { const tx = usdtTransaction(context, blockhash, false); tx.instructions[2].keys[1].isWritable = true; validateUsdtSigned(encoded(tx), context); });
    check('Read-only wallet assertion', () => { const tx = usdtTransaction(context, blockhash, true); tx.add(new TransactionInstruction({ programId: new PublicKey('L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95'), keys: [{ pubkey: sender.publicKey, isSigner: false, isWritable: false }], data: Uint8Array.of(2, 0) })); validateUsdtSigned(encoded(tx), context); });
    reject('Wallet assertion writable extra account', () => { const tx = usdtTransaction(context, blockhash, true); tx.add(new TransactionInstruction({ programId: new PublicKey('L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95'), keys: [{ pubkey: Keypair.generate().publicKey, isSigner: false, isWritable: true }], data: Uint8Array.of(2, 0) })); validateUsdtSigned(encoded(tx), context); });
    for (const amount of ['0', '-1', '1.2', '18446744073709551616', 1000000]) reject(`Invalid raw amount ${amount}`, () => usdtAmount(amount));
    check('Maximum raw amount stays exact', () => { if (usdtAmount('18446744073709551615') !== 18446744073709551615n) throw new Error('Lost precision'); });
    check('Payment storage supports upsert', () => { if (typeof client.asServiceRole.entities.Payment.upsert !== 'function') throw new Error('Upsert unavailable'); });
    const tx = validateUsdtSigned(signed, context), keys = tx.compileMessage().accountKeys;
    const balance = (account, owner, amount) => ({ accountIndex: keys.findIndex(key => key.equals(account)), mint: token.mint, owner, uiTokenAmount: { amount, decimals: 6 } });
    const details = { transaction: [signed, 'base64'], meta: { err: null, preTokenBalances: [balance(accounts.source, context.sender, '2000000')], postTokenBalances: [balance(accounts.source, context.sender, '765433'), balance(accounts.destination, context.recipient, '1234567')] } };
    check('Exact confirmed sender and recipient balance changes', () => verifyUsdtBalances(details, context));
    reject('Wrong received amount', () => { const changed = structuredClone(details); changed.meta.postTokenBalances[1].uiTokenAmount.amount = '1234566'; verifyUsdtBalances(changed, context); });
    }
    passed.push(...await tokenPayRequestChecks(), ...await tokenRequestConfirmationChecks());
    return Response.json({ passed: passed.length, assets: ['USDC', 'USDT', 'HANDLE'], checks: passed, broadcasts: 0 });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}