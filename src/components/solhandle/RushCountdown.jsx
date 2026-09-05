import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const formatTime = (total) => {
  const seconds = Math.max(0, total);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
};

export default function RushCountdown({ rush }) {
  const [remaining, setRemaining] = useState(rush?.remainingSeconds || 0);

  useEffect(() => {
    setRemaining(rush?.remainingSeconds || 0);
    if (!rush?.active) return undefined;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [rush]);

  if (!rush?.active || remaining <= 0) return null;
  return <div className="mb-4 rounded-xl border border-violet-300/40 bg-gradient-to-r from-violet-500/15 via-cyan-400/10 to-emerald-400/15 px-4 py-3 text-center shadow-[0_0_20px_rgba(139,92,246,.16)]"><span className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-200"><Zap className="h-4 w-4"/>Rush live · 3+ characters for 0.10 SOL</span><b className="mt-1 block font-mono text-lg text-white">Ends in {formatTime(remaining)}</b></div>;
}