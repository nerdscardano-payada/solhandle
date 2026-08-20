import { Image } from "@/components/ui/image";
import { Link } from "react-router-dom";

export default function HandleNftCard({ handle }) {
  const label = handle.display || `@${handle.handle}`;
  const size = label.length > 14 ? "text-2xl" : label.length > 10 ? "text-3xl" : "text-4xl";
  return <Link to={`/${handle.handle}`} className="group block overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950 shadow-xl shadow-cyan-950/20">
    <div className="relative aspect-[16/9] overflow-hidden">
      <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/21d822722_image.png" alt={`SolHandle NFT artwork for ${label}`} className="absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-105" fittingType="fill"/>
      <div className="absolute inset-0 bg-slate-950/35"/>
      <div className="absolute inset-x-[8%] inset-y-[15%] flex flex-col items-center justify-center rounded-2xl border border-cyan-200/80 bg-slate-950/45 px-5 text-center shadow-[inset_1px_0_12px_rgba(34,211,238,0.18),inset_-1px_0_12px_rgba(168,85,247,0.2),0_0_22px_rgba(34,211,238,0.22)] backdrop-blur-[2px]">
        <div className="mb-2 flex flex-col gap-0.5"><span className="h-1.5 w-5 -skew-x-12 bg-cyan-300"/><span className="h-1.5 w-5 -skew-x-12 bg-gradient-to-r from-cyan-300 to-violet-400"/><span className="h-1.5 w-5 -skew-x-12 bg-violet-400"/></div>
        <h3 className={`max-w-full truncate font-semibold tracking-tight text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text ${size}`}>{label}</h3>
        <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent"/>
        <p className="text-[10px] font-medium tracking-[0.38em] text-cyan-100">SOLHANDLE</p>
        <p className="mt-2 text-[10px] text-white/85">✦ Official SolHandle</p>
      </div>
    </div>
  </Link>;
}