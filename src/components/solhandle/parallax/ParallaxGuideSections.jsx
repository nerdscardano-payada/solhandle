import ResolveCodeBlock from '@/components/solhandle/resolve/ResolveCodeBlock';
import { guideSections } from '@/components/solhandle/parallax/parallaxGuide';

export default function ParallaxGuideSections({ sections = guideSections }) {
  return <div className="min-w-0 space-y-6">{sections.map(section => <section id={section.id} key={section.id} className="scroll-mt-6 min-w-0 rounded-2xl border border-border bg-card p-5 lg:p-8">
    <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">{section.title}</h2>
    <p className="mt-4 text-sm leading-7 text-muted-foreground lg:text-base">{section.text}</p>
    {section.code && <ResolveCodeBlock code={section.code} language={section.language}/>}
    <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground">{section.bullets.map(text => <li key={text} className="break-words">{text}</li>)}</ul>
  </section>)}</div>;
}