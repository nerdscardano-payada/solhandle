import { rpc } from './solanaRpc.ts';
export async function passportTokenLogo(rpcUrl, mint) {
  // Resolve artwork for the exact mint, never by ticker or token name.
  // No arbitrary metadata URLs are fetched by the server.
  try {
    const asset=await rpc(rpcUrl,'getAsset',{id:mint});
    if(asset?.id!==mint)return null;
    let image=asset.content?.links?.image;
    if(typeof image!=='string'||image.length>2048)return null;
    if(image.startsWith('ipfs://'))image='https://gateway.pinata.cloud/ipfs/'+image.slice(7).replace(/^ipfs\//,'');
    // Preserve the exact IPFS content identifier; ipfs.io can refuse image loads with HTTP 429.
    if(image.startsWith('https://ipfs.io/ipfs/'))image='https://gateway.pinata.cloud/ipfs/'+image.slice('https://ipfs.io/ipfs/'.length);
    if(image.startsWith('ar://'))image='https://arweave.net/'+image.slice(5);
    const url=new URL(image),host=url.hostname.toLowerCase();
    if(url.protocol!=='https:'||url.username||url.password||url.port||!host.includes('.')||host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||/^[\d.]+$/.test(host)||host.includes(':'))return null;
    return url.href;
  } catch {
    // Missing artwork or unsupported DAS must not break the identity proof.
    return null;
  }
}