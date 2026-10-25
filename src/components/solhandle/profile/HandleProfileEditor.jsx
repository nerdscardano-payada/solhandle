import { useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import HandleProfileFields from '@/components/solhandle/profile/HandleProfileFields';
import { profileMessage, signedProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import '@/components/solhandle/profile/public-profile.css';
export default function HandleProfileEditor({ initialHandle = '' }) {
  const session = useWallet(), client = useQueryClient();
  const [handle, setHandle] = useState(initialHandle.replace(/^@/, ''));
  const [value, setValue] = useState(null), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const wallet = session.publicKey?.toBase58(), latest = useRef(wallet); latest.current = wallet;
  const run = async purpose => {
    const address = wallet; setBusy(true); setError(''); setMessage('');
    try {
      const social_links = value?.links.split('\n').map(link => link.trim()).filter(Boolean) || [];
      if (social_links.length > 5) throw new Error('Add no more than five links.');
      const payload = purpose === 'save' ? { bio: value.bio, social_links, published: value.published } : {};
      const result = await signedProfileRequest(session, handle, purpose, payload);
      if (latest.current !== address) return;
      setValue({ bio: result.profile.bio, links: result.profile.social_links.join('\n'), published: result.profile.published, savedPublished: result.profile.published });
      setMessage(purpose === 'load' ? 'Ownership verified. Your profile is ready to edit.' : result.profile.published ? 'Your profile is public.' : 'Saved privately. Your public profile is hidden.');
      await client.invalidateQueries({ queryKey: ['public-handle-profile', handle] });
    } catch (failure) { if (latest.current === address) setError(profileMessage(failure)); }
    finally { if (latest.current === address) setBusy(false); }
  };
  return <section className="handle-profile-panel"><h2>Your public profile</h2><p>Publishing is optional. Only your bio and the links you choose will be shown.</p>
    {!value ? <form onSubmit={event => { event.preventDefault(); run('load'); }}><label>Owned handle<input required maxLength={21} value={handle} onChange={event => setHandle(event.target.value.trim().replace(/^@/, '').toLowerCase())} placeholder="ansem" pattern="[a-z0-9]{1,20}" disabled={busy}/></label><button className="ep-button" disabled={busy || !wallet}>{busy ? 'Verifying…' : 'Sign to unlock profile'}</button></form> : <HandleProfileFields handle={handle} value={value} setValue={setValue} busy={busy} save={() => run('save')}/>}
    {error && <div role="alert">{error}</div>}{message && <div role="status">{message}</div>}
  </section>;
}