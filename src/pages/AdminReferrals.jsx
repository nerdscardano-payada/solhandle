import { Link } from "react-router-dom";
import Header from "@/components/solhandle/Header";
import AdminReferralSettings from "@/components/solhandle/AdminReferralSettings";
import AdminReferralOperations from "@/components/solhandle/AdminReferrals";
import { useAuth } from "@/lib/AuthContext";

export default function AdminReferrals() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();
  if (isLoadingAuth) return <main className="min-h-screen bg-[#050811]"/>;
  if (!user) return <main className="min-h-screen bg-[#050811] text-white"><Header/><div className="p-20 text-center"><button onClick={navigateToLogin} className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950">Sign in</button></div></main>;
  if (user.role !== "admin") return <main className="min-h-screen bg-[#050811] text-white"><Header/><div className="p-20 text-center">Access restricted.</div></main>;
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9"><Link to="/admin" className="text-sm text-cyan-300">← Developer dashboard</Link><h1 className="mt-2 text-4xl font-semibold">Referral Management</h1><p className="mt-3 text-slate-400">Launch controls, promoters, rewards, payouts and fraud reviews.</p><AdminReferralSettings/><AdminReferralOperations/></section></div></main>;
}