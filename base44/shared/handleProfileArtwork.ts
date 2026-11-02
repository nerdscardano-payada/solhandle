import { COLLECTION_ID } from './solhandleResolver.ts';
import { rpc } from './solanaRpc.ts';

export async function handleProfileArtwork(rpcUrl, profiles) {
  if (!profiles.length) return [];
  // One bounded metadata lookup for the six homepage cards, never generated artwork.
  const result = await Promise.allSettled([
    rpc(rpcUrl, 'getAssetBatch', { ids: profiles.map(profile => profile.assetAddress) })
  ]);
  const assets = result[0].status === 'fulfilled' && Array.isArray(result[0].value) ? result[0].value : [];
  return profiles.map(profile => {
    const asset = assets.find(item => item?.id === profile.assetAddress);
    const matches = asset?.ownership?.owner === profile.owner && asset?.grouping?.some(group => group.group_key === 'collection' && group.group_value === COLLECTION_ID);
    let mintImage = null;
    if (matches && typeof asset.content?.links?.image === 'string' && asset.content.links.image.length <= 2048) {
      try {
        const url = new URL(asset.content.links.image);
        if (url.protocol === 'https:' && !url.username && !url.password) mintImage = url.href;
      } catch { /* Unusable metadata must not become a made-up NFT image. */ }
    }
    const { owner, ...publicProfile } = profile;
    return { ...publicProfile, mintImage };
  });
}