import { useState } from "react";
import { Star } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { setPrimarySolHandle } from "@/lib/mintSolHandle";

export default function SetPrimaryButton({ handle, onSuccess }) {
  const { publicKey, sendTransaction } = useWallet();
  const [setting, setSetting] = useState(false);
  const [error, setError] = useState("");

  const setPrimary = async () => {
    if (!publicKey) return;
    setSetting(true);
    setError("");
    try {
      await setPrimarySolHandle({ handle, wallet: publicKey, sendTransaction });
      onSuccess(handle);
    } catch (caught) {
      setError(caught.message || "Could not set your primary handle.");
    } finally {
      setSetting(false);
    }
  };

  return <div><button onClick={setPrimary} disabled={setting || !publicKey} className="inline-flex items-center gap-1 text-amber-200 disabled:opacity-50"><Star className="h-4 w-4" />{setting ? "Setting…" : "Set primary"}</button>{error && <p className="mt-2 text-xs text-rose-300">{error}</p>}</div>;
}