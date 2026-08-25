import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import HandleCard from "@/components/solhandle/HandleCard";

const rarityLabel = (value) => ({ LEGENDARY: "Legendary", ULTRA_RARE: "Ultra Rare", RARE: "Rare", UNCOMMON: "Uncommon", STANDARD: "Standard" }[value] || "Standard");

export default function ExploreHandleCard({ item }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-lg shadow-black/20">
      <HandleCard handle={item.handle} display={item.display} to={`/${item.handle}`} className="rounded-none border-0 border-b border-white/10" />
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 text-xs"><span className="text-violet-300">{rarityLabel(item.rarity)}</span><span className="text-slate-500">{item.nameClass === "Premium" ? "Premium" : `${item.length} char`}</span></div>
        <p className="mt-4 text-xs font-semibold tracking-wider text-emerald-300">CLAIMED</p>
        <Link to={`/${item.handle}`} className="mt-2 flex items-center justify-between text-sm font-medium text-white"><span>View {item.display}</span><ArrowRight className="h-4 w-4 text-cyan-300" /></Link>
      </div>
    </article>
  );
}