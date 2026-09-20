import Header from "@/components/solhandle/Header";
import LitepaperHero from "@/components/solhandle/litepaper/LitepaperHero";
import LitepaperRevenue from "@/components/solhandle/litepaper/LitepaperRevenue";
import LitepaperExamples from "@/components/solhandle/litepaper/LitepaperExamples";
import LitepaperRules from "@/components/solhandle/litepaper/LitepaperRules";
import LitepaperFaq from "@/components/solhandle/litepaper/LitepaperFaq";
import { earnLitepaper as paper } from "@/lib/earnLitepaperContent";
import { downloadEarnLitepaper } from "@/lib/downloadEarnLitepaper";

export default function EarnLitepaper() {
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto max-w-7xl border-x border-white/10"><Header/><LitepaperHero paper={paper} onDownload={downloadEarnLitepaper}/><div className="px-5 py-12 md:px-10"><div className="mx-auto max-w-5xl"><LitepaperRevenue streams={paper.streams} tiers={paper.tiers}/><LitepaperExamples examples={paper.examples}/><LitepaperRules rules={paper.rules} prelaunch={paper.prelaunch}/><LitepaperFaq faqs={paper.faqs} disclaimer={paper.disclaimer}/></div></div></div></main>;
}