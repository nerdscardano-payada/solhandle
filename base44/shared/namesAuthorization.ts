import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
export async function verifyNamesWallet(proof) {
  if (!proof) throw new Error('Verify your wallet to access your watchlist.');
  const wallet = new PublicKey(String(proof.wallet || '')).toBase58();
  const timestamp = Number(proof.timestamp);
  if (!Number.isSafeInteger(timestamp) || timestamp > Date.now() + 30000 || Date.now() - timestamp > 10 * 60 * 1000) throw new Error('Watchlist authorization expired. Verify your wallet again.');
  const message = new TextEncoder().encode(`SolHandle Names\nWallet: ${wallet}\nView and manage my watchlist. No transactions or funds.\nTime: ${timestamp}`);
  const signature = Uint8Array.from(atob(String(proof.signature || '')), c => c.charCodeAt(0));
  if (signature.length !== 64) throw new Error('Invalid wallet signature.');
  const key = await crypto.subtle.importKey('raw', new PublicKey(wallet).toBytes(), { name: 'Ed25519' }, false, ['verify']);
  if (!await crypto.subtle.verify('Ed25519', key, signature, message)) throw new Error('Wallet verification failed.');
  return wallet;
}