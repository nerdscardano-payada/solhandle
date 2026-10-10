import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HomeIdentityIntro() {
  const { t } = useLanguage();
  return <div className="mt-5 space-y-3">
    <p className="text-base leading-relaxed text-foreground lg:text-xl">{t('Turn your long wallet address into a simple @handle.')}</p>
    <p className="text-sm leading-relaxed text-foreground/80 lg:text-base">{t('Easy to remember. Easy to share. Use it to receive SOL.')}</p>
    <div className="flex flex-wrap items-center gap-3 text-lg lg:text-xl">
      <span className="font-mono text-foreground/70">7xA9…N5aP</span>
      <ArrowRight className="h-5 w-5 shrink-0 text-names-accent" aria-hidden="true" />
      <span className="home-gradient-text font-semibold">@ansem</span>
    </div>
  </div>;
}