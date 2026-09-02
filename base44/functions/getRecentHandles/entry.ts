import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req: Request): Promise<Response> {
  try {
    const { limit = 6 } = await req.json();
    const base44 = createClientFromRequest(req);
    const records = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', Math.min(Math.max(Number(limit) || 6, 1), 12));
    const signatures = records.map((record) => record.mint_signature).filter(Boolean);
    const transactions = signatures.length ? await base44.asServiceRole.entities.FinancialTransaction.filter({ transaction_signature: { '$in': signatures } }, '-timestamp', 100) : [];
    const financialBySignature = new Map(transactions.map((transaction) => [transaction.transaction_signature, transaction]));
    return Response.json({ handles: records.map((record) => ({
      handle: record.handle, display: record.display_handle || `@${record.handle}`, asset: record.asset_address,
      mintedAt: record.minted_at, owner: record.current_owner_cached || record.original_minter,
      rarity: record.rarity, nameClass: record.name_class,
      priceLamports: financialBySignature.get(record.mint_signature)?.total_paid_lamports ?? record.mint_price_lamports ?? 0
    })) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}