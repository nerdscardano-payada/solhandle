import ParallaxGuideAssets from '@/components/solhandle/parallax/ParallaxGuideAssets';
import ParallaxGuideSections from '@/components/solhandle/parallax/ParallaxGuideSections';
import { partTwoSections } from '@/components/solhandle/parallax/parallaxPartTwoGuide';

export default function ParallaxPartTwo() {
  return <section id="part-2" className="mt-16 scroll-mt-6 border-t border-border pt-10">
    <header>
      <p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">Partner implementation guide · Part 2 · 19 October 2026</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">Wallet Watch, Atlas & Passports</h2>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Integration requirements and handle-transfer guidance for the next Parallax release. Wallet Watch first, then consistent creator identities across Atlas and Passports.</p>
      <div className="mt-6 rounded-xl border border-names-accent/25 bg-names-accent/5 p-4 text-sm leading-7"><strong className="text-names-accent">Three independent facts:</strong> current handle ownership, wallet-control verification and project permissions. A handle transfer must never transfer another person’s verification or access.</div>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">This follow-up supersedes Part 1’s proposed Passport-first rollout order, not its SDK or signed-message security requirements. The original instructions remain below their existing links.</p>
      <ParallaxGuideAssets sections={partTwoSections} partTwo/>
    </header>
    <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
      <nav aria-label="Part 2 contents" className="self-start lg:sticky lg:top-6"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Part 2 requirements</p><ol className="mt-4 space-y-3">{partTwoSections.map(section => <li key={section.id}><a href={'#' + section.id} className="block text-sm leading-6 text-muted-foreground hover:text-names-accent">{section.title}</a></li>)}</ol></nav>
      <ParallaxGuideSections sections={partTwoSections}/>
    </div>
  </section>;
}