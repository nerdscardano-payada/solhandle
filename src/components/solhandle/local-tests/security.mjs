import { Keypair } from '@solana/web3.js';
import { tokenMint } from './mint.mjs';
import { unchanged } from './assertions.mjs';
import { rejection, chainTime, send } from './transport.mjs';
import { configure } from './fixture.mjs';
import { createMint, tokenAccount } from './tokens.mjs';
import { instruction, key, pda, str, systemKey } from './codec.mjs';
export async function security(f, check) {
  const invalid = /Error Code: InvalidTokenPayment/;
  const now = await chainTime();
  const cases = [
    ['expired quote', 'expiredtest', { expiry: now - 1 }],
    ['expiry beyond 90 seconds', 'futuretest', { expiry: now + 3600 }],
    ['amount changed after signing', 'amounttest', { signedAmount: 999999n }],
    ['wrong quote wallet', 'wallettest', { signedWallet: f.authority.publicKey }],
    ['wrong quote handle', 'handletest', { signedHandle: 'anothername' }],
    ['untrusted quote signer', 'signertest', { signer: Keypair.generate() }],
    ['missing Ed25519 verification', 'missingtest', { omitSignature: true }],
    ['payment smaller than two units', 'tinytest', { amount: 1n }],
  ];
  for (const [label, handle, options] of cases) await check(label, () => unchanged(f, handle, () => rejection(() => tokenMint(f, handle, options), invalid)));
  await check('wrong SOL reference price', () => unchanged(f, 'pricetest', () => rejection(() => tokenMint(f, 'pricetest', { price: 1n }), /Error Code: PriceLimitExceeded/)));
  await check('wrong token mint', async () => {
    const mint = await createMint(f.authority);
    const payerToken = await tokenAccount(f.authority, mint, f.buyer.publicKey);
    const treasuryToken = await tokenAccount(f.authority, mint, f.treasury.publicKey);
    await unchanged(f, 'tokentest', () => rejection(() => tokenMint({ ...f, mint, payerToken, treasuryToken }, 'tokentest'), invalid));
  });
  await check('wrong token-account owner', () => unchanged(f, 'ownertest', () => rejection(() => tokenMint({ ...f, payerToken: f.treasuryToken }, 'ownertest'), /Error Code: ConstraintTokenOwner/)));
  await check('disabled payments', async () => {
    await configure(f, false);
    await unchanged(f, 'disabledtest', () => rejection(() => tokenMint(f, 'disabledtest'), /Error Code: ProtocolPaused/));
    await configure(f, true);
  });
  await check('protected handle', async () => {
    const handle = 'protectedtest';
    await send(f.authority, [instruction('set_name_restriction', [key(f.authority.publicKey, true, true), key(f.config), key(pda('restriction', handle), true), systemKey()], str(handle), Buffer.from([1]), str('localtest'), Buffer.from([1]))]);
    await unchanged(f, handle, () => rejection(() => tokenMint(f, handle), /Error Code: HandleRestricted/));
  });
}