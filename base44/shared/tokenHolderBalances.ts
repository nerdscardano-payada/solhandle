import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';

const tokenPrograms = new Set(['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb']);
const u64 = bytes => { let n = 0n; for (let i = 0; i < 8; i++) n |= BigInt(bytes[i]) << BigInt(i * 8); return n; };

export async function tokenHolderBalances(rpcUrl, mint) {
  const mintAccount = await rpc(rpcUrl, 'getAccountInfo', [mint, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
  const decimals = mintAccount?.value?.data?.parsed?.info?.decimals;
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18 || !tokenPrograms.has(mintAccount.value.owner)) throw new Error('Could not verify official token mint and decimals.');
  const accounts = await rpc(rpcUrl, 'getProgramAccounts', [mintAccount.value.owner, { commitment: 'confirmed', encoding: 'base64', filters: [{ memcmp: { offset: 0, bytes: mint } }], dataSlice: { offset: 32, length: 40 } }]);
  if (!Array.isArray(accounts) || accounts.length >= 5000) throw new Error('Holder scan unavailable or beyond the supported range; progress was not updated.');
  const balances = new Map();
  for (const account of accounts) {
    const encoded = account.account?.data?.[0]; if (!encoded) throw new Error('Incomplete holder snapshot.');
    const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    if (bytes.length !== 40) throw new Error('Incomplete token account.');
    const wallet = new PublicKey(bytes.slice(0, 32)).toBase58();
    balances.set(wallet, (balances.get(wallet) || 0n) + u64(bytes.slice(32, 40)));
  }
  return { balances, decimals };
}