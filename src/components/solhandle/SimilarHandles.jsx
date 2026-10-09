import { useEffect, useState } from "react";
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { lamportsToSol } from "@/lib/solhandle";

export default function SimilarHandles({ handle, title = "Similar Handles" }) {
  const { t } = useLanguage();
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!handle) return;
    setLoading(true); setItems([]);
    base44.functions.invoke("getHandleRecommendations", { handle }).then(({ data }) => {
      setItems(data.recommendations || []);
      if (data.recommendations?.length) base44.analytics.track({ eventName: "handle_recommendation_impression", properties: { source_handle: handle, count: data.recommendations.length } });
    }).catch(() => setItems([])).finally(() => setLoading(false));
  }, [handle]);
  if (!loading && !items.length) return null;
  return <section className="mt-8 text-left"><h2 className="text-xl font-semibold text-white">{t(title)}</h2>{loading ? <p className="mt-4 flex items-center gap-2 text-sm text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin"/>{t('Checking live availability…')}</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item)=><Link key={item.handle} to={`/?claim=${item.handle}`} onClick={()=>base44.analytics.track({ eventName:"handle_recommendation_click", properties:{ source_handle:handle, recommended_handle:item.handle } })} className="rounded-xl border border-white/10 bg-slate-950/70 p-4 hover:border-cyan-300/40"><div className="flex items-center justify-between"><strong className="text-lg text-white">@{item.handle}</strong>{item.premium && <span className="text-xs font-semibold text-violet-300">◆ {t('Premium').toUpperCase()}</span>}</div><p className="mt-2 text-sm text-emerald-300">{t('Available')}</p><p className="mt-1 text-sm text-slate-300">{lamportsToSol(item.priceLamports)} SOL</p><p className="mt-3 text-xs capitalize text-slate-500">{item.categories.slice(0,2).map(category => t(category)).join(' · ')}</p></Link>)}</div>}</section>;
}