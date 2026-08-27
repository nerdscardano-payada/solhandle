import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function Brand() {
  return <Link to="/" className="flex items-center gap-2 text-white"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle" className="h-10 w-10 rounded-lg mix-blend-screen" fittingType="fill"/><span className="font-semibold tracking-tight">SolHandle.io</span></Link>;
}