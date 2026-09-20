import { sol } from "@/lib/referralLevels";

const labels = { MINT: ["Mint commissions", "20–50% by launch tier"], SECONDARY_ROYALTY: ["Secondary royalties", "50% of royalty received"], CREATOR_FEE: ["Creator fees", "50% of fees received"] };

export default function EarnRevenueStreams({ network }) {
  const streams = network?.streams || {};
  return <section className="mt-6"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Revenue channels</p><h3 className="mt-1 text-xl font-semibold text-white">Your handle network</h3></div><p className="text-xs text-slate-500">{network?.referredWallets || 0} wallets · {network?.referredAssets || 0} assets</p></div><div className="mt-3 grid gap-3 md:grid-cols-3">{Object.entries(labels).map(([source, [title, subtitle]]) => { const row = streams[source] || {}; return <article key={source} className="rounded-xl border border-white/10 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">{subtitle}</p><h4 className="mt-1 font-semibold text-white">{title}</h4><strong className="mt-4 block text-xl text-cyan-200">{sol(row.earnedLamports || 0)}</strong><p className="mt-1 text-xs text-slate-500">{row.events || 0} recorded events · {sol(row.receivedLamports || 0)} received</p></article>; })}</div></section>;
}