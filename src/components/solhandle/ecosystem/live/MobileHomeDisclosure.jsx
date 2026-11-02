import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import '@/components/solhandle/ecosystem/live/mobile-home-disclosure.css';

export default function MobileHomeDisclosure({ title, summary, variant, children }) {
  const { t } = useLanguage();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  if (!mobile) return children;
  return <details className={`mobile-home-disclosure mobile-home-disclosure--${variant}`}>
    <summary><span><strong>{t(title)}</strong><span>{t(summary)}</span></span><ChevronDown size={20} aria-hidden="true"/></summary>
    <div className="mobile-home-disclosure-content">{children}</div>
  </details>;
}