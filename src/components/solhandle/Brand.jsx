import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function Brand({ reference = false }) {
  if (reference) return <Link to="/" className="flex shrink-0 items-center gap-3 text-foreground"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle" className="h-14 w-14 mix-blend-screen" fittingType="fit"/><span><span className="hero-brand-gradient block text-xl font-semibold tracking-[0.2em]">SOLHANDLE</span><span className="mt-1 block text-center text-[8px] uppercase tracking-[0.3em]">Your identity. Yours.</span></span></Link>;
  return <Link to="/" className="flex items-center gap-2 text-white"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle" className="h-10 w-10 rounded-lg mix-blend-screen" fittingType="fill"/><span className="font-semibold tracking-tight">SolHandle.io</span></Link>;
}