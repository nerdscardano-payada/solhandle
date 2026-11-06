import { rpc } from './solanaRpc.ts';

export async function projectTokenDescription(rpcUrl, mint) {
  // DAS resolves the metadata for this exact mint. Never fetch caller-provided URLs.
  try {
    const asset = await rpc(rpcUrl, 'getAsset', { id: mint });
    if (asset?.id !== mint) return { description: null, status: 'unavailable' };
    const value = asset.content?.metadata?.description;
    const description = typeof value === 'string'
      ? value.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').trim().slice(0, 4000)
      : '';
    return { description: description || null, status: description ? 'available' : 'missing' };
  } catch {
    // Optional project copy must never prevent the passport from loading.
    return { description: null, status: 'unavailable' };
  }
}