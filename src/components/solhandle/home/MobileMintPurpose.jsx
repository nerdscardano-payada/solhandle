import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Image } from '@/components/ui/image';

export default function MobileMintPurpose() {
  const { t } = useLanguage();
  return <figure className="mt-9 overflow-hidden rounded-2xl border border-names-accent/20 bg-hero-canvas">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c608dfebb_generated_image.png" alt={t('Turn a long wallet address into a memorable @name. Your identity on Solana, owned by you.')} fittingType="fit" className="block aspect-[3/2] w-full" />
    <figcaption className="px-5 pb-6 text-center">
      <h2 className="text-base font-semibold text-names-accent">{t('Why mint a handle?')}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('Turn a long wallet address into a memorable @name. Your identity on Solana, owned by you.')}</p>
    </figcaption>
  </figure>;
}