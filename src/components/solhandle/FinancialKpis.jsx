const sol = (value) => `${((value || 0) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 3 })} SOL`;
const eur = (value) => new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(value || 0);
export default function FinancialKpis({ summary }) {
  const cards = [["Total mints", summary.totalMints],["Gross revenue", sol(summary.grossLamports)],["Historical EUR revenue", eur(summary.historicalEur)],["Premium revenue", sol(summary.premiumLamports)],["Partner fees", sol(summary.partnerFeesLamports)],["Net SolHandle", sol(summary.netLamports)]];
  return <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{cards.map(([label,value]) => <div key={label} className="card-glow"><p className="text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-2 text-xl font-semibold text-white">{value}</p></div>)}</div>;
}