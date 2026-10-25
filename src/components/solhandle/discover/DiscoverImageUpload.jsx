import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import prepareListingImage from '@/components/solhandle/discover/prepareListingImage';
export default function DiscoverImageUpload({ kind, value, disabled, busy, onBusyChange, onChange }) {
  const [error, setError] = useState('');
  const isBanner = kind === 'banner_url';
  const upload = async event => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    onBusyChange(kind); setError('');
    try { const prepared = await prepareListingImage(file, kind); const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: prepared }); if (!file_url) throw new Error('Upload failed. Please try again.'); onChange(kind, file_url); }
    catch (failure) { setError(failure.message || 'Upload failed. Please try again.'); }
    finally { onBusyChange(null); }
  };
  return <div className="discover-image-upload"><label><span>{isBanner ? 'Banner image' : 'Profile picture (PFP)'} <strong>· Required</strong></span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={upload}/><small>{isBanner ? 'Automatically center-cropped to 1500 × 500 px (3:1).' : 'Automatically center-cropped to 512 × 512 px (1:1).'} JPG, PNG or WebP, up to 8 MB.</small></label>{busy && <p role="status">Preparing and uploading image…</p>}{value && <Image src={value} alt={isBanner ? 'Uploaded banner preview' : 'Uploaded profile picture preview'} className={isBanner ? 'discover-banner' : 'discover-pfp'}/>} {error && <p role="alert" className="discover-error">{error}</p>}</div>;
}