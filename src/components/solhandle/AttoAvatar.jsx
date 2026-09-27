import { Image } from '@/components/ui/image';

const attoImage = 'https://base44.app/api/apps/6a86b7e4bcec5dfac8ee9a44/files/mp/public/6a86b7e4bcec5dfac8ee9a44/375ff3e7b_solhandle-original-GrowthGoalMascot-cap.png';

export default function AttoAvatar({ className = 'h-12 w-12' }) {
  return <span className={`relative inline-block shrink-0 overflow-hidden rounded-full border border-cyan-300/50 bg-slate-950 ${className}`}>
    <Image src={attoImage} alt="Atto, de SolHandle-mascotte" className="absolute -left-[25%] -top-[14%] h-[150%] w-[150%]" fittingType="fit" />
  </span>;
}