import HomeIdentityExplanation from '@/components/solhandle/home/HomeIdentityExplanation';
import IPhoneIdentityPreview from '@/components/solhandle/home/IPhoneIdentityPreview';

export default function HomeProductVisual({ previewHandle }) {
  return <div className="home-product-visual" aria-label="Example of a SolHandle wallet identity">
    <IPhoneIdentityPreview handle={previewHandle}/>
    <HomeIdentityExplanation/>
  </div>;
}