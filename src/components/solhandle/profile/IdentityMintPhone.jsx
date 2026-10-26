import HandleCard from '@/components/solhandle/HandleCard';
import '@/components/solhandle/profile/identity-mint-phone.css';

export default function IdentityMintPhone({ handle, caption = 'Your Primary Handle mint artwork' }) {
  return <figure className="identity-mint-phone" aria-label={`${caption} in a smartphone`}>
    <div className="identity-mint-phone-screen">
      <div className="identity-mint-phone-camera" aria-hidden="true"/>
      <span className="identity-eyebrow">SOLHANDLE</span>
      <HandleCard handle={handle}/>
      <figcaption>{caption}</figcaption>
      <div className="identity-mint-phone-home" aria-hidden="true"/>
    </div>
  </figure>;
}