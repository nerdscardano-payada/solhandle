import { useState } from "react";
import { CircleDashed, LockKeyhole, Rocket } from "lucide-react";

const checks = [["Token mint", "Pending"], ["pump.fun launch", "Pending"], ["6-month lock proof", "At launch"]];

export default function TokenLaunchTerminal() {
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("");
  return <div className="rounded-3xl border border-violet-400/30 bg-slate-950/80 p-6 shadow-2xl shadow-violet-950/40">
    <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Launch terminal</p><h2 className="mt-1 text-xl font-semibold text-white">$HANDLE / SOL</h2></div><span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">Configuration pending</span></div>
    <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-900 p-1">{["buy", "sell"].map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-lg py-2 text-sm font-semibold capitalize ${mode === item ? "bg-violet-400 text-slate-950" : "text-slate-400"}`}>{item}</button>)}</div>
    <label className="mt-5 block text-sm text-slate-300">You {mode === "buy" ? "pay (SOL)" : "sell ($HANDLE)"}<input min="0" step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-lg text-white outline-none focus:border-violet-400/60" /></label>
    <div className="mt-4 rounded-2xl bg-white/5 p-4"><div className="flex justify-between text-sm text-slate-400"><span>Estimated receive</span><span className="font-semibold text-slate-500">Available at launch</span></div><div className="mt-2 flex justify-between text-sm text-slate-400"><span>Route</span><span className="font-semibold text-white">pump.fun</span></div></div>
    <button type="button" disabled className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 py-3 font-semibold text-slate-950 opacity-60"><Rocket className="h-4 w-4" />Launch configuration pending</button>
    <div className="mt-6 space-y-2">{checks.map(([label, status]) => <div key={label} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 text-xs"><span className="flex items-center gap-2 text-slate-300">{label === "6-month lock proof" ? <LockKeyhole className="h-3.5 w-3.5 text-amber-300" /> : <CircleDashed className="h-3.5 w-3.5 text-slate-500" />}{label}</span><span className="text-slate-500">{status}</span></div>)}</div>
    <p className="mt-4 text-xs leading-relaxed text-slate-500">Trading activates only after the official mint and pump.fun launch are verified. No transaction can be submitted yet.</p>
  </div>;
}