import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function Brand({ prominent = false }) {
  return <Link to="/" className={prominent ? 'home-brand flex items-center gap-3 text-foreground' : 'flex items-center gap-2 text-white'}><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle" className={prominent ? 'home-brand-logo h-10 w-10 shrink-0 mix-blend-screen' : 'h-10 w-10 rounded-lg mix-blend-screen'} fittingType="fit"/><span className={prominent ? 'home-brand-name font-semibold tracking-tight' : 'font-semibold tracking-tight'}>{prominent ? 'SOLHANDLE' : 'SolHandle.io'}</span></Link>;
}