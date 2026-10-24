import { secrets } from 'base44:runtime';
import { resolveOnChain, reverseOnChain, COLLECTION_ID, normalizeHandle, validateHandle } from '../../shared/solhandleResolver.ts';
import { rpc } from '../../shared/solanaRpc.ts';

function publicUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}

export default async function(req: Request): Promise<Response> {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    if (req.method !== 'POST') return Response.json({ error: 'POST required.' }, { status: 405, headers });
    const input = await req.json();
    if (typeof input.handle !== 'string' || input.handle.length > 24 || !validateHandle(input.handle)) return Response.json({ error: 'Invalid handle.' }, { status: 400, headers });
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const resolved = await resolveOnChain(rpcUrl, normalizeHandle(input.handle));
    if (!resolved) return Response.json({ error: 'Handle not found on-chain.' }, { status: 404, headers });
    const [assetResult, primaryResult] = await Promise.allSettled([
      rpc(rpcUrl, 'getAsset', [resolved.assetAddress]),
      reverseOnChain(rpcUrl, resolved.address)
    ]);
    const asset = assetResult.status === 'fulfilled' ? assetResult.value : null;
    const metadataMatches = asset?.id === resolved.assetAddress && asset?.ownership?.owner === resolved.address && asset?.grouping?.some(group => group.group_key === 'collection' && group.group_value === COLLECTION_ID);
    const primary = primaryResult.status === 'fulfilled' ? primaryResult.value : undefined;
    return Response.json({
      ...resolved, collectionAddress: COLLECTION_ID, standard: 'Metaplex Core', checkedAt: new Date().toISOString(),
      primaryActive: primary === undefined ? null : primary?.assetAddress === resolved.assetAddress,
      image: metadataMatches ? publicUrl(asset.content?.links?.image) : null,
      metadataUri: metadataMatches ? publicUrl(asset.content?.json_uri) : null,
      metadataStatus: metadataMatches ? 'available' : 'unavailable'
    }, { headers });
  } catch (error) {
    console.error('Handle identity lookup failed', error.message);
    return Response.json({ error: 'Live identity verification is temporarily unavailable. Please retry.' }, { status: 503, headers });
  }
}