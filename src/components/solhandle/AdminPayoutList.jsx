import { sol } from "@/lib/referralLevels";

export default function AdminPayoutList({ payouts = [] }) {
  if (!payouts.length) return null;
  return <div className="mt-6"><h3 className="font-semibold">Payout administration</h3><div className="mt-2 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-500"><tr><th className="p-2">Wallet</th><th>Amount</th><th>Status</th><th>Signature</th></tr></thead><tbody>{payouts.map((p) => <tr key={p.id} className="border-t border-white/10"><td className="p-2 font-mono text-xs">{p.wallet_address.slice(0, 6)}…{p.wallet_address.slice(-4)}</td><td>{sol(p.amount_lamports)}</td><td>{p.status}</td><td className="font-mono text-xs">{p.transaction_signature ? `${p.transaction_signature.slice(0, 8)}…` : "Awaiting transfer"}</td></tr>)}</tbody></table></div></div>;
}