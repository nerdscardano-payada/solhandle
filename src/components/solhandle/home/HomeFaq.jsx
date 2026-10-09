import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { ChevronDown } from 'lucide-react';

const questions = [
  ['What do I get when I mint?', 'A unique @name represented by an NFT in the official SolHandle collection, minted directly to your wallet. The current NFT owner controls the name. There are no renewal fees.'],
  ['Where can I use my @name?', 'Use it in SolHandle Pay and in apps that integrate SolHandle, including the publicly announced MMO Alpha Terminal integration. Support is not automatic in every Solana wallet or app.'],
  ['Can I sell or transfer my name?', 'Yes. You can transfer the official NFT or list your name on the marketplace. Control follows the current on-chain owner, so the buyer or recipient becomes the owner of the name.']
];
export default function HomeFaq() {
  const { t } = useLanguage();
  const search = () => { document.getElementById('search-handles')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); document.getElementById('home-handle-input')?.focus({ preventScroll: true }); };
  return <>
    <section className="home-content-section"><div className="flex items-center justify-between gap-4"><h2 className="home-section-title">{t('Before you claim')}</h2><Link to="/faq" className="text-sm text-names-accent">{t('All questions')} →</Link></div>{questions.map(([question, answer]) => <details key={question} className="group border-b border-names-accent/15 py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold">{t(question)}<ChevronDown className="h-4 w-4 shrink-0 text-names-accent group-open:rotate-180"/></summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/75">{t(answer)}</p></details>)}</section>
    <section className="home-content-section flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center lg:gap-8"><div><h2 className="home-section-title">{t('Give your wallet a name.')}</h2><p className="text-sm text-foreground/70">{t("Search first. Connect your wallet when you're ready to claim.")}</p></div><button type="button" onClick={search} className="home-primary-button shrink-0">{t('Find your @name')} →</button></section>
  </>;
}