import { Flame, LockKeyhole, ShieldCheck, Vote, Users, BadgePercent } from "lucide-react";

const utility = [
  { icon: Flame, title: "Burn to boost", text: "Spend and permanently burn $HANDLE for featured listings, stronger marketplace visibility and consumable profile upgrades." },
  { icon: LockKeyhole, title: "Lock to unlock", text: "Lock $HANDLE instead of chasing APY to unlock durable access levels and future marketplace or referral advantages." },
  { icon: BadgePercent, title: "Earned benefits", text: "Marketplace and referral multipliers can be introduced progressively, based on real liquidity and protocol activity—not speculation." },
  { icon: Vote, title: "Community governance", text: "Give committed participants a voice in ecosystem priorities, integrations, grants and future utility proposals." },
  { icon: Users, title: "Community access", text: "Unlock holder experiences, private community spaces, launch participation and ecosystem recognition." },
  { icon: ShieldCheck, title: "Identity stays open", text: "Claiming, owning and resolving a SolHandle remains independent from $HANDLE. The token enhances the economy, never the identity layer." }
];

export default function TokenUtilityPreview() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{utility.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><Icon className="h-5 w-5 text-violet-300" /><h3 className="mt-4 font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p></article>)}</div>;
}