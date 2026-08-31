import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { secrets } from "base44:runtime";
import { getCurrentSolEur } from "../../shared/solEur.ts";
import { rpc } from "../../shared/solanaRpc.ts";

const dayStart = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
function periodBounds(period: string, customStart?: string, customEnd?: string) {
  const now = new Date(); const today = dayStart(now); let start: Date | null = null; let end: Date | null = null;
  if (period === "today") start = today;
  if (period === "yesterday") { start = new Date(today.getTime() - 86400000); end = today; }
  if (period === "last7") start = new Date(today.getTime() - 6 * 86400000);
  if (period === "month") start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  if (period === "previous_month") { start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)); end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); }
  if (period === "quarter") start = new Date(Date.UTC(now.getUTCFullYear(), Math.floor(now.getUTCMonth() / 3) * 3, 1));
  if (period === "year") start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  if (period === "custom") { start = customStart ? new Date(`${customStart}T00:00:00.000Z`) : null; end = customEnd ? new Date(`${customEnd}T23:59:59.999Z`) : null; }
  return { start, end };
}
const sum = (rows, field) => rows.reduce((total, row) => total + Number(row[field] || 0), 0);

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req); const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({})); const { start, end } = periodBounds(body.period || "month", body.startDate, body.endDate);
    const [allTransactions, premiumHandles, configs, currentSolEur] = await Promise.all([
      base44.asServiceRole.entities.FinancialTransaction.filter({ status: "completed" }, "-timestamp", 5000),
      base44.asServiceRole.entities.PremiumHandle.list("-created_date", 5000),
      base44.asServiceRole.entities.ProtocolStatus.list("-last_sync", 1),
      getCurrentSolEur()
    ]);
    const transactions = allTransactions.filter((row) => { const time = new Date(row.timestamp); return (!start || time >= start) && (!end || time <= end); });
    const config = configs[0]; const balanceFor = async (address) => address ? (await rpc(secrets.get("SOLANA_RPC_URL"), "getBalance", [address, { commitment: "confirmed" }]))?.value ?? null : null;
    const [treasuryLamports, rewardsLamports] = await Promise.all([balanceFor(config?.treasury), balanceFor(config?.rewards_vault)]);
    const premium = transactions.filter((row) => row.premium_status); const premiumSoldLifetime = new Set(allTransactions.filter((row) => row.premium_status).map((row) => row.handle)).size;
    const lengths = [
      { label: "1-character", test: (n) => n === 1 }, { label: "2-character", test: (n) => n === 2 },
      { label: "3-character", test: (n) => n === 3 }, { label: "4-character", test: (n) => n === 4 },
      { label: "5+ character", test: (n) => n >= 5 }
    ].map((group) => { const rows = transactions.filter((row) => group.test(row.character_length)); return { label: group.label, mints: rows.length, revenueLamports: sum(rows, "base_price_lamports") }; });
    return Response.json({
      transactions, currentSolEur, treasuryLamports, rewardsLamports,
      treasuryCurrentEur: treasuryLamports === null ? null : treasuryLamports / 1e9 * currentSolEur,
      rewardsCurrentEur: rewardsLamports === null ? null : rewardsLamports / 1e9 * currentSolEur,
      summary: { totalMints: transactions.length, baseLamports: sum(transactions, "base_price_lamports"), premiumLamports: sum(transactions, "premium_surcharge_lamports"), grossLamports: sum(transactions, "total_paid_lamports"), historicalEur: sum(transactions, "total_value_eur"), partnerFeesLamports: sum(transactions, "partner_fee_lamports"), netLamports: sum(transactions, "net_solhandle_lamports") },
      premium: { supply: premiumHandles.length, sold: premiumSoldLifetime, remaining: Math.max(0, premiumHandles.length - premiumSoldLifetime), periodBaseLamports: sum(premium, "base_price_lamports"), periodSurchargeLamports: sum(premium, "premium_surcharge_lamports"), periodTotalLamports: sum(premium, "total_paid_lamports"), periodHistoricalEur: sum(premium, "total_value_eur") },
      lengths
    });
  } catch (error) { return Response.json({ error: error.message || "Unable to load financial records." }, { status: 500 }); }
}