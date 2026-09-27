import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const [statuses, payments, sales, primaryMints, burnActivity] = await Promise.all([
      base44.asServiceRole.entities.ProtocolStatus.list('-last_sync', 1),
      base44.asServiceRole.entities.Payment.filter({ status: 'CONFIRMED' }, '-confirmed_at', 5000),
      base44.asServiceRole.entities.FinancialTransaction.filter({ status: 'completed', mint_source: 'native_marketplace' }, '-timestamp', 5000),
      base44.asServiceRole.entities.FinancialTransaction.filter({ status: 'completed', transaction_type: 'sale', mint_source: 'direct' }, '-timestamp', 5000),
      base44.asServiceRole.entities.BurnActivity.list('-block_time', 5000)
    ]);
    if (payments.length === 5000 || sales.length === 5000 || primaryMints.length === 5000 || burnActivity.length === 5000) return Response.json({ error: 'Activity exceeds the dashboard reporting range.' }, { status: 503 });
    const uniquePayments = new Set(payments.map(row => row.tx_signature).filter(Boolean));
    const uniqueSales = [...new Map(sales.filter(row => row.transaction_signature).map(row => [row.transaction_signature, row])).values()];
    const uniqueMints = [...new Map(primaryMints.filter(row => row.transaction_signature).map(row => [row.transaction_signature, row])).values()];
    const primaryRevenueLamports = uniqueMints.reduce((total, row) => total + Number(row.total_paid_lamports || 0), 0);
    const volumeLamports = uniqueSales.reduce((total, row) => total + Number(row.total_paid_lamports || 0), 0);
    const royaltyLamports = uniqueSales.reduce((total, row) => total + Number(row.net_solhandle_lamports || 0), 0);
    return Response.json({
      totalMinted: statuses[0]?.total_minted ?? null,
      payTransactions: uniquePayments.size,
      marketplaceVolumeSol: volumeLamports / 1e9,
      royaltyGeneratedSol: royaltyLamports / 1e9,
      primaryMintRevenueSol: primaryRevenueLamports / 1e9,
      primaryBuybackBudgetSol: primaryRevenueLamports / 1e9 * 0.10,
      secondaryBuybackBudgetSol: volumeLamports / 1e9 * 0.01,
      buybackEarmarkedSol: (primaryRevenueLamports * 0.10 + volumeLamports * 0.01) / 1e9,
      handleBought: burnActivity.filter(row => row.type === 'BUYBACK').reduce((total, row) => total + Number(row.token_amount || 0), 0),
      handleBurned: burnActivity.filter(row => row.type === 'BURN').reduce((total, row) => total + Number(row.token_amount || 0), 0),
      buybackSpentReportedSol: burnActivity.filter(row => row.type === 'BUYBACK').reduce((total, row) => total + Number(row.sol_reported || 0), 0),
      lastSync: statuses[0]?.last_sync ?? null,
      measuredAt: new Date().toISOString()
    });
  } catch (error) { return Response.json({ error: error.message || 'Flywheel data unavailable.' }, { status: 500 }); }
}