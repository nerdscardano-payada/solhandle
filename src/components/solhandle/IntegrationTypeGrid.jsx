import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { integrationTypes } from "@/lib/integrationCatalog";

export default function IntegrationTypeGrid() {
  return <section className="mt-12"><h2 className="text-2xl font-semibold">Choose your product type</h2><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{integrationTypes.map((item) => <a key={item.id} href={`#${item.id}`} className="group rounded-2xl border border-white/10 bg-slate-950/60 p-5 hover:border-cyan-300/30"><p className="text-xs font-semibold tracking-wider text-cyan-300">{item.promise.toUpperCase()}</p><h3 className="mt-2 text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p><span className="mt-5 flex items-center gap-2 text-sm text-cyan-200">View guides <ArrowRight className="h-4 w-4" /></span></a>)}</div><div className="mt-6 text-sm text-slate-500">Need the protocol reference first? <Link to="/developers" className="text-cyan-200 hover:text-cyan-100">Open developer documentation</Link>.</div></section>;
}