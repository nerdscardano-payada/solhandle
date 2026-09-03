import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { referralLevel } from "@/lib/referralLevels";

export default function AmbassadorBadge({ handle }) {
  const [profile, setProfile] = useState(null); useEffect(() => { base44.functions.invoke("referralPortal", { action: "badge", handle }).then((r) => setProfile(r.data.profile)).catch(() => null); }, [handle]);
  if (!profile || profile.referrals < 5) return null; const level = referralLevel(profile.referrals);
  return <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-sm font-semibold text-violet-200"><Award className="h-4 w-4"/>SolHandle {level.name}</span>;
}