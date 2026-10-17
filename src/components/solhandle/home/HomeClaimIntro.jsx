import useHomePayCopy from '@/components/solhandle/home/useHomePayCopy';

export default function HomeClaimIntro() {
  const t = useHomePayCopy();
  return <div data-no-translate>
    <h1 className="mt-4 font-heading text-5xl font-semibold leading-[1.08] tracking-tight lg:text-6xl">
      {t('Claim your')} <span className="home-gradient-text">{t('@identity')}</span><br/>{t('on Solana.')}
    </h1>
    <p className="mt-5 max-w-lg text-lg leading-relaxed text-foreground/80">{t('One memorable @handle. Owned by you. Ready to use in SolHandle Pay.')}</p>
  </div>;
}