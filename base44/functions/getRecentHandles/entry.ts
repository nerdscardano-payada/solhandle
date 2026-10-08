import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req: Request): Promise<Response> {
  try {
    const { limit = 6, namePool = false, recentlySearched = false } = await req.json();
    const base44 = createClientFromRequest(req);
    if (recentlySearched === true) {
      const searched = await base44.asServiceRole.entities.SearchAnalytics.aggregate({ query: { handle: { $regex: '^[a-z0-9]{1,20}$' } }, groupBy: 'handle', max: 'created_date', sort: '-max_created_date', limit: Math.min(Math.max(Number(limit) || 3, 1), 12) });
      return Response.json({ handles: searched.rows.map(row => ({ handle: row.handle, searchedAt: row.max_created_date })) });
    }
    if (namePool === true) {
      const [searched, claimed] = await Promise.all([
        base44.asServiceRole.entities.SearchAnalytics.aggregate({ groupBy: 'handle', max: 'created_date', sort: '-max_created_date', limit: 20 }),
        base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, { sort: '-minted_at', limit: 20, fields: ['handle'] })
      ]);
      const names = [];
      const seen = new Set();
      for (let index = 0; index < Math.max(searched.rows.length, claimed.items.length); index++) {
        for (const record of [searched.rows[index], claimed.items[index]]) {
          const handle = String(record?.handle || '').replace(/^@/, '').toLowerCase();
          if (/^[a-z0-9_]{1,20}$/.test(handle) && !seen.has(handle)) { seen.add(handle); names.push(handle); }
        }
      }
      return Response.json({ names });
    }
    const { items: records } = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, { sort: '-minted_at', limit: Math.min(Math.max(Number(limit) || 6, 1), 12) });
    const signatures = records.map((record) => record.mint_signature).filter(Boolean);
    const [transactions, payments] = signatures.length ? await Promise.all([
      base44.asServiceRole.entities.FinancialTransaction.filter({ transaction_signature: { '$in': signatures } }, { sort: '-timestamp', limit: 100, fields: ['transaction_signature', 'total_paid_lamports'] }),
      base44.asServiceRole.entities.TokenMintPayment.filter({ signature: { '$in': signatures } }, { limit: 12, fields: ['signature', 'amount_raw', 'decimals'] })
    ]) : [{ items: [] }, { items: [] }];
    const financialBySignature = new Map(transactions.items.map((transaction) => [transaction.transaction_signature, transaction]));
    const paymentBySignature = new Map(payments.items.map((payment) => [payment.signature, payment]));
    return Response.json({ handles: records.map((record) => ({
      handle: record.handle, display: record.display_handle || `@${record.handle}`, asset: record.asset_address,
      mintedAt: record.minted_at, owner: record.current_owner_cached || record.original_minter,
      rarity: record.rarity, nameClass: record.name_class,
      tokenPayment: paymentBySignature.has(record.mint_signature) ? { amountRaw: paymentBySignature.get(record.mint_signature).amount_raw, decimals: paymentBySignature.get(record.mint_signature).decimals } : null,
      priceLamports: financialBySignature.get(record.mint_signature)?.total_paid_lamports ?? record.mint_price_lamports ?? 0
    })) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}