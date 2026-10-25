import { useEffect, useRef, useState } from 'react';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import { uploadProfileAvatar } from '@/components/solhandle/profile/profileAvatarStorage';
export default function ProfileAvatarField({ handle, avatar, onChange, disabled, onBusyChange }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const upload = async event => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    setBusy(true); onBusyChange(true); setError('');
    try { const value = await uploadProfileAvatar(file); if (active.current) onChange(value); }
    catch (failure) { if (active.current) setError(failure.message); }
    finally { if (active.current) { setBusy(false); onBusyChange(false); } }
  };
  return <div className="profile-avatar-field"><h3>Profile photo</h3><div className="profile-avatar-controls"><ProfileAvatar avatar={avatar} handle={handle}/><div><label>Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled || busy} onChange={upload}/></label>{avatar && <button type="button" className="ep-link" disabled={disabled || busy} onClick={() => onChange(null)}>Use mint artwork instead</button>}</div></div><p>JPEG, PNG or WebP, up to 5 MB. Cropped to a square and encrypted before private storage. Sign and save to apply. Publishing also shares this photo; making your profile private stops new access, but cannot erase copies already downloaded.</p>{busy && <p role="status">Encrypting and uploading photo…</p>}{error && <p role="alert">{error}</p>}</div>;
}