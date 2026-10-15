import Header from '@/components/solhandle/Header';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import HandleMintStatistics from '@/components/solhandle/HandleMintStatistics';
import TokenBurnStatistics from '@/components/solhandle/TokenBurnStatistics';

export default function Statistics() {
  const { t } = useLanguage();
  return <main className="dark min-h-screen bg-hero-canvas text-foreground">
    <Header />
    <div className="mx-auto max-w-5xl px-5 py-7 width-min-[768px]:py-12">
      <h1 className="text-3xl font-semibold">{t('Statistics')}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('Handles, mint activity, $HANDLE and burns. Updated every minute.')}</p>
      <HandleMintStatistics />
      <TokenBurnStatistics />
    </div>
  </main>;
}