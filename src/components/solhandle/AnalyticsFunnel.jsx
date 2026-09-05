import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const labels = { SEARCH: "Search", CLAIM_CLICK: "Claim click", WALLET_CONNECTED: "Wallet", MINT_STARTED: "Mint start", MINT_CONFIRMED: "Confirmed" };
export default function AnalyticsFunnel({ data }) {
  const chartData = data.map((item) => ({ ...item, label: labels[item.step] }));
  const start = chartData[0]?.count || 0; const end = chartData.at(-1)?.count || 0;
  return <section className="card-glow mt-6"><div className="flex items-end justify-between gap-4"><div><p className="text-sm text-cyan-300">Mint funnel</p><h2 className="mt-1 text-xl font-semibold text-white">Visitor conversion</h2></div><p className="text-sm text-slate-400">{start ? ((end / start) * 100).toFixed(1) : "0.0"}% conversion</p></div><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid stroke="#ffffff12" vertical={false}/><XAxis dataKey="label" stroke="#94a3b8" fontSize={11}/><YAxis stroke="#94a3b8" allowDecimals={false}/><Tooltip contentStyle={{ background: "#080d19", border: "1px solid #ffffff20" }}/><Bar dataKey="count" fill="#67e8f9" radius={[6, 6, 0, 0]}/></BarChart></ResponsiveContainer></div></section>;
}