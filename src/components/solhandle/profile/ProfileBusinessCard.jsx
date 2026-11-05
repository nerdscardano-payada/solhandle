import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import ProfileLinkActions, { publicIdentityUrl } from '@/components/solhandle/profile/ProfileLinkActions';
import downloadIdentityCard from '@/components/solhandle/profile/downloadIdentityCard';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import '@/components/solhandle/profile/profile-business-card.css';
export default function ProfileBusinessCard({ profile }) {
 const surface = useRef(null), url = publicIdentityUrl(profile.handle);
 const [qr, setQr] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
 const query = useQuery({ queryKey: ['identity-business-card', profile.handle], queryFn: async () => {
  const { data } = await base44.functions.invoke('getHandleIdentity', { handle: profile.handle });
  if (data.error || !data.verified) throw new Error('Current ownership could not be verified.');
  return data;
 }, retry: false, staleTime: 0 });
 useEffect(() => {
  let active = true;
  QRCode.toDataURL(url, { width: 360, margin: 4, errorCorrectionLevel: 'M' }).then(value => { if (active) setQr(value); }).catch(() => { if (active) setError('QR code could not be created.'); });
  return () => { active = false; };
 }, [url]);
 async function download() {
  setBusy(true); setError('');
  try {
   const [current, published] = await Promise.all([query.refetch(), publicProfileRequest({ action: 'public', handle: profile.handle })]);
   if (!published.profile || JSON.stringify(published.profile) !== JSON.stringify(profile)) throw new Error('This public profile changed or is no longer available. Refresh the page before downloading.');
   if (current.isError || !current.data?.image) throw new Error('Verified NFT artwork is unavailable. Please retry later.');
   await downloadIdentityCard({ profile, identity: current.data, url, qr, surface: surface.current });
  } catch (failure) { setError(failure.message || 'Card download failed. Please retry.'); }
  finally { setBusy(false); }
 }
 return <section ref={surface} className="identity-business-section" aria-label="Shareable SolHandle identity card">
  <div className="identity-business-card"><p className="identity-business-eyebrow">SOLHANDLE / DIGITAL IDENTITY</p><div className="identity-business-grid">
   <div className="identity-business-art">{query.data?.image && !query.isError ? <Image src={query.data.image} alt={`Actual minted NFT artwork for @${profile.handle}`} fittingType="fit" className="h-full w-full"/> : <div role="status">{query.isPending ? 'Loading minted NFT artwork…' : 'Verified NFT artwork unavailable.'}{!query.isPending && <button type="button" className="ep-link" onClick={() => query.refetch()}>Retry</button>}</div>}</div>
   <div className="identity-business-person"><ProfileAvatar avatar={profile.avatar} handle={profile.handle} mintFallback={false}/><h2>@{profile.handle}</h2>{profile.bio && <p>{profile.bio}</p>}<p className="identity-business-tagline">Connect with me on Solana.</p><div className="identity-business-qr">{qr && <Image src={qr} alt={`QR code opening the public profile for @${profile.handle}`} className="h-28 w-28" fittingType="fit"/>}<p>Scan to view profile<br/><span>Add contact or pay</span></p></div></div>
  </div><p className="identity-business-footnote">{query.data && !query.isError ? `Ownership checked ${new Date(query.data.checkedAt).toLocaleString()}.` : 'Ownership check pending or unavailable.'} Not personal identity verification. Scan for current details.</p></div>
  <ProfileLinkActions handle={profile.handle}/>
  <button type="button" className="ep-button" onClick={download} disabled={busy || !qr || !query.data?.image || query.isError}><Download size={16}/>{busy ? 'Preparing image…' : 'Download identity card'}</button>
  {error && <p role="alert">{error}</p>}
 </section>;
}