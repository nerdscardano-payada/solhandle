import ResponsiveDetails from '@/components/solhandle/ResponsiveDetails';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import IPhoneIdentityPreview from '@/components/solhandle/home/IPhoneIdentityPreview';

export default function HomeProductVisual({ previewHandle }) {
  const { t } = useLanguage();
  return <ResponsiveDetails label={t('Wallet identity preview')}><div className="home-product-visual" aria-label="Example of a SolHandle wallet identity">
    <IPhoneIdentityPreview handle={previewHandle}/>
  </div></ResponsiveDetails>;
}