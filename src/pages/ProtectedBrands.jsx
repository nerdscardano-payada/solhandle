import { CheckCircle2, Scale, ShieldCheck } from "lucide-react";
import Header from "@/components/solhandle/Header";
import ProtectedBrandDirectory from "@/components/solhandle/ProtectedBrandDirectory";
import BrandProtectionPolicy from "@/components/solhandle/BrandProtectionPolicy";

const promises = [[ShieldCheck, "Protected, never owned", "Reserved handles remain unminted, unowned and unavailable for sale."], [CheckCircle2, "Verified direct issuance", "After domain and wallet verification, the handle is minted directly to the organization."], [Scale, "Always free to claim", "Verified organizations never pay SolHandle to receive their official reserved handle."]];

export default function ProtectedBrands() {
  return (
    <main className="min-h-screen bg-[#050811] text-white">
      <div className="mx-auto min-h-screen max-w-7xl border-x border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(36,177,190,.14),transparent_28%),radial-gradient(circle_at_85%_35%,rgba(130,58,255,.13),transparent_30%)]">
        <Header/>
        <div className="px-5 py-14 md:px-9 md:py-20">
          <section className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-3 py-1 text-xs text-emerald-200"><ShieldCheck className="h-3.5 w-3.5"/>Brand & Ecosystem Protection</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Protected before launch. <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 bg-clip-text text-transparent">Claimed by the rightful organization.</span></h1>
            <p className="mx-auto mt-6 max-w-3xl leading-relaxed text-slate-300">Recognizable organization and protocol names are reserved before public registration to prevent impersonation. SolHandle never mints, owns, lists or sells these reserved identities.</p>
          </section>
          <section className="mt-12 grid gap-4 md:grid-cols-3">{promises.map(([Icon, title, text]) => <article key={title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"><Icon className="h-6 w-6 text-emerald-300"/><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p></article>)}</section>
          <BrandProtectionPolicy/>
          <section className="mt-16"><div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Live directory</p><h2 className="mt-2 text-3xl font-semibold">Reserved and protected names</h2><p className="mt-2 text-sm text-slate-400">A transparent record of anti-squatting restrictions—not a partner directory or ownership claim.</p></div><ProtectedBrandDirectory/></section>
        </div>
      </div>
    </main>
  );
}