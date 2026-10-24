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
      setError('Enter up to five valid HTTPS links, one per line.');
      return;
    }
    if (draft.website) {
      try { if (!['https:', 'http:'].includes(new URL(draft.website).protocol)) throw new Error(); }
      catch { setError('Enter a valid website starting with https:// or http://.'); return; }
    }
    if (!draft.name.trim()) { setError('Enter a display name.'); return; }
    d.setProfile({ ...draft, name: draft.name.trim(), links: links.join('\n') });
    d.setDialog(null);
  };
  return <form className="sd-profile-editor" onSubmit={save}>
    <header><span className="sd-eyebrow">YOUR SOCIAL PROFILE · PREVIEW</span><h2>Edit profile</h2><p>Customize your profile. Only visible in this design session, not saved on mainnet or a server. Refreshing clears your changes.</p></header>
    <div className="sd-edit-images"><PreviewProfileImageField label="Profile picture (PFP)" value={draft.avatar} onChange={value => field('avatar', value)}/><PreviewProfileImageField label="Banner" banner value={draft.banner} onChange={value => field('banner', value)}/></div>
    <small>JPG, PNG or WebP · up to 5 MB per image · stays local to this preview.</small>
    <label>Display name<input required maxLength={80} value={draft.name} onChange={event => field('name', event.target.value)}/></label>
    <label>About me / bio<textarea rows={4} maxLength={500} value={draft.bio} onChange={event => field('bio', event.target.value)}/><small>{draft.bio.length}/500</small></label>
    <label>Website<input type="url" maxLength={500} placeholder="https://" value={draft.website} onChange={event => field('website', event.target.value)}/></label>
    <label>Profile type<select value={draft.kind} onChange={event => field('kind', event.target.value)}><option value="PERSON">Person</option><option value="CREATOR">Creator</option><option value="PROJECT">Project</option></select></label>
    <label>Social links<textarea rows={3} maxLength={2500} placeholder="https://… (one per line, up to 5)" value={draft.links} onChange={event => field('links', event.target.value)}/></label>
    <small>Your @handle and NFT mint image remain unchanged.</small>
    {error && <p role="alert">{error}</p>}
    <footer><button type="button" className="sd-button sd-secondary" onClick={() => d.setDialog(null)}>Cancel</button><button type="submit" className="sd-button sd-gradient">Save in preview</button></footer>
  </form>;
}