import { Ed25519Program, SYSVAR_INSTRUCTIONS_PUBKEY } from '@solana/web3.js';
import { key, pda, instruction, str, u64, TOKEN, CORE, PROGRAM, systemKey } from './codec.mjs';
import { chainTime, send } from './transport.mjs';
export function mintKeys(f, handle) {
  return [key(f.buyer.publicKey, true, true), key(f.config, true), key(f.payment), key(pda('handle', handle), true), key(pda('asset', handle), true), key(pda('restriction', handle)), key(pda('price', handle)), key(pda('rush')), key(pda('premium', handle)), key(f.collection, true), key(f.mint, true), key(f.payerToken, true), key(f.treasuryToken, true), key(TOKEN), key(SYSVAR_INSTRUCTIONS_PUBKEY), systemKey(), key(CORE)];
}
export async function tokenMint(f, handle, options = {}) {
  const amount = options.amount ?? 1000000n;
  const expiry = options.expiry ?? (await chainTime()) + 60;
  const price = options.price ?? 10000000n;
  const signedAmount = options.signedAmount ?? amount;
  const wallet = options.signedWallet ?? f.buyer.publicKey;
  const signedHandle = options.signedHandle ?? handle;
  const message = Buffer.from(`solhandle:token-mint:v1|${PROGRAM}|${wallet}|${signedHandle}|${f.mint}|${price}|${signedAmount}|${expiry}`);
  const verification = Ed25519Program.createInstructionWithPrivateKey({ privateKey: (options.signer ?? f.quoteSigner).secretKey, message });
  const mint = instruction('mint_handle_with_token', mintKeys(f, handle), str(handle), str('https://example.invalid/local-test-nft.json'), u64(price), u64(amount), u64(expiry));
  return send(f.buyer, [...(options.omitSignature ? [] : [verification]), mint, ...(options.after ?? [])]);
}
export async function solMint(f, handle) {
  const keys = mintKeys(f, handle);
  const solKeys = [...keys.slice(0, 2), ...keys.slice(3, 10), key(f.treasury.publicKey, true), systemKey(), key(CORE)];
  return send(f.buyer, [instruction('mint_handle', solKeys, str(handle), str('https://example.invalid/local-sol-nft.json'), u64(10000000n))]);
}