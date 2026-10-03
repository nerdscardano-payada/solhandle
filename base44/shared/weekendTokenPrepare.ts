import { PublicKey, TransactionMessage, VersionedTransaction } from 'npm:@solana/web3.js@1.98.4';
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction, createTransferCheckedInstruction, createBurnCheckedInstruction } from 'npm:@solana/spl-token@0.4.14';
import { HANDLE_MINT } from './handlePaymentStatus.ts';
import { verifyHandleMint } from './handleTokenMintInfo.ts';
import { rpc } from './solanaRpc.ts';
export const to64 = bytes => btoa(String.fromCharCode(...bytes));
export const from64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
export async function prepareWeekendTokens(url, walletAddress, recipient, tokens, kind) {
  const wallet = new PublicKey(walletAddress), mint = new PublicKey(HANDLE_MINT);
  const mintAccount = await rpc(url, 'getAccountInfo', [HANDLE_MINT, { encoding: 'jsonParsed', commitment: 'finalized' }]);
  const info = verifyHandleMint(mintAccount.value), tokenProgram = new PublicKey(info.tokenProgram);
  const amount = BigInt(tokens) * 10n ** BigInt(info.decimals);
  const source = getAssociatedTokenAddressSync(mint, wallet, false, tokenProgram);
  const balance = await rpc(url, 'getTokenAccountBalance', [source.toBase58(), { commitment: 'finalized' }]);
  if (BigInt(balance.value.amount) < amount) throw new Error('The connected wallet has insufficient $HANDLE in its associated token account.');
  const instructions = [];
  if (kind === 'reward') {
    const owner = new PublicKey(recipient), target = getAssociatedTokenAddressSync(mint, owner, false, tokenProgram);
    instructions.push(createAssociatedTokenAccountIdempotentInstruction(wallet, target, owner, mint, tokenProgram));
    instructions.push(createTransferCheckedInstruction(source, mint, target, wallet, amount, info.decimals, [], tokenProgram));
  } else instructions.push(createBurnCheckedInstruction(source, mint, wallet, amount, info.decimals, [], tokenProgram));
  const latest = await rpc(url, 'getLatestBlockhash', [{ commitment: 'finalized' }]);
  const tx = new VersionedTransaction(new TransactionMessage({ payerKey: wallet, recentBlockhash: latest.value.blockhash, instructions }).compileToV0Message());
  const unsigned = to64(tx.serialize());
  const simulation = await rpc(url, 'simulateTransaction', [unsigned, { encoding: 'base64', sigVerify: false, commitment: 'confirmed' }]);
  if (simulation.value.err) throw new Error(`Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`);
  return { unsigned, last_valid_height: latest.value.lastValidBlockHeight };
}