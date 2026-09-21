import Header from "@/components/solhandle/Header";
import ReferralLeaderboard from "@/components/solhandle/ReferralLeaderboard";
import ReferralActivity from "@/components/solhandle/ReferralActivity";

export default function Leaderboard() {
  return <main className="min-h-screen bg-platform text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-14 md:px-9"><div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Founding Ambassador Program</p><h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Ambassador Leaderboard</h1><p className="mt-4 max-w-2xl text-slate-400">Discover the ambassadors with the most confirmed SolHandle mints and rewards.</p><div className="mt-10"><ReferralLeaderboard/></div><div className="mt-8"><ReferralActivity/></div></div></section></div></main>;
}