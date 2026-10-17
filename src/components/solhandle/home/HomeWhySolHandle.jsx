import useHomePayCopy from '@/components/solhandle/home/useHomePayCopy';

export default function HomeWhySolHandle() {
  const t = useHomePayCopy();
  return <section aria-labelledby="home-why-title" className="home-content-section !py-10" data-no-translate>
    <h2 id="home-why-title" className="font-heading text-3xl font-semibold tracking-tight">{t('Why SolHandle?')}</h2>
    <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{t('Make your Solana identity easy to remember. One unique @handle instead of a long wallet address, owned in your own wallet and ready to receive SOL with SolHandle Pay. Pay once, with no renewal fees. Your funds and private keys stay yours.')}</p>
  </section>;
}