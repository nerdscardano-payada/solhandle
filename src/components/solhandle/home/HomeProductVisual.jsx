import ResponsiveDetails from '@/components/solhandle/ResponsiveDetails';
import IPhoneIdentityPreview from '@/components/solhandle/home/IPhoneIdentityPreview';

export default function HomeProductVisual({ previewHandle }) {
  return <ResponsiveDetails label="Wallet identity preview"><div className="home-product-visual" aria-label="Example of a SolHandle wallet identity">
    <IPhoneIdentityPreview handle={previewHandle}/>
  </div></ResponsiveDetails>;
}