import { Image } from "@/components/ui/image";

export default function HeroIdentityMark() {
  return (
    <div className="relative mx-auto w-full max-w-xs lg:max-w-none" aria-label="SolHandle — Your identity. Yours.">
      <div className="absolute inset-[12%] rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -inset-3 rounded-full border border-violet-400/10" />
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/50 p-2 shadow-[0_0_50px_rgba(34,211,238,.12)] backdrop-blur-sm">
        <Image
          src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/57d22a75c_solhandlelogo.png"
          alt="SolHandle logo — Your identity. Yours."
          className="aspect-square w-full rounded-[1.6rem]"
          fittingType="fit"
        />
        <div className="pointer-events-none absolute inset-2 rounded-[1.6rem] bg-gradient-to-t from-slate-950/25 via-transparent to-cyan-300/5" />
      </div>
      <div className="relative mx-auto -mt-4 w-fit rounded-full border border-emerald-300/25 bg-slate-950/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200 shadow-lg">
        Mainnet identity protocol
      </div>
    </div>
  );
}