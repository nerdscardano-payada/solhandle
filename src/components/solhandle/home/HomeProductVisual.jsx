import HomeIdentityExplanation from '@/components/solhandle/home/HomeIdentityExplanation';
import IPhoneIdentityPreview from '@/components/solhandle/home/IPhoneIdentityPreview';

export default function HomeProductVisual() {
  return <div className="home-product-visual" aria-label="Example of a SolHandle wallet identity">
    <IPhoneIdentityPreview/>
    <HomeIdentityExplanation/>
  </div>;
}