import bs58 from 'npm:bs58@5.0.0';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { program, discriminator, equal } from './handleTokenTransactions.ts';
import { readTokenMint } from './tokenMintFlow.ts';
import { confirmTokenMint } from './handleTokenProof.ts';
export default async function indexTokenMint(base44, rpcUrl, signature, transaction) {
  if (!transaction || transaction.meta?.err) throw new Error('A successful confirmed transaction is required.');
  const message = transaction.transaction.message;
  const keys = [...message.accountKeys.map(key => typeof key === 'string' ? key : key.pubkey), ...(transaction.meta.loadedAddresses?.writable || []), ...(transaction.meta.loadedAddresses?.readonly || [])];
  const disc = await discriminator('mint_handle_with_token');
  const matches = message.instructions.filter(ix => keys[ix.programIdIndex] === program.toBase58() && equal(bs58.decode(ix.data).slice(0, 8), disc));
  if (matches.length !== 1) throw new Error('Exactly one official token mint is required.');
  const ix = matches[0], fields = readTokenMint({ data: bs58.decode(ix.data) });
  const wallet = keys[ix.accounts[0]], payerToken = keys[ix.accounts[11]], treasuryToken = keys[ix.accounts[12]];
  if (!wallet || !payerToken || !treasuryToken || wallet !== keys[0]) throw new Error('Invalid confirmed token accounts.');
  new PublicKey(wallet); new PublicKey(payerToken); new PublicKey(treasuryToken);
  return confirmTokenMint(base44, rpcUrl, signature, { ...fields, wallet, payerToken, treasuryToken }, transaction);
}