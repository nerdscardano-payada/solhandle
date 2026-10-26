import HandleCard from '@/components/solhandle/HandleCard';
import '@/components/solhandle/profile/identity-mint-tablet.css';

export default function IdentityMintTablet({ handle }) {
  return <div className="identity-mint-tablet" aria-label={`Handle artwork for @${handle} in an iPad frame`}>
    <span className="identity-mint-tablet-camera" aria-hidden="true"/>
    <div className="identity-mint-tablet-screen">
      <HandleCard handle={handle}/>
      <span className="identity-mint-tablet-home" aria-hidden="true"/>
    </div>
  </div>;
}