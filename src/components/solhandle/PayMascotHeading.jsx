import { Image } from '@/components/ui/image';

export default function PayMascotHeading() {
  return <div className="flex items-center justify-between gap-2 sm:gap-5">
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">SolHandle Pay · Mainnet</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Send SOL to an @handle.</h1>
    </div>
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c387520a8_generated_image.png" alt="SolHandle mascot sending a payment" className="solhandle-mascot-blend h-28 w-28 shrink-0 sm:h-44 sm:w-44" fittingType="fit" />
  </div>;
}