import { PublicKey, Transaction, TransactionMessage, VersionedTransaction, ComputeBudgetProgram, Ed25519Program } from 'npm:@solana/web3.js@1.98.4';
import nacl from 'npm:tweetnacl@1.0.3';
import { rpc } from './solanaRpc.ts';
import { HANDLE_MINT } from './handlePaymentStatus.ts';
import { mintInstructions, program, fromBase64, toBase64, discriminator, equal } from './handleTokenTransactions.ts';
import validateTokenConfiguration from './validateTokenConfiguration.ts';
export const tokenMintBudget = () => ComputeBudgetProgram.setComputeUnitLimit({ units: 600000 });
export async function previewTokenTransaction(rpcUrl, wallet, instructions, lookupTable = null) {
  const latest = await rpc(rpcUrl, 'getLatestBlockhash', [{ commitment: 'finalized' }]);
  const build = blockhash => lookupTable
    ? new VersionedTransaction(new TransactionMessage({ payerKey: wallet, recentBlockhash: blockhash, instructions: [tokenMintBudget(), ...instructions] }).compileToV0Message([lookupTable]))
    : new Transaction({ feePayer: wallet, recentBlockhash: blockhash }).add(tokenMintBudget(), ...instructions);
  const encode = tx => {
    const raw = lookupTable ? tx.serialize() : tx.serialize({ requireAllSignatures: false, verifySignatures: false });
    if (raw.length > 1232) throw new Error('The transaction exceeds Solana’s size limit.');
    return toBase64(raw);
  };
  const encoded = encode(build(latest.value.blockhash));
  const simulation = await rpc(rpcUrl, 'simulateTransaction', [encoded, { encoding: 'base64', commitment: 'confirmed', minContextSlot: latest.context.slot, sigVerify: false, replaceRecentBlockhash: true }]);
  if (simulation.value?.err) throw new Error(`Mint cannot proceed: ${JSON.stringify(simulation.value.err)}. ${(simulation.value.logs || []).slice(-5).join(' ')}`);
  const fresh = await rpc(rpcUrl, 'getLatestBlockhash', [{ commitment: 'finalized', minContextSlot: latest.context.slot }]);
  return encode(build(fresh.value.blockhash));
}
export function readTokenMint(instruction) {
  const bytes = instruction.data, view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  const text = max => {
    if (offset + 4 > bytes.length) throw new Error('Invalid mint data.');
    const size = view.getUint32(offset, true); offset += 4;
    if (size < 1 || size > max || offset + size > bytes.length) throw new Error('Invalid mint text.');
    const value = new TextDecoder('utf-8', { fatal: true }).decode(bytes.slice(offset, offset + size)); offset += size; return value;
  };
  const handle = text(20), uri = text(200);
  if (!/^[a-z0-9]{1,20}$/.test(handle) || !/^https:\/\//.test(uri) || offset + 24 !== bytes.length) throw new Error('Invalid mint data.');
  const solReferenceLamports = Number(view.getBigUint64(offset, true)), totalRaw = view.getBigUint64(offset + 8, true).toString(), expiresAt = Number(view.getBigInt64(offset + 16, true));
  if (!Number.isSafeInteger(solReferenceLamports) || solReferenceLamports < 1 || BigInt(totalRaw) < 2n) throw new Error('Invalid mint price.');
  return { handle, uri, solReferenceLamports, totalRaw, expiresAt };
}
export async function validateSignedTokenMint(tx, protocol, payment, tokenProgram, maxSolLamports = null) {
  const index = tx.instructions.findIndex(ix => ix.programId.equals(program));
  const instruction = tx.instructions[index];
  if (!instruction || index < 1 || !equal(instruction.data.slice(0, 8), await discriminator('mint_handle_with_token'))) throw new Error('Missing token mint instruction.');
  const fields = readTokenMint(instruction), wallet = tx.feePayer?.toBase58();
  if (!wallet || (maxSolLamports !== null && fields.solReferenceLamports > maxSolLamports)) throw new Error('The administrator test is capped at a 0.01 SOL reference price.');
  const verification = tx.instructions[index - 1];
  if (!verification.programId.equals(Ed25519Program.programId) || verification.data.length < 16) throw new Error('Missing adjacent quote verification.');
  const message = `solhandle:token-mint:v1|${program.toBase58()}|${wallet}|${fields.handle}|${HANDLE_MINT}|${fields.solReferenceLamports}|${fields.totalRaw}|${fields.expiresAt}`;
  const ed = verification.data, signatureOffset = new DataView(ed.buffer, ed.byteOffset, ed.byteLength).getUint16(2, true), signature = ed.slice(signatureOffset, signatureOffset + 64);
  if (signature.length !== 64 || !nacl.sign.detached.verify(new TextEncoder().encode(message), signature, new PublicKey(payment.quoteSigner).toBytes())) throw new Error('Invalid payment quote signature.');
  const payerToken = instruction.keys[11]?.pubkey;
  if (!payerToken) throw new Error('Missing payer token account.');
  const quote = { ...fields, signer: payment.quoteSigner, message, signature: toBase64(signature) };
  const instructions = await mintInstructions(new PublicKey(wallet), fields.handle, fields.uri, quote, protocol, payment, payerToken, tokenProgram);
  validateTokenConfiguration(tx, instructions, new PublicKey(wallet));
  return { ...fields, wallet, payerToken: payerToken.toBase58(), treasuryToken: payment.treasuryToken };
}