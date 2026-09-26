import { Image } from '@/components/ui/image';

export default function GrowthGoalMascot() {
  return <div className="relative mx-auto h-44 w-64 shrink-0 sm:mx-0">
    <Image src="https://base44.app/api/apps/6a86b7e4bcec5dfac8ee9a44/files/mp/public/6a86b7e4bcec5dfac8ee9a44/375ff3e7b_solhandle-original-GrowthGoalMascot-cap.png" alt="SolHandle-mascotte wijst naar het doel van 100 procent" className="solhandle-mascot-blend absolute bottom-0 left-0 h-44 w-48" fittingType="fit" />
    <span className="absolute right-0 top-4 rounded-xl border border-violet-300/40 bg-slate-900/90 px-3 py-2 text-sm font-semibold text-cyan-200 shadow-lg shadow-violet-500/10">100% goal</span>
  </div>;
}