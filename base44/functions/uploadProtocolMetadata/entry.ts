import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { Uploader } from 'npm:@irys/upload@0.0.15';
import { Solana } from 'npm:@irys/upload-solana@0.1.8';

const imageUrl = 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/21d822722_image.png';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { handle: rawHandle } = await req.json();
    const handle = String(rawHandle || '').trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9_]{1,20}$/.test(handle)) return Response.json({ error: 'Invalid handle' }, { status: 400 });

    const keypair = secrets.get('IRYS_UPLOADER_PRIVATE_KEY').trim();
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const uploader = await Uploader(Solana).withWallet(keypair).withRpc(rpcUrl).devnet();
    const length = handle.length;
    const rarity = length === 1 ? 'Legendary' : length === 2 ? 'Ultra Rare' : length === 3 ? 'Rare' : length === 4 ? 'Uncommon' : 'Standard';
    const characterType = /^[a-z]+$/.test(handle) ? 'Letters' : /^[0-9]+$/.test(handle) ? 'Numbers' : handle.includes('_') ? 'Underscore' : 'Alphanumeric';
    const metadata = {
      name: `@${handle}`,
      symbol: 'SOLHANDLE',
      description: `The official, permanent SolHandle identity NFT for @${handle} on Solana Devnet.`,
      image: imageUrl,
      external_url: `https://solhandle.base44.app/${handle}`,
      attributes: [
        { trait_type: 'Handle', value: `@${handle}` },
        { trait_type: 'Length', value: String(length) },
        { trait_type: 'Rarity', value: rarity },
        { trait_type: 'Name Class', value: length <= 3 ? 'Premium' : 'Standard' },
        { trait_type: 'Character Type', value: characterType },
        { trait_type: 'Network', value: 'Solana Devnet' }
      ],
      properties: { category: 'image', creators: [] }
    };
    const receipt = await uploader.upload(JSON.stringify(metadata), {
      tags: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'SolHandle' },
        { name: 'Handle', value: handle }
      ]
    });
    return Response.json({ handle, uri: `https://devnet.irys.xyz/${receipt.id}`, transactionId: receipt.id, metadata });
  } catch (error) {
    return Response.json({ error: error.message || 'Metadata upload failed' }, { status: 500 });
  }
}