import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyHandleLink, shareHandleOnX } from "@/lib/shareSolHandle";

export default function HandleShareActions({ handle, isPremium = false, location, prominent = false }) {
  const [copied, setCopied] = useState(false);
  const share = () => shareHandleOnX({ handle, isPremium, location });
  const copy = async () => {
    await copyHandleLink({ handle, location });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const buttonClass = prominent
    ? "inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white"
    : "inline-flex items-center gap-1 text-cyan-200";

  return (
    <div className={`flex flex-wrap items-center ${prominent ? "justify-center gap-3" : "gap-4"}`}>
      <button type="button" onClick={share} className={buttonClass} aria-label={`Share @${handle} on X`}>
        <span aria-hidden="true">𝕏</span> Share on X
      </button>
      <button type="button" onClick={copy} className={buttonClass}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}