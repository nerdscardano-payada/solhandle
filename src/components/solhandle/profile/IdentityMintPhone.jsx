import HandleCard from '@/components/solhandle/HandleCard';
import '@/components/solhandle/profile/identity-mint-phone.css';

export default function IdentityMintPhone({ handle }) {
  return <figure className="identity-mint-phone" aria-label="Your Primary Handle mint artwork in a smartphone">
    <div className="identity-mint-phone-screen">
      <div className="identity-mint-phone-camera" aria-hidden="true"/>
      <span className="identity-eyebrow">SOLHANDLE</span>
      <HandleCard handle={handle}/>
      <figcaption>Your Primary Handle mint artwork</figcaption>
      <div className="identity-mint-phone-home" aria-hidden="true"/>
    </div>
  </figure>;
}