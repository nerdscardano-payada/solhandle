import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const steps = [
  ["storage", "Checking NFT storage"],
  ["metadata", "Publishing metadata"],
  ["wallet", "Wallet confirmation"],
  ["confirmed", "Claim confirmed"]
];

export default function MintProgress({ phase, error }) {
  const { t } = useLanguage();
  const notice = useRef(null);
  useEffect(() => {
    if ((phase || error) && notice.current?.getClientRects().length) notice.current.scrollIntoView({ block: 'nearest' });
  }, [phase, error]);
  if (!phase && !error) return null;
  if (error) return <div ref={notice} role="alert" className="flex gap-2 rounded-lg border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200"><CircleAlert className="h-4 w-4 shrink-0" />{t(error)}</div>;
  const activeIndex = steps.findIndex(([value]) => value === phase);
  return <div ref={notice} role="status" aria-live="polite" className="space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-4">{steps.map(([value, label], index) => {
    const complete = phase === "confirmed" || index < activeIndex;
    const active = index === activeIndex && phase !== "confirmed";
    return <div key={value} className={`flex items-center gap-3 text-sm ${complete || active ? "text-cyan-100" : "text-slate-500"}`}>
      {complete ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <LoaderCircle className={`h-4 w-4 ${active ? "animate-spin text-cyan-300" : "text-slate-600"}`} />}{t(label)}
    </div>;
  })}</div>;
}