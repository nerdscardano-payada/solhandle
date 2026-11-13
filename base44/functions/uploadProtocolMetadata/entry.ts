import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import createIrysUploader from '../../shared/irysUploader.ts';
import { buildHandleCardSvg } from '../../shared/handleCardSvg.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const uploader = await createIrysUploader();
    const irysGateway = 'https://gateway.irys.xyz';

    if (body.kind === 'uploader-address') {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
      return Response.json({ address: uploader.address });
    }

    if (body.kind === 'collection') {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const storageError = 'SolHandle NFT storage is temporarily unavailable because its Irys upload credit needs topping up. This is not your wallet SOL balance. No mint transaction was sent.';
    const storageBalance = await uploader.getLoadedBalance();
    if (body.kind === 'storage-status') {
      const minimumPrice = await uploader.getPrice(1500);
      const ready = !storageBalance.lt(minimumPrice);
      return Response.json({ ready, ...(ready ? {} : { error: storageError, code: 'NFT_STORAGE_UNFUNDED' }) });
    }
    if (storageBalance.lte(0)) return Response.json({ error: storageError, code: 'NFT_STORAGE_UNFUNDED' }, { status: 503 });

    if (body.kind === 'collection') {
      const artwork = buildHandleCardSvg('solhandle');
      const imageReceipt = await uploader.upload(artwork, {
        tags: [
          { name: 'Content-Type', value: 'image/svg+xml' },
          { name: 'App-Name', value: 'SolHandle' },
          { name: 'Network', value: 'Solana Mainnet-beta' }
        ]
      });
      const image = `${irysGateway}/${imageReceipt.id}`;
      const metadata = {
        name: 'SolHandle',
        symbol: 'SOLHANDLE',
        description: 'The official SolHandle collection for human-readable identity on Solana Mainnet-beta.',
        image,
        attributes: [{ trait_type: 'Network', value: 'Solana Mainnet-beta' }],
        properties: { category: 'image', creators: [] }
      };
      const metadataReceipt = await uploader.upload(JSON.stringify(metadata), {
        tags: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'App-Name', value: 'SolHandle' },
          { name: 'Network', value: 'Solana Mainnet-beta' }
        ]
      });
      return Response.json({ uri: `${irysGateway}/${metadataReceipt.id}`, image, transactionId: metadataReceipt.id, metadata });
    }

    const handle = String(body.handle || '').trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ error: 'Invalid handle' }, { status: 400 });

    // Use the generated PNG URL; fall back to a deterministic Irys-hosted SVG.
    let imageUrl = String(body.image_url || '');
    if (!imageUrl) {
      const svgBytes = buildHandleCardSvg(handle);
      const svgReceipt = await uploader.upload(svgBytes, {
        tags: [
          { name: 'Content-Type', value: 'image/svg+xml' },
          { name: 'App-Name', value: 'SolHandle' },
          { name: 'Handle', value: handle }
        ]
      });
      imageUrl = `${irysGateway}/${svgReceipt.id}`;
    }

    const length = handle.length;
    const rarity = length === 1 ? 'Legendary' : length === 2 ? 'Ultra Rare' : length === 3 ? 'Rare' : length === 4 ? 'Uncommon' : 'Standard';
    const premiumRows = await base44.asServiceRole.entities.PremiumHandle.filter({ handle }, '-updated_date', 1);
    const nameClass = premiumRows.length > 0 ? 'Premium' : 'Standard';
    const characterType = /^[a-z]+$/.test(handle) ? 'Letters' : /^[0-9]+$/.test(handle) ? 'Numbers' : 'Alphanumeric';
    const metadata = {
      name: `@${handle}`,
      symbol: 'SOLHANDLE',
      description: `The official SolHandle identity NFT for @${handle} on Solana Mainnet-beta.`,
      image: imageUrl,
      external_url: `https://solhandle.io/${handle}`,
      attributes: [
        { trait_type: 'Handle', value: `@${handle}` },
        { trait_type: 'Length', value: String(length) },
        { trait_type: 'Rarity', value: rarity },
        { trait_type: 'Name Class', value: nameClass },
        { trait_type: 'Premium', value: nameClass === 'Premium' ? 'Yes' : 'No' },
        { trait_type: 'Character Type', value: characterType },
        { trait_type: 'Network', value: 'Solana Mainnet-beta' }
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
    return Response.json({ handle, uri: `${irysGateway}/${receipt.id}`, transactionId: receipt.id, metadata });
  } catch (error) {
    if (/not enough (funds|balance)|insufficient (funds|balance)|balance.*too low/i.test(error.message || '')) {
      return Response.json({ error: 'SolHandle NFT storage is temporarily unavailable because its Irys upload credit needs topping up. This is not your wallet SOL balance. No mint transaction was sent.', code: 'NFT_STORAGE_UNFUNDED' }, { status: 503 });
    }
    return Response.json({ error: error.message || 'Metadata upload failed' }, { status: 500 });
  }
}