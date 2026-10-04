import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { accountBytes, reader } from './tokenDetectionCodec.ts';
import { rpc } from './solanaRpc.ts';

const METADATA_PROGRAM = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
const optionalKey = bytes => bytes.every(b => b === 0) ? null : new PublicKey(bytes).toBase58();
export async function detectMetadata(url, mint, decoded, minContextSlot) {
  const sources = [], warnings = [];
  const pointerExtension = decoded.extensions.find(e => e.type === 18);
  let pointer = null;
  if (pointerExtension) {
    if (pointerExtension.bytes.length !== 64) throw new Error('Invalid metadata pointer extension.');
    pointer = { authority: optionalKey(pointerExtension.bytes.slice(0, 32)), address: optionalKey(pointerExtension.bytes.slice(32)) };
  }
  const embedded = decoded.extensions.find(e => e.type === 19);
  if (embedded) {
    const r = reader(embedded.bytes), updateAuthority = optionalKey(r.take(32)), boundMint = r.key();
    if (boundMint !== mint) throw new Error('Token-2022 metadata mint binding mismatch.');
    const name = r.text(), symbol = r.text(), uri = r.text();
    const count = r.u32(); if (count > 128) throw new Error('Excessive metadata fields.');
    for (let i = 0; i < count; i++) { r.text(); r.text(); }
    if (pointer?.address === mint) sources.push({ source: 'Token-2022 embedded metadata', address: mint, name, symbol, uri, updateAuthority, mutable: null });
    else warnings.push('Embedded metadata has no matching self-pointer; not used to derive a candidate.');
  }
  if (pointer?.address && pointer.address !== mint) warnings.push('External metadata pointer is displayed only. Its target is not supported by this pilot and requires manual review.');
  const program = new PublicKey(METADATA_PROGRAM);
  const [pda] = PublicKey.findProgramAddressSync([new TextEncoder().encode('metadata'), program.toBytes(), new PublicKey(mint).toBytes()], program);
  const result = await rpc(url, 'getAccountInfo', [pda.toBase58(), { encoding: 'base64', commitment: 'finalized', minContextSlot }]);
  if (result.value) {
    if (result.value.owner !== METADATA_PROGRAM || result.value.executable) throw new Error('Unexpected Metaplex metadata account owner.');
    const r = reader(accountBytes(result.value));
    if (r.u8() !== 4) throw new Error('Unsupported Metaplex metadata layout.');
    const updateAuthority = r.key(); if (r.key() !== mint) throw new Error('Metaplex metadata mint binding mismatch.');
    const name = r.text(), symbol = r.text(), uri = r.text(); r.take(2);
    const creators = r.u8(); if (![0, 1].includes(creators)) throw new Error('Invalid metadata creators layout.');
    if (creators) { const count = r.u32(); if (count > 5) throw new Error('Invalid metadata creators count.'); r.take(count * 34); }
    const primary = r.u8(), mutable = r.u8(); if (![0, 1].includes(primary) || ![0, 1].includes(mutable)) throw new Error('Invalid metadata flags.');
    sources.push({ source: 'Metaplex metadata PDA', address: pda.toBase58(), name, symbol, uri, updateAuthority, mutable: mutable === 1 });
  }
  if (!sources.length) warnings.push('No supported, mint-bound on-chain metadata found. No token name or ticker is inferred.');
  return { sources, pointer, warnings, metadataSlot: result.context?.slot };
}