import { Flame, LockKeyhole, ShieldCheck } from "lucide-react";

const utility = [
  { icon: Flame, title: "Burn to boost", text: "Consume $HANDLE for marketplace visibility and useful upgrades." },
  { icon: LockKeyhole, title: "Lock to benefit", text: "Lock tokens for durable access, referral or marketplace benefits." },
  { icon: ShieldCheck, title: "Identity stays open", text: "Resolution and handle ownership never require $HANDLE." }
];

export default function TokenUtilityPreview() {
  return <div className="grid gap-4 sm:grid-cols-3">{utility.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><Icon className="h-5 w-5 text-violet-300" /><h3 className="mt-4 font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p></article>)}</div>;
}