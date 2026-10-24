import { ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import '@/components/solhandle/design/profile-identity-preview.css';

const asset = 'HPLWHCyBv36Wf5rrrJuUyLSdAc2nGEjy3XD6SUzzZ3GB';
export default function ProfileIdentityPreview() {
  const d = useDesign();
  if (!d.handle) return <section className="sd-profile-detail"><h2>No primary handle yet</h2><p>This example profile has no linked primary handle yet. The profile picture, bio and posts remain part of the social profile.</p><button className="sd-button sd-secondary" onClick={() => d.setDialog('identity')}>View Identity <ArrowUpRight size={15}/></button></section>;
  return <section className="sd-profile-detail sd-profile-identity" aria-label="Primary handle and mint details">
    <h2>Your handle, your identity</h2>
    <p>The mint image belongs to the handle NFT. Your personal profile picture is separate.</p>
    <div className="sd-profile-identity-grid">
      <figure className="sd-profile-mint"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/132617bb8_image.png" alt="SolHandle mint image of @ansem" className="sd-profile-mint-image" fittingType="fit"/><figcaption>Mint image · @ansem</figcaption></figure>
      <div className="sd-profile-identity-data">
        <span className="sd-eyebrow">PRIMARY HANDLE · DESIGN PREVIEW</span>
        <h3>{d.handle}</h3>
        <dl>
          <div><dt>Owner (reference)</dt><dd>9Dd6…EGM9</dd></div>
          <div><dt>Asset address</dt><dd><a href={`https://explorer.solana.com/address/${asset}`} target="_blank" rel="noopener noreferrer">HPLW…Z3GB <ArrowUpRight size={14}/></a></dd></div>
          <div><dt>Collection</dt><dd>SOLHANDLE Collection</dd></div>
          <div><dt>NFT standard</dt><dd>Metaplex Core · Solana</dd></div>
          <div><dt>Ownership check</dt><dd>Not checked live</dd></div>
        </dl>
        <small>Reference details for @ansem, not live proof of ownership. The image alone does not prove ownership.</small>
        <a className="sd-button sd-secondary" href="https://solhandle.io/@ansem" target="_blank" rel="noopener noreferrer">Open public handle page <ArrowUpRight size={15}/></a>
      </div>
    </div>
    <p>When transferred, the handle moves with the NFT. The social profile, profile picture, posts and conversations stay with the account.</p>
  </section>;
}