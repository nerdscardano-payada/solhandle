import { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { Image } from '@/components/ui/image';
import HandleCard from '@/components/solhandle/HandleCard';
import { readProfileAvatar } from '@/components/solhandle/profile/profileAvatarStorage';
export default function ProfileAvatar({ avatar, handle = '', className = '' }) {
  const [image, setImage] = useState(null), [failed, setFailed] = useState(false);
  const fingerprint = avatar ? JSON.stringify(avatar) : '';
  useEffect(() => {
    const controller = new AbortController(); let url;
    setImage(null); setFailed(false);
    if (avatar) readProfileAvatar(avatar, controller.signal).then(blob => {
      if (controller.signal.aborted) return;
      url = URL.createObjectURL(blob); setImage({ fingerprint, url });
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => { controller.abort(); if (url) URL.revokeObjectURL(url); };
  }, [fingerprint]);
  return <span className={`profile-avatar ${className}`}>
    {image?.fingerprint === fingerprint ? <Image src={image.url} alt={`Profile photo for @${handle.replace(/^@/, '')}`} className="h-full w-full object-cover"/> : handle ? <HandleCard handle={handle}/> : <UserRound size={42} strokeWidth={1.2}/>}
    {avatar && !image && !failed && <span className="sr-only" role="status">Loading private photo…</span>}
    {failed && <span className="sr-only" role="status">Photo unavailable; showing handle artwork.</span>}
  </span>;
}