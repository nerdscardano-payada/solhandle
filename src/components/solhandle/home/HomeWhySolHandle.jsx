import useHomePayCopy from '@/components/solhandle/home/useHomePayCopy';

export default function HomeWhySolHandle() {
  const t = useHomePayCopy();
  return <section aria-labelledby="home-why-title" className="home-content-section !py-10" data-no-translate>
    <h2 id="home-why-title" className="font-heading text-3xl font-semibold tracking-tight">{t('Why SolHandle?')}</h2>
    <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">{t('Make your Solana identity easy to remember. One unique @handle instead of a long wallet address, owned in your own wallet and ready to receive SOL with SolHandle Pay. Pay once, with no renewal fees. Your funds and private keys stay yours.')}</p>
      <div className="inline-flex shrink-0 items-center gap-3 self-start rounded-xl border border-names-secondary/25 bg-names-secondary/5 px-5 py-4 md:self-auto" aria-label={t('Made on Solana')}>
        <svg viewBox="0 0 32 26" className="h-7 w-8" aria-hidden="true">
          <defs><linearGradient id="why-solana-gradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="currentColor" className="text-names-secondary"/><stop offset="100%" stopColor="currentColor" className="text-names-success"/></linearGradient></defs>
          <path fill="url(#why-solana-gradient)" d="M6 1h26l-6 6H0zm-6 9h26l6 6H6zm6 9h26l-6 6H0z"/>
        </svg>
        <span className="text-sm font-semibold text-foreground">{t('Made on Solana')}</span>
      </div>
    </div>
  </section>;
}