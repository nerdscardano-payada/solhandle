import { useEffect, useState } from "react";

export default function useDexScreenerMarket(tokenMint, configuredPair) {
  const [market, setMarket] = useState(null);
  const [status, setStatus] = useState(tokenMint ? "loading" : "prelaunch");
  useEffect(() => {
    if (!tokenMint) return;
    let active = true;
    const load = async () => {
      setStatus("loading");
      const response = await fetch(`https://api.dexscreener.com/token-pairs/v1/solana/${tokenMint}`);
      const pairs = await response.json();
      if (!active) return;
      const selected = configuredPair
        ? pairs.find((pair) => pair.pairAddress === configuredPair)
        : [...pairs].sort((a, b) => Number(b.liquidity?.usd || 0) - Number(a.liquidity?.usd || 0))[0];
      setMarket(selected || null);
      setStatus(selected ? "live" : "waiting");
    };
    const safeLoad = () => load().catch(() => { if (active) setStatus("unavailable"); });
    safeLoad();
    const timer = window.setInterval(safeLoad, 30000);
    return () => { active = false; window.clearInterval(timer); };
  }, [tokenMint, configuredPair]);
  return { market, status };
}