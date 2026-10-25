import { Link } from 'react-router-dom';
export default function HandleProfileFields({ handle, value, setValue, busy, save }) {
  return <form onSubmit={event => { event.preventDefault(); save(); }}>
    <fieldset disabled={busy}>
      <label>Bio<textarea maxLength={500} value={value.bio} onChange={event => setValue({ ...value, bio: event.target.value })}/><span>{value.bio.length}/500</span></label>
      <label>Website and social links, one per line (up to 5)<textarea value={value.links} placeholder="https://x.com/yourname" onChange={event => setValue({ ...value, links: event.target.value })}/></label>
      <label className="profile-opt-in"><input type="checkbox" checked={value.published} onChange={event => setValue({ ...value, published: event.target.checked })}/>Make my bio and social links public</label>
      <p>Private by default. Saving requires your wallet signature. Public links are provided by the owner, not verified social accounts. A new handle owner never receives your private profile.</p>
      <div className="profile-actions"><button className="ep-button ep-button-primary" type="submit">{busy ? 'Waiting for verification…' : 'Sign and save profile'}</button>{value.savedPublished && <><Link to={`/${handle}`}>Handle page</Link><Link to={`/profile/${handle}`}>Public profile</Link></>}</div>
    </fieldset>
  </form>;
}