import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HomeMintPurpose() {
  const { t } = useLanguage();
  return <aside className="mt-4 rounded-xl border border-names-accent/30 bg-names-accent/5 px-4 py-3">
    <p className="text-sm font-semibold text-names-accent">{t('Why mint a handle?')}</p>
    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{t('Turn a long wallet address into a memorable @name. Your identity on Solana, owned by you.')}</p>
  </aside>;
}