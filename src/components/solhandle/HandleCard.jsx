import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildHandlePngBlob } from "@/lib/buildHandlePng";

// The canonical SolHandle card — renders the exact same PNG that is minted,
// so the homepage, handle info page and My Handles all look byte-identical
// to what appears in the user's wallet.
export default function HandleCard({ handle, display, to, className }) {
  const clean = String(handle || "").replace(/^@/, "").toLowerCase();
  const [url, setUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let revoked = null;
    let cancelled = false;
    setFailed(false);
    setUrl(null);
    buildHandlePngBlob(clean)
      .then((file) => {
        const objectUrl = URL.createObjectURL(file);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        revoked = objectUrl;
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [clean]);

  const label = display || `@${clean}`;
  const frame = (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950 ${className || ""}`} style={{ aspectRatio: "16 / 9" }}>
      {url ? (
        <img src={url} alt={`SolHandle NFT card for ${label}`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-sm text-slate-500">
          {failed ? "Card unavailable" : "Rendering card…"}
        </div>
      )}
    </div>
  );

  if (!to) return frame;
  return (
    <Link to={to} aria-label={`View ${label}`} className="block">
      {frame}
    </Link>
  );
}