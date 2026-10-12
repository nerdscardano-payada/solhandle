import { base44 } from '@/api/base44Client';
import { PublicKey } from '@solana/web3.js';
import { normalizeHandle, validateHandle, resolveHandle as sdkResolve, reverseResolve as sdkReverse } from '@/lib/solhandleSdk';
export { normalizeHandle };
const name = value => { const handle = normalizeHandle(value); if (!validateHandle(handle)) throw new Error('Use 1–20 letters or numbers, optionally starting with @.'); return handle; };
const call = async (fn, payload) => { const { data } = await base44.functions.invoke(fn, payload); if (data.error) throw new Error(data.error); return data; };
const verified = result => { if (!result.verified || !result.collectionVerified || result.network !== 'mainnet-beta' || !result.address) throw new Error('No verified Mainnet identity returned.'); return result; };
export const resolveHandle = async value => verified(await call('resolveSolHandle', { handle: name(value) }));
export const reverseResolve = async address => { const wallet = new PublicKey(address.trim()).toBase58(); const primary = await call('reverseResolveSolHandle', { address: wallet }); const result = await resolveHandle(primary.primaryHandle); if (result.address !== wallet) throw new Error('Primary handle ownership no longer matches this wallet.'); return { ...result, primary: true }; };
export const getPrimaryHandle = reverseResolve;
export const getHandleOwner = async value => (await resolveHandle(value)).address;
export const getHandleMetadata = async value => { const result = await resolveHandle(value); return { handle: result.handle, assetAddress: result.assetAddress, collectionVerified: result.collectionVerified, network: result.network }; };
export const checkAvailability = async value => { const result = await call('getHandleAvailability', { handle: name(value) }); if (result.verificationSource !== 'blockchain') throw new Error('On-chain availability could not be verified. Please retry; indexed data is not used as proof in this demo.'); return result; };
export async function executeSdk(input, mode, rpcUrl) {
  const url = new URL(rpcUrl); if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) throw new Error('Use an HTTPS Mainnet RPC endpoint.');
  const options = { rpcUrl, commitment: 'confirmed' };
  const result = await (mode === 'reverse' ? sdkReverse(input.trim(), options) : sdkResolve(name(input), options));
  if (!result) throw new Error(mode === 'reverse' ? 'No verified primary handle found.' : 'Handle not found.');
  if (mode === 'reverse') { const identity = await sdkResolve(result.handle, options); if (!identity || identity.addressString !== result.address.toBase58()) throw new Error('Primary ownership changed.'); return { ...identity, address: identity.addressString, primary: true }; }
  return { ...result, address: result.addressString };
}
export const demoError = error => error.response?.data?.error || error.message || 'Lookup failed. Please try again.';