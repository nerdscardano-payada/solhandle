import { ArrowLeft } from 'lucide-react';
import { useMobileTabs } from '@/components/solhandle/navigation/MobileTabProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MobileBackHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mobileTabs = useMobileTabs();
  const { t } = useLanguage();
  function goBack() {
    if (mobileTabs?.back()) return;
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(pathname.slice(0, pathname.lastIndexOf('/')) || '/', { replace: true });
  }
  return <header className="mobile-back-header dark sticky top-0 z-40 border-b border-border bg-card text-foreground md:hidden">
    <button type="button" onClick={goBack} className="flex min-h-11 items-center gap-2 px-5 py-3 text-sm font-medium" aria-label={t('Go back')}><ArrowLeft className="h-5 w-5" aria-hidden="true"/>{t('Back')}</button>
  </header>;
}