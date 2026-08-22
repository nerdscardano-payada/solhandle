import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { Uploader } from 'npm:@irys/upload@0.0.15';
import { Solana } from 'npm:@irys/upload-solana@0.1.8';
import bs58 from 'npm:bs58@5.0.0';
import { buildHandleCardSvg } from '../../shared/handleCardSvg.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { handle: rawHandle } = await req.json();
    const handle = String(rawHandle || '').trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ error: 'Invalid handle' }, { status: 400 });

    const storedKeypair = secrets.get('IRYS_UPLOADER_PRIVATE_KEY').trim();
    const keypair = storedKeypair.startsWith('[') ? bs58.encode(Uint8Array.from(JSON.parse(storedKeypair))) : storedKeypair;
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const uploader = await Uploader(Solana).withWallet(keypair).withRpc(rpcUrl).devnet();
    const svgBytes = buildHandleCardSvg(handle);
    const svgReceipt = await uploader.upload(svgBytes, {
      tags: [
        { name: 'Content-Type', value: 'image/svg+xml' },
        { name: 'App-Name', value: 'SolHandle' },
        { name: 'Handle', value: handle }
      ]
    });
    const imageUrl = `https://devnet.irys.xyz/${svgReceipt.id}`;
    const length = handle.length;
    const rarity = length === 1 ? 'Legendary' : length === 2 ? 'Ultra Rare' : length === 3 ? 'Rare' : length === 4 ? 'Uncommon' : 'Standard';
    const premiumRows = await base44.asServiceRole.entities.PremiumHandle.filter({ handle }, '-updated_date', 1);
    const nameClass = premiumRows.length > 0 ? 'Premium' : 'Standard';
    const characterType = /^[a-z]+$/.test(handle) ? 'Letters' : /^[0-9]+$/.test(handle) ? 'Numbers' : 'Alphanumeric';
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
        { trait_type: 'Name Class', value: nameClass },
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