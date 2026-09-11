import { useState } from "react";

export default function TokenTradeDemo() {
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("1");
  const [progress, setProgress] = useState(38.4);
  const [message, setMessage] = useState("");
  const price = 0.0042;
  const estimate = mode === "buy" ? Number(amount || 0) / price : Number(amount || 0) * price;
  const simulate = () => {
    setProgress((value) => mode === "buy" ? Math.min(100, value + Number(amount || 0) * 0.15) : Math.max(0, value - Number(amount || 0) * 0.0005));
    setMessage(`Demo ${mode} completed — no on-chain transaction was sent.`);
  };
  return <div className="rounded-3xl border border-violet-400/30 bg-slate-950/80 p-6 shadow-2xl shadow-violet-950/40">
    <div className="grid grid-cols-2 rounded-xl bg-slate-900 p-1">{["buy", "sell"].map((item) => <button key={item} onClick={() => { setMode(item); setMessage(""); }} className={`rounded-lg py-2 text-sm font-semibold capitalize ${mode === item ? "bg-violet-400 text-slate-950" : "text-slate-400"}`}>{item}</button>)}</div>
    <label className="mt-6 block text-sm text-slate-300">You {mode === "buy" ? "pay (SOL)" : "sell ($HANDLE)"}<input min="0" step="0.01" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-lg text-white outline-none focus:border-violet-400/60" /></label>
    <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm"><div className="flex justify-between text-slate-400"><span>Estimated receive</span><span className="font-semibold text-white">{estimate.toLocaleString(undefined, { maximumFractionDigits: 2 })} {mode === "buy" ? "$HANDLE" : "SOL"}</span></div><div className="mt-2 flex justify-between text-slate-400"><span>Demo curve price</span><span>{price} SOL</span></div></div>
    <button onClick={simulate} className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 py-3 font-semibold text-slate-950">Simulate {mode}</button>
    {message && <p className="mt-3 text-center text-xs text-emerald-300">{message}</p>}
    <div className="mt-7"><div className="flex justify-between text-xs text-slate-400"><span>Bonding progress</span><span>{progress.toFixed(1)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs text-slate-500">Graduates into a Meteora DAMM pool at 100%.</p></div>
  </div>;
}