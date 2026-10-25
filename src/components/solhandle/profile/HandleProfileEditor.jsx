import { useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import HandleProfileFields from '@/components/solhandle/profile/HandleProfileFields';
import { profileMessage, signedProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import '@/components/solhandle/profile/public-profile.css';
export default function HandleProfileEditor({ initialHandle = '', onProfileChange }) {
  const session = useWallet(), client = useQueryClient();
  const [handle, setHandle] = useState(initialHandle.replace(/^@/, ''));
  const [value, setValue] = useState({ bio: '', links: '', avatar: null, published: false, savedPublished: false }), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const wallet = session.publicKey?.toBase58(), latest = useRef(wallet); latest.current = wallet;
  const run = async purpose => {
    const address = wallet; setBusy(true); setError(''); setMessage('');
    try {
      if (!/^[a-z0-9]{1,20}$/.test(handle)) throw new Error('Enter your owned handle, using 1–20 letters or numbers.');
      const social_links = value?.links.split('\n').map(link => link.trim()).filter(Boolean) || [];
      if (social_links.length > 5) throw new Error('Add no more than five links.');
      const payload = purpose === 'save' ? { bio: value.bio, social_links, published: value.published, avatar: value.avatar || null } : {};
      const result = await signedProfileRequest(session, handle, purpose, payload);
      if (latest.current !== address) return;
      setValue({ bio: result.profile.bio, links: result.profile.social_links.join('\n'), avatar: result.profile.avatar || null, published: result.profile.published, savedPublished: result.profile.published });
      onProfileChange?.(handle, result.profile);
      setMessage(purpose === 'load' ? 'Ownership verified. Your profile is ready to edit.' : result.profile.published ? 'Your profile is public.' : 'Saved privately. Your public profile is hidden.');
      await client.invalidateQueries({ queryKey: ['public-handle-profile', handle] });
    } catch (failure) { if (latest.current === address) setError(profileMessage(failure)); }
    finally { if (latest.current === address) setBusy(false); }
  };
  return <section className="handle-profile-panel"><h2>Your public profile</h2><p>Give your handle a personal profile. You can fill in everything below before signing. Nothing is saved or published until you choose “Sign and save profile”.</p>
    <ol><li><strong>Choose your handle.</strong> Use a SolHandle owned by your connected wallet.</li><li><strong>Make it yours.</strong> Add a profile photo, write a short bio and paste up to five website or social links, one per line.</li><li><strong>Choose your visibility.</strong> Leave the public checkbox off to save privately, or turn it on to share your bio, links and photo on your public profile.</li><li><strong>Sign to save.</strong> Your wallet will ask you to sign a message to verify ownership and approve these changes. This does not transfer your handle or send a payment.</li></ol>
    <label>Owned handle<input required maxLength={21} value={handle} onChange={event => { setHandle(event.target.value.trim().replace(/^@/, '').toLowerCase()); setValue({ bio: '', links: '', avatar: null, published: false, savedPublished: false }); setMessage(''); setError(''); }} placeholder="ansem" pattern="[a-z0-9]{1,20}" disabled={busy}/></label>
    <p>Already saved a profile? Load it before editing so you keep your existing details. Loading requires a signature because saved details may be private. Loading replaces the draft below; saving without loading replaces the saved profile with this draft.</p><button type="button" className="ep-button" disabled={busy || !wallet || !handle} onClick={() => run('load')}>{busy ? 'Verifying…' : 'Sign to load existing profile'}</button>
    <HandleProfileFields handle={handle} value={value} setValue={setValue} busy={busy} save={() => run('save')}/>
    {error && <div role="alert">{error}</div>}{message && <div role="status">{message}</div>}
  </section>;
}