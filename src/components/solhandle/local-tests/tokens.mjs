import { Keypair, SystemProgram } from '@solana/web3.js';
import { connection, send } from './transport.mjs';
import { TOKEN, tokenIx, key, u64 } from './codec.mjs';
export async function createMint(authority) {
  const mint = Keypair.generate();
  const rent = await connection.getMinimumBalanceForRentExemption(82);
  await send(authority, [SystemProgram.createAccount({ fromPubkey: authority.publicKey, newAccountPubkey: mint.publicKey, lamports: rent, space: 82, programId: TOKEN }), tokenIx([key(mint.publicKey, true)], Buffer.from([20, 6]), authority.publicKey.toBuffer(), Buffer.from([0]))], [mint]);
  return mint.publicKey;
}
export async function tokenAccount(authority, mint, owner) {
  const account = Keypair.generate();
  const rent = await connection.getMinimumBalanceForRentExemption(165);
  await send(authority, [SystemProgram.createAccount({ fromPubkey: authority.publicKey, newAccountPubkey: account.publicKey, lamports: rent, space: 165, programId: TOKEN }), tokenIx([key(account.publicKey, true), key(mint)], Buffer.from([18]), owner.toBuffer())], [account]);
  return account.publicKey;
}
export async function fundTokens(authority, mint, account, amount) {
  await send(authority, [tokenIx([key(mint, true), key(account, true), key(authority.publicKey, false, true)], Buffer.from([7]), u64(amount))]);
}
export const balance = async account => BigInt((await connection.getTokenAccountBalance(account)).value.amount);
export const supply = async mint => BigInt((await connection.getTokenSupply(mint)).value.amount);