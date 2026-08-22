import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { Uploader } from 'npm:@irys/upload@0.0.15';
import { Solana } from 'npm:@irys/upload-solana@0.1.8';
import bs58 from 'npm:bs58@5.0.0';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { handle: rawHandle } = await req.json();
    const handle = String(rawHandle || '').trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ error: 'Invalid handle' }, { status: 400 });

    const prompt = `A premium Solana identity NFT card for the handle "@${handle}". Pure black #000000 background with a soft horizontal wave-mesh glow transitioning from teal #00BFA5 on the left to deep violet #4A148C on the right, subtle low-opacity, never covering the card. Centered rounded rectangle card with thin glowing cyan #64FFDA border, near-black #050508 interior. Inside the card, top center: a stylized Solana "S" logo with a teal-to-violet gradient. Below the logo: the handle text "@${handle}" in large bold modern sans-serif white, with a subtle cyan-to-violet horizontal gradient and a faint cyan outer glow. A thin muted grey #333333 separator line beneath the title. Below the separator: "SOLHANDLE" in light grey #BDBDBD uppercase, generous letter-spacing, medium weight. At the bottom: "✦ Official SolHandle" in white with a small diamond star. Centered composition, premium futuristic identity-card aesthetic, crisp high contrast, clean, no watermark, no extra text.`;
    let imageUrl = 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/21d822722_image.png';
    try {
      const generated = await base44.integrations.Core.GenerateImage({ prompt });
      if (generated?.url) imageUrl = generated.url;
    } catch {
      // Fall back to the static brand image if generation fails — mint still succeeds.
    }

    const storedKeypair = secrets.get('IRYS_UPLOADER_PRIVATE_KEY').trim();
    const keypair = storedKeypair.startsWith('[') ? bs58.encode(Uint8Array.from(JSON.parse(storedKeypair))) : storedKeypair;
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const uploader = await Uploader(Solana).withWallet(keypair).withRpc(rpcUrl).devnet();
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