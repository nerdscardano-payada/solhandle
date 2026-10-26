import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProfileAvatarField from '@/components/solhandle/profile/ProfileAvatarField';
import '@/components/solhandle/profile/profile-media.css';
export default function HandleProfileFields({ handle, value, setValue, busy, save }) {
  const [uploading, setUploading] = useState(false);
  return <form onSubmit={event => { event.preventDefault(); if (!uploading) save(); }}>
    <fieldset disabled={busy}>
      <ProfileAvatarField handle={handle} avatar={value.avatar} onChange={avatar => setValue(current => ({ ...current, avatar }))} disabled={busy} onBusyChange={setUploading}/>
      <label>Bio<textarea maxLength={100} value={value.bio} onChange={event => setValue({ ...value, bio: event.target.value })}/><span>{value.bio.length}/100</span></label>
      <label>Website and social links, one per line (up to 5)<textarea value={value.links} placeholder="https://x.com/yourname" onChange={event => setValue({ ...value, links: event.target.value })}/></label>
      <label className="profile-opt-in"><input type="checkbox" checked={value.published} onChange={event => setValue({ ...value, published: event.target.checked })}/>Make my bio, social links and profile photo public</label>
      <p>Private by default. Saving requires your wallet signature. Public links are provided by the owner, not verified social accounts. A new handle owner never receives your private profile.</p>
      <div className="profile-actions"><button className="ep-button ep-primary" type="submit" disabled={busy || uploading}>{busy ? 'Waiting for verification…' : 'Sign and save profile'}</button>{value.savedPublished && <><Link to={`/${handle}`}>Handle page</Link><Link to={`/profile/${handle}`}>Public profile</Link></>}</div>
    </fieldset>
  </form>;
}