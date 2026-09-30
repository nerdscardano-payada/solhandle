const proofs = new Map();
export function namesProof(wallet) {
  const proof = proofs.get(wallet);
  return proof && Date.now() - proof.timestamp < 9 * 60 * 1000 ? proof : null;
}
export async function authorizeNamesWallet(publicKey, signMessage) {
  if (!publicKey || !signMessage) throw new Error('Connect a wallet that supports message signing.');
  const wallet = publicKey.toBase58(), existing = namesProof(wallet);
  if (existing) return existing;
  const timestamp = Date.now();
  const message = new TextEncoder().encode(`SolHandle Names\nWallet: ${wallet}\nView and manage my watchlist. No transactions or funds.\nTime: ${timestamp}`);
  const signed = await signMessage(message);
  const proof = { wallet, timestamp, signature: btoa(String.fromCharCode(...signed)) };
  proofs.set(wallet, proof);
  window.dispatchEvent(new CustomEvent('solhandle:names-authorized', { detail: wallet }));
  return proof;
}