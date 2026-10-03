import { Image } from '@/components/ui/image';

export default function SearchAtto() {
  return <aside className="relative hidden min-h-[28rem] self-stretch lg:block" aria-label="Atto exploring SolHandle names">
    <Image
      src="https://base44.app/api/apps/6a86b7e4bcec5dfac8ee9a44/files/mp/public/6a86b7e4bcec5dfac8ee9a44/fd76de801_solhandle-original-ExploreMascot-cap.png"
      alt="Atto standing full-length with a magnifying glass, ready to help find your SolHandle"
      className="solhandle-mascot-blend absolute inset-0 block h-full w-full -scale-x-100"
      fittingType="fit"
    />
  </aside>;
}