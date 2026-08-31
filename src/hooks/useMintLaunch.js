import { useEffect, useState } from "react";

export const MINT_LAUNCH_AT = Date.parse("2026-09-04T13:00:00Z");

export default function useMintLaunch() {
  const [now, setNow] = useState(Date.now());
  const remainingMs = Math.max(0, MINT_LAUNCH_AT - now);

  useEffect(() => {
    if (remainingMs === 0) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [remainingMs === 0]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    isLive: remainingMs === 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}