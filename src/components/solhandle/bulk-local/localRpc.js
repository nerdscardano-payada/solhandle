export const LOCAL_RPC = 'http://127.0.0.1:18899';
export const METADATA_URL = 'http://127.0.0.1:18902';
export async function localRpc(method, params = []) {
  if (!import.meta.env.DEV) throw new Error('Local minting is development-only.');
  const response = await fetch(LOCAL_RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Local validator is unreachable. Start the local launcher.');
  const result = await response.json();
  if (result.error) throw new Error(result.error.message);
  return result.result;
}
export async function localGenesis(expected) {
  const genesis = await localRpc('getGenesisHash');
  if (['5eykt4', 'EtWTR', '4uhcV'].some(prefix => genesis.startsWith(prefix))) throw new Error('Public Solana clusters are not allowed in this local checkout.');
  if (expected && genesis !== expected) throw new Error('The local ledger changed. Discard this order and review again.');
  return genesis;
}
export const decodeAccount = account => account?.data?.[0] ? Uint8Array.from(atob(account.data[0]), c => c.charCodeAt(0)) : null;
export const encode64 = bytes => btoa(String.fromCharCode(...bytes));
export const decode64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
export const sol = lamports => (Number(lamports) / 1e9).toLocaleString('en-US', { maximumFractionDigits: 9 });
export function signature58(bytes) {
  let n = 0n, result = ''; const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  for (const byte of bytes) n = n * 256n + BigInt(byte);
  while (n) { result = alphabet[Number(n % 58n)] + result; n /= 58n; }
  for (const byte of bytes) { if (byte) break; result = '1' + result; }
  return result;
}