import { useEffect, useState } from "react";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const SCRIPT_ID = "jupiter-plugin-script";

export default function JupiterSwap({ tokenMint }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    const start = () => {
      if (!active || !window.Jupiter) return;
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "jupiter-terminal",
        endpoint: "https://api.mainnet-beta.solana.com",
        formProps: { initialInputMint: SOL_MINT, initialOutputMint: tokenMint, fixedOutputMint: true },
      });
      setStatus("ready");
    };
    const existing = document.getElementById(SCRIPT_ID);
    if (window.Jupiter) start();
    else if (existing) existing.addEventListener("load", start, { once: true });
    else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID; script.src = "https://plugin.jup.ag/plugin-v1.js"; script.async = true;
      script.onload = start; script.onerror = () => setStatus("error"); document.head.appendChild(script);
    }
    return () => { active = false; };
  }, [tokenMint]);

  return <div className="relative min-h-[590px] overflow-hidden rounded-2xl bg-slate-950"><div id="jupiter-terminal" className="min-h-[590px]" />{status === "loading" && <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-sm text-slate-400">Loading Jupiter swap…</div>}{status === "error" && <div className="absolute inset-0 flex items-center justify-center bg-slate-950 p-6 text-center text-sm text-rose-300">Jupiter could not load. Use the pump.fun route below.</div>}</div>;
}