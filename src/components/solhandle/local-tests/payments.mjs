import assert from 'node:assert/strict';
import { SystemProgram } from '@solana/web3.js';
import { tokenMint, solMint } from './mint.mjs';
import { split, unchanged, owner } from './assertions.mjs';
import { rejection, connection } from './transport.mjs';
import { tokenAccount, fundTokens } from './tokens.mjs';
export async function payments(f, check) {
  await check('token mint: NFT ownership and 50/50 split', () => split(f, 'ansem', 1000000n, () => tokenMint(f, 'ansem')));
  await check('odd amount: burn rounded down, treasury gets remainder', () => split(f, 'oddamount', 1000001n, () => tokenMint(f, 'oddamount', { amount: 1000001n })));
  await check('duplicate handle rejected without another payment', () => unchanged(f, 'ansem', () => rejection(() => tokenMint(f, 'ansem'), /already in use/)));
  await check('insufficient balance: treasury transfer rolled back', async () => {
    const payerToken = await tokenAccount(f.authority, f.mint, f.buyer.publicKey);
    await fundTokens(f.authority, f.mint, payerToken, 750000n);
    const poor = { ...f, payerToken };
    await unchanged(poor, 'poorbalance', () => rejection(() => tokenMint(poor, 'poorbalance'), /insufficient funds/));
  });
  await check('late transaction failure rolls back NFT, transfer and burn', async () => {
    const after = [SystemProgram.transfer({ fromPubkey: f.buyer.publicKey, toPubkey: f.treasury.publicKey, lamports: Number.MAX_SAFE_INTEGER })];
    await unchanged(f, 'rollbacktest', () => rejection(() => tokenMint(f, 'rollbacktest', { after }), /insufficient lamports/));
  });
  await check('existing SOL mint still works', async () => {
    const before = await connection.getBalance(f.treasury.publicKey);
    await solMint(f, 'solregression');
    assert.equal((await connection.getBalance(f.treasury.publicKey)) - before, 10000000);
    await owner(f, 'solregression');
  });
}