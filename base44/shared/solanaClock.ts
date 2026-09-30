import { rpc } from './solanaRpc.ts';

export default async function solanaClock(rpcUrl) {
  const result = await rpc(rpcUrl, 'getAccountInfo', ['SysvarC1ock11111111111111111111111111111111', { encoding: 'base64', commitment: 'confirmed' }]);
  const encoded = result?.value?.data?.[0];
  if (!encoded) throw new Error('Solana clock is unavailable. Review a fresh payment quote.');
  const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
  if (bytes.length < 40) throw new Error('Invalid Solana clock account.');
  const timestamp = Number(new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getBigInt64(32, true));
  if (!Number.isSafeInteger(timestamp) || timestamp <= 0) throw new Error('Invalid Solana clock timestamp.');
  return timestamp;
}