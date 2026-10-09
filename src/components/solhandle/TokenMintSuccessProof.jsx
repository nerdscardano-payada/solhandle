import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { base44 } from '@/api/base44Client';
import formatHandleTokens from '@/components/solhandle/formatHandleTokens';
export default function TokenMintSuccessProof({ signature }) {
  const [payment, setPayment] = useState(null), [error, setError] = useState('');
  const { t } = useLanguage();
  useEffect(() => {
    let current = true;
    base44.functions.invoke('handleTokenMintTransaction', { action: 'confirm', signature }).then(({ data }) => {
      if (!current) return;
      if (data.payment) setPayment(data.payment); else setError(data.error || 'Payment proof is awaiting confirmation.');
    }).catch(caught => { if (current) setError(caught.response?.data?.error || caught.message); });
    return () => { current = false; };
  }, [signature]);
  return <section className="dark mt-6 rounded-xl border border-border bg-card p-5 text-left text-card-foreground"><h2 className="font-semibold">{t('Verified $HANDLE payment')}</h2>{payment ? <dl className="mt-3 grid gap-3 sm:grid-cols-3">{[['Paid', payment.amount_raw], ['Burned', payment.burned_raw], ['Treasury', payment.treasury_raw]].map(([label, raw]) => <div key={label}><dt className="text-muted-foreground">{t(label)}</dt><dd className="font-semibold">{formatHandleTokens(raw, payment.decimals)} $HANDLE</dd></div>)}</dl> : <p className="mt-3 text-sm text-muted-foreground" role="status">{t(error || 'Verifying on-chain payment…')}</p>}<p className="mt-3 text-xs text-muted-foreground">{t('No discount applied. Token proceeds are separate from SOL revenue and do not generate SOL referral rewards.')}</p></section>;
}