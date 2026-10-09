import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { captureReferralAttribution } from '@/lib/referralAttribution';
export default function ReferralLandingGate({ children }) {
  const { t } = useLanguage();
  const [ready, setReady] = useState(() => !new URLSearchParams(window.location.search).get('ref'));
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (ready) return;
    let current = true;
    setError(false);
    captureReferralAttribution().then(() => { if (current) setReady(true); }).catch(() => { if (current) setError(true); });
    return () => { current = false; };
  }, [ready, retry]);
  if (ready) return children;
  return <div className="mt-7 rounded-xl border border-border p-5 text-sm text-muted-foreground" role="status">{error ? <>{t('We could not register your website referral. Retry before claiming.')}<button type="button" onClick={() => setRetry(value => value + 1)} className="ml-3 text-names-accent underline">{t('Retry')}</button></> : t('Preparing your referred visit…')}</div>;
}