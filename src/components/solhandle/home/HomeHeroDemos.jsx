import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, Send, CreditCard } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import homeDemoTranslations from '@/components/i18n/homeDemoTranslations';
import { demoPath } from '@/components/solhandle/demos/demoCatalog';

export default function HomeHeroDemos() {
  const { language } = useLanguage();
  const texts = homeDemoTranslations[language] || homeDemoTranslations.en;
  const demos = [
    { slug: 'wallet-identity', Icon: Wallet, title: texts[2], description: texts[3] },
    { slug: 'wallet-send', Icon: Send, title: texts[4], description: texts[5] },
    { slug: 'payments', Icon: CreditCard, title: texts[6], description: texts[7] }
  ];
  return <section className="px-[5vw] pb-6 pt-2" aria-labelledby="home-demos-title" data-no-translate>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h2 id="home-demos-title" className="text-sm font-semibold text-foreground/85">{texts[0]}</h2>
      <Link to="/demos" className="inline-flex min-h-11 items-center gap-2 text-xs text-names-accent hover:underline">{texts[1]}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true"/></Link>
    </div>
    <div className="grid gap-2 md:grid-cols-3 md:gap-4">
      {demos.map(({ slug, Icon, title, description }) => <Link key={slug} to={demoPath(slug)} className="flex min-w-0 items-center gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-3 transition-colors hover:border-names-accent/30 hover:bg-names-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-names-accent">
        <Icon className="h-5 w-5 shrink-0 text-names-accent" aria-hidden="true"/>
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-foreground">{title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span></span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true"/>
      </Link>)}
    </div>
  </section>;
}