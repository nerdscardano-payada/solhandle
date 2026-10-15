import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Header from '@/components/solhandle/Header';
import PayLinkGenerator from '@/components/solhandle/PayLinkGenerator';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function Receive() {
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || '';
  const { t } = useLanguage();
  const ownership = useQuery({ queryKey: ['receive-handles', wallet], enabled: Boolean(wallet), queryFn: async () => (await base44.functions.invoke('getOwnerHandles', { wallet })).data.handles });
  const primary = useQuery({ queryKey: ['receive-primary', wallet], enabled: Boolean(wallet), queryFn: async () => (await base44.functions.invoke('reverseResolveSolHandle', { address: wallet })).data.primaryHandle });
  return <main className="dark min-h-screen bg-hero-canvas text-foreground"><Header/><section className="mx-auto max-w-2xl px-5 py-8 md:py-12">
    <h1 className="text-3xl font-semibold">{t('Receive SOL')}</h1>
    <p className="mt-2 text-sm text-muted-foreground">{t('Share your payment QR')}</p>
    {wallet && ownership.isError ? <div role="alert" className="mt-6 rounded-xl border border-destructive p-4 text-sm"><p>{t('Could not verify your handles. Please try again.')}</p><button type="button" onClick={() => ownership.refetch()} className="mt-2 text-names-accent">{t('Retry')}</button></div> : <PayLinkGenerator handles={ownership.data || []} wallet={wallet} primaryHandle={primary.data || ''} loading={Boolean(wallet) && ownership.isPending}/>}
    {wallet && ownership.isSuccess && !ownership.data.length && <Link to="/" className="mt-5 inline-flex items-center text-sm text-names-accent">{t('Mint a Handle')} →</Link>}
  </section></main>;
}