import { useState } from 'react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import PreviewProfileImageField from '@/components/solhandle/design/PreviewProfileImageField';
import '@/components/solhandle/design/preview-profile-editor.css';

export default function PreviewProfileEditor() {
  const d = useDesign();
  const [draft, setDraft] = useState(d.profile);
  const [error, setError] = useState('');
  const field = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  const save = event => {
    event.preventDefault();
    const links = draft.links.split('\n').map(link => link.trim()).filter(Boolean);
    if (links.length > 5 || links.some(link => { try { return new URL(link).protocol !== 'https:'; } catch { return true; } })) {
      setError('Vul maximaal vijf geldige HTTPS-links in, één per regel.');
      return;
    }
    if (draft.website) {
      try { if (!['https:', 'http:'].includes(new URL(draft.website).protocol)) throw new Error(); }
      catch { setError('Vul een geldige website in met https:// of http://.'); return; }
    }
    if (!draft.name.trim()) { setError('Vul een weergavenaam in.'); return; }
    d.setProfile({ ...draft, name: draft.name.trim(), links: links.join('\n') });
    d.setDialog(null);
  };
  return <form className="sd-profile-editor" onSubmit={save}>
    <header><span className="sd-eyebrow">JOUW SOCIALE PROFIEL · VOORBEELD</span><h2>Profiel bewerken</h2><p>Pas je profiel aan. Alleen zichtbaar in deze ontwerpsessie, niet opgeslagen op mainnet of een server. Vernieuwen wist je wijzigingen.</p></header>
    <div className="sd-edit-images"><PreviewProfileImageField label="Profielfoto (PFP)" value={draft.avatar} onChange={value => field('avatar', value)}/><PreviewProfileImageField label="Banner" banner value={draft.banner} onChange={value => field('banner', value)}/></div>
    <small>JPG, PNG of WebP · maximaal 5 MB per afbeelding · blijft lokaal in dit voorbeeld.</small>
    <label>Weergavenaam<input required maxLength={80} value={draft.name} onChange={event => field('name', event.target.value)}/></label>
    <label>Over mij / bio<textarea rows={4} maxLength={500} value={draft.bio} onChange={event => field('bio', event.target.value)}/><small>{draft.bio.length}/500</small></label>
    <label>Website<input type="url" maxLength={500} placeholder="https://" value={draft.website} onChange={event => field('website', event.target.value)}/></label>
    <label>Profieltype<select value={draft.kind} onChange={event => field('kind', event.target.value)}><option value="PERSON">Persoon</option><option value="CREATOR">Creator</option><option value="PROJECT">Project</option></select></label>
    <label>Sociale links<textarea rows={3} maxLength={2500} placeholder="https://… (één per regel, maximaal 5)" value={draft.links} onChange={event => field('links', event.target.value)}/></label>
    <small>Je @handle en NFT-mintafbeelding blijven ongewijzigd.</small>
    {error && <p role="alert">{error}</p>}
    <footer><button type="button" className="sd-button sd-secondary" onClick={() => d.setDialog(null)}>Annuleren</button><button type="submit" className="sd-button sd-gradient">Opslaan in voorbeeld</button></footer>
  </form>;
}