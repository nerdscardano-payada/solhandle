import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useTokenLaunchSettings() {
  const [tokenMint, setTokenMint] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    base44.entities.TokenLaunchSettings.list("-updated_date", 1)
      .then((records) => { if (active) setTokenMint(records[0]?.token_mint_address || ""); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { tokenMint, loading, isLive: Boolean(tokenMint) };
}