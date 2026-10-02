import { createHash } from 'node:crypto';
import { Ed25519Program, SYSVAR_INSTRUCTIONS_PUBKEY } from '@solana/web3.js';
import { PROGRAM, CORE, pda, key, instruction, str, u64, systemKey } from '../local-tests/codec.mjs';
import { settingsPda, partnerPda } from './registry-local-client.mjs';
import { chainTime, send } from '../local-tests/transport.mjs';
export const receiptPda = handle => pda('partner_receipt', pda('asset', handle).toBuffer());
const sha = bytes => createHash('sha256').update(bytes).digest();
export function quoteDigest(f, a) {
  return sha(Buffer.concat([Buffer.from('solhandle:partner-sol:v1\0'), PROGRAM.toBuffer(), settingsPda().toBuffer(), u64(a.settingsRevision), f.buyer.publicKey.toBuffer(), partnerPda(a.id).toBuffer(), f.revenue.publicKey.toBuffer(), f.treasury.publicKey.toBuffer(), f.collection.toBuffer(), u64(a.revision), str(a.handle), sha(Buffer.from(a.uri)), u64(a.price), u64(a.expiry)]));
}
export async function partnerMint(f, handle, options = {}) {
  const a = { handle, uri: 'https://example.invalid/local-partner.json', id: 'atomic-partner', revision: 1n, settingsRevision: 2n, price: 10000000n, expiry: (await chainTime()) + 50, ...options.args };
  const signed = { ...a, ...options.signed };
  const verification = Ed25519Program.createInstructionWithPrivateKey({ privateKey: (options.signer ?? f.partnerSigner).secretKey, message: quoteDigest(f, signed) });
  const keys = [key(f.buyer.publicKey, true, true), key(f.config, true), key(settingsPda()), key(partnerPda(a.id)), key(pda('handle', handle), true), key(pda('asset', handle), true), key(pda('restriction', handle)), key(pda('price', handle)), key(pda('rush')), key(pda('premium', handle)), key(f.collection, true), key(options.treasury ?? f.treasury.publicKey, true), key(options.wallet ?? f.revenue.publicKey, true), key(receiptPda(handle), true), key(SYSVAR_INSTRUCTIONS_PUBKEY), systemKey(), key(CORE)];
  const mint = instruction('mint_handle_partner_sol', keys, str(a.handle), str(a.uri), str(a.id), u64(a.revision), u64(a.settingsRevision), u64(a.price), u64(a.expiry));
  return send(f.buyer, [...(options.omitSignature ? [] : [verification]), mint, ...(options.after ?? [])]);
}