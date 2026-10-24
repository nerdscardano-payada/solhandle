import { ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import '@/components/solhandle/design/profile-identity-preview.css';

const asset = 'HPLWHCyBv36Wf5rrrJuUyLSdAc2nGEjy3XD6SUzzZ3GB';
export default function ProfileIdentityPreview() {
  const d = useDesign();
  if (!d.handle) return <section className="sd-profile-detail"><h2>Nog geen primaire handle</h2><p>Dit voorbeeldprofiel heeft nog geen gekoppelde primaire handle. De profielfoto, bio en berichten blijven onderdeel van het sociale profiel.</p><button className="sd-button sd-secondary" onClick={() => d.setDialog('identity')}>Bekijk Identity <ArrowUpRight size={15}/></button></section>;
  return <section className="sd-profile-detail sd-profile-identity" aria-label="Primaire handle en mintgegevens">
    <h2>Jouw handle, jouw identiteit</h2>
    <p>De mintafbeelding hoort bij de handle-NFT. Je persoonlijke profielfoto staat daar los van.</p>
    <div className="sd-profile-identity-grid">
      <figure className="sd-profile-mint"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/132617bb8_image.png" alt="SolHandle mintafbeelding van @ansem" className="sd-profile-mint-image" fittingType="fit"/><figcaption>Mintafbeelding · @ansem</figcaption></figure>
      <div className="sd-profile-identity-data">
        <span className="sd-eyebrow">PRIMAIRE HANDLE · ONTWERPVOORBEELD</span>
        <h3>{d.handle}</h3>
        <dl>
          <div><dt>Eigenaar (referentie)</dt><dd>9Dd6…EGM9</dd></div>
          <div><dt>Assetadres</dt><dd><a href={`https://explorer.solana.com/address/${asset}`} target="_blank" rel="noopener noreferrer">HPLW…Z3GB <ArrowUpRight size={14}/></a></dd></div>
          <div><dt>Collectie</dt><dd>SOLHANDLE Collection</dd></div>
          <div><dt>NFT-standaard</dt><dd>Metaplex Core · Solana</dd></div>
          <div><dt>Eigendomscontrole</dt><dd>Niet live gecontroleerd</dd></div>
        </dl>
        <small>Referentiegegevens van @ansem, geen live eigendomsbewijs. De afbeelding alleen bewijst geen eigendom.</small>
        <a className="sd-button sd-secondary" href="https://solhandle.io/@ansem" target="_blank" rel="noopener noreferrer">Open openbare handlepagina <ArrowUpRight size={15}/></a>
      </div>
    </div>
    <p>Bij overdracht verhuist de handle met de NFT. Het sociale profiel, de profielfoto, berichten en gesprekken blijven bij het account.</p>
  </section>;
}