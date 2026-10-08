import RotatingHomeNames from '@/components/solhandle/home/RotatingHomeNames';
import IPhoneIdentityPreview from '@/components/solhandle/home/IPhoneIdentityPreview';

export default function HomeProductVisual() {
  return <div className="home-product-visual" aria-label="Example of a SolHandle wallet identity">
    <IPhoneIdentityPreview/>
    <div className="home-floating-names"><h2 className="text-xl font-semibold">Find your handle</h2><p className="mt-1 text-xs text-foreground/60">Live names</p><RotatingHomeNames/></div>
  </div>;
}