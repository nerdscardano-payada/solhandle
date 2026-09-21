import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const links = [["$HANDLE launch", "/upcoming/token-launch"], ["Earn Network", "/earn"], ["Brand protection", "/protected-brands"], ["Protocol & distribution", "/about"]];

export default function HomeInfoStrip() {
  return <nav aria-label="SolHandle ecosystem" className="mt-12 flex flex-col gap-4 border-y border-current/10 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
    <span className="text-xs font-medium uppercase tracking-widest opacity-60">Explore the ecosystem</span>
    <div className="flex flex-wrap gap-x-6 gap-y-3">{links.map(([label, path]) => <Link key={path} to={path} className="inline-flex items-center gap-1.5 text-sm opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:underline">{label}<ArrowUpRight className="h-3.5 w-3.5" /></Link>)}</div>
  </nav>;
}