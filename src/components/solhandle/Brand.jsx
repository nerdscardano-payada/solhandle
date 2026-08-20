import { AtSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand() {
  return <Link to="/" className="flex items-center gap-2 text-white"><span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 via-cyan-400 to-violet-500 shadow-[0_0_22px_rgba(63,242,201,.45)]"><AtSign className="h-5 w-5 text-slate-950" /></span><span className="font-semibold tracking-tight">SolHandle.io</span></Link>;
}