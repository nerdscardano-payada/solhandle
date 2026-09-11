import Header from "@/components/solhandle/Header";
import UpcomingProjectCard from "@/components/solhandle/UpcomingProjectCard";

const projects = [
  {
    phase: "Phase 07", title: "Native Marketplace V1", status: "Up next", accent: "cyan", path: "/upcoming/marketplace",
    summary: "Create an on-chain economy for SolHandle identities before introducing the ecosystem token.",
    items: ["Fixed-price Buy Now and escrow-backed offers", "Wallet-signed, non-custodial settlement", "0% marketplace fee and 5% SolHandle protocol royalty", "Measure listings, volume, traders and royalty revenue"]
  },
  {
    phase: "Phase 08", title: "$HANDLE via Meteora DBC", status: "After marketplace", accent: "violet", path: "/upcoming/token-launch",
    summary: "Launch useful community ownership through a branded SolHandle experience powered by a direct Meteora Dynamic Bonding Curve.",
    items: ["Burn-to-boost and lock-to-benefit utility", "Handle resolution remains fully token-independent", "Bonding curve graduates liquidity into a Meteora DAMM pool", "Tokenomics, vesting, security and legal/MiCA review before launch"]
  }
];

export default function UpcomingProjects() {
  return <main className="min-h-screen overflow-hidden bg-[#030615] text-white">
    <Header />
    <section className="relative px-5 py-16 md:px-9 md:py-24">
      <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" /><div className="absolute right-1/4 top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">What comes next</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">Upcoming projects</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">Marketplace first. Measured utility second. Every phase strengthens SolHandle as Solana's non-custodial identity layer.</p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">{projects.map((project) => <UpcomingProjectCard key={project.phase} {...project} />)}</div>
      </div>
    </section>
  </main>;
}