import { PublicKey, Transaction, TransactionInstruction, ComputeBudgetProgram } from 'npm:@solana/web3.js@1.98.4';
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction, createTransferCheckedInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from 'npm:@solana/spl-token@0.4.14';
import { Buffer } from 'node:buffer';
import walletAssertionInstruction from './walletAssertionInstruction.ts';
import getPayToken from './payAssets.ts';

// Official Solana USDt mint: https://tether.to/en/supported-protocols/
export const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
export const USDT_DECIMALS = 6;
const MEMO = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
export const to64 = bytes => Buffer.from(bytes).toString('base64');
export const from64 = text => Buffer.from(text, 'base64');
export const payError = (message, status = 400) => Object.assign(new Error(message), { status });
export function usdtAmount(value) {
  if (typeof value !== 'string' || !/^[1-9][0-9]{0,19}$/.test(value) || BigInt(value) > 18446744073709551615n) throw payError('Enter a positive token amount with up to 6 decimal places.');
  return BigInt(value);
}
export function usdtAccounts(sender, recipient, asset = 'USDT') {
  const mint = new PublicKey(getPayToken(asset).mint), owner = new PublicKey(sender), receiver = new PublicKey(recipient);
  if (!PublicKey.isOnCurve(owner.toBytes()) || !PublicKey.isOnCurve(receiver.toBytes()) || owner.equals(receiver)) throw payError('Choose a different, ordinary Solana wallet as recipient.');
  return { mint, owner, receiver, source: getAssociatedTokenAddressSync(mint, owner), destination: getAssociatedTokenAddressSync(mint, receiver) };
}
export function usdtTransaction(context, blockhash, createAccount) {
  const { sender, recipient, amountRaw, handle, lastValidBlockHeight } = context;
  const token = getPayToken(context.asset);
  const { mint, owner, receiver, source, destination } = usdtAccounts(sender, recipient, token.asset);
  const tx = new Transaction({ feePayer: owner, recentBlockhash: blockhash }).add(ComputeBudgetProgram.setComputeUnitLimit({ units: 200000 }), ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 0 }));
  if (createAccount) tx.add(createAssociatedTokenAccountIdempotentInstruction(owner, destination, receiver, mint));
  tx.add(createTransferCheckedInstruction(source, mint, destination, owner, usdtAmount(amountRaw), token.decimals));
  tx.add(new TransactionInstruction({ programId: MEMO, keys: [], data: Buffer.from(`SolHandle Pay ${token.asset}:@${handle}:${recipient}:${lastValidBlockHeight}`) }));
  return tx;
}
const same = (a, b) => a.programId.equals(b.programId) && Buffer.from(a.data).equals(Buffer.from(b.data)) && a.keys.length === b.keys.length && a.keys.every((key, i) => key.pubkey.equals(b.keys[i].pubkey));
export function validateUsdtSigned(text, context) {
  const token = getPayToken(context.asset);
  if (typeof text !== 'string' || text.length > 1644 || !/^[A-Za-z0-9+/]+={0,2}$/.test(text)) throw payError(`Invalid signed ${token.asset} transaction.`);
  const bytes = from64(text);
  if (bytes.length > 1232) throw payError('Signed transaction exceeds the Solana size limit.');
  const signed = Transaction.from(bytes);
  if (signed.feePayer?.toBase58() !== context.sender || signed.signatures.length !== 1 || !signed.verifySignatures()) throw payError('The wallet changed accounts or returned an invalid signature.', 403);
  const creates = signed.instructions.filter(ix => ix.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID));
  if (creates.length > 1) throw payError('Unexpected token account instructions.', 403);
  const expected = usdtTransaction(context, signed.recentBlockhash, creates.length === 1).instructions;
  const rebuilt = new Transaction({ feePayer: new PublicKey(context.sender), recentBlockhash: signed.recentBlockhash });
  let index = 0, assertions = 0;
  for (const instruction of signed.instructions) {
    if (expected[index] && same(instruction, expected[index])) { rebuilt.add(expected[index++]); continue; }
    const assertion = walletAssertionInstruction(instruction);
    if (!assertion || ++assertions > 4) throw payError(`The wallet changed this ${token.asset} payment or added unsupported instructions. No transaction was submitted.`, 403);
    rebuilt.add(assertion);
  }
  // Recompiling with only canonical privileges also rejects writable/signer escalation in wallet extras.
  if (index !== expected.length || !Buffer.from(rebuilt.serializeMessage()).equals(Buffer.from(signed.serializeMessage()))) throw payError(`The signed payment does not match the approved ${token.asset} transfer.`, 403);
  return signed;
}
export function verifyUsdtBalances(details, context) {
  if (!details.meta || details.meta.err) throw payError('Solana rejected this payment.', 422);
  const token = getPayToken(context.asset);
  const { source, destination } = usdtAccounts(context.sender, context.recipient, token.asset);
  const tx = Transaction.from(from64(details.transaction[0]));
  const keys = tx.compileMessage().accountKeys;
  for (const [account, owner, change] of [[source, context.sender, -usdtAmount(context.amountRaw)], [destination, context.recipient, usdtAmount(context.amountRaw)]]) {
    const index = keys.findIndex(key => key.equals(account));
    const pre = (details.meta.preTokenBalances || []).find(balance => balance.accountIndex === index);
    const post = (details.meta.postTokenBalances || []).find(balance => balance.accountIndex === index);
    if (!post || post.mint !== token.mint || post.owner !== owner || post.uiTokenAmount?.decimals !== token.decimals || (pre && (pre.mint !== token.mint || pre.owner !== owner || pre.uiTokenAmount?.decimals !== token.decimals)) || BigInt(post.uiTokenAmount.amount) - BigInt(pre?.uiTokenAmount?.amount || '0') !== change) throw payError(`On-chain token balances do not match this ${token.asset} payment.`, 403);
  }
}
export { TOKEN_PROGRAM_ID };