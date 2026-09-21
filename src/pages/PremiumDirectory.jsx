import Header from "@/components/solhandle/Header";
import PremiumHandleDirectory from "@/components/solhandle/PremiumHandleDirectory";

export default function PremiumDirectory() {
  return <main className="min-h-screen bg-platform text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9"><PremiumHandleDirectory/></section></div></main>;
}