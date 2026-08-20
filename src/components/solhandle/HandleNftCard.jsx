import { Image } from "@/components/ui/image";
import { Link } from "react-router-dom";

export default function HandleNftCard({ handle }) {
  const label = handle.display || `@${handle.handle}`;
  const size = label.length > 14 ? "text-2xl" : label.length > 10 ? "text-3xl" : "text-4xl";
  return <Link to={`/${handle.handle}`} className="group block overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950 shadow-xl shadow-cyan-950/20">
    <div className="relative aspect-[16/9] overflow-hidden">
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/3e2680817_image.png" alt={`SolHandle NFT artwork for ${label}`} className="absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-105" fittingType="fill"/>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-slate-950/5 to-violet-950/35"/>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[10px] font-semibold tracking-[0.24em] text-cyan-100"><span>SOLHANDLE</span><span>CORE ASSET</span></div>
      <div className="absolute inset-x-0 bottom-0 p-5"><p className="text-xs text-cyan-100/80">SOLANA IDENTITY</p><h3 className={`mt-1 truncate font-semibold tracking-tight text-white ${size}`}>{label}</h3></div>
    </div>
  </Link>;
}