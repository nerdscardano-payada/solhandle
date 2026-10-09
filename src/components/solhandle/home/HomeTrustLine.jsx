import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Wallet, ShieldCheck, Coins } from 'lucide-react';
import { PROGRAM_ID } from '@/lib/solhandleProtocol';

export default function HomeTrustLine() {
  const { t } = useLanguage();
  return <div className="hidden lg:block">
    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground/80">{[[Wallet, 'NFT in your wallet'], [Coins, 'No renewals'], [ShieldCheck, 'You approve the transaction']].map(([Icon, text]) => <span key={text} className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-names-accent"/>{t(text)}</span>)}</div>
    <div className="mt-3 flex gap-5 text-xs text-names-accent"><a href={`https://explorer.solana.com/address/${PROGRAM_ID}`} target="_blank" rel="noopener noreferrer">{t('View on-chain program')} ↗</a><Link to="/docs">{t('Protocol details')} →</Link></div>
  </div>;
}