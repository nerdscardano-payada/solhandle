import { Star } from 'lucide-react';

export default function PrimaryHandleBadge({ active }) {
  if (active !== true) return null;
  return <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full border border-names-accent/30 bg-names-accent/10 px-2 py-1 text-[10px] font-semibold leading-tight text-names-accent" title="This handle is set on-chain as the primary name for its owner's wallet.">
    <Star size={11} aria-hidden="true"/>
    Primary Handle
  </span>;
}