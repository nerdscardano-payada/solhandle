import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import labClient, { labError } from '@/components/solhandle/network/lab/labClient';
import sanitizeNetworkImage from '@/components/solhandle/network/lab/sanitizeNetworkImage';
import LabPrivateImage from '@/components/solhandle/network/lab/LabPrivateImage';
export default function LabImageUpload({ actorId, label, value = '', onChange, disabled = false, onBusyChange }) {
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { onBusyChange?.(busy || image?.status === 'PENDING'); }, [busy, image?.status, onBusyChange]);
  const upload = async event => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    setBusy(true); setError('');
    try {
      const processed = await sanitizeNetworkImage(file);
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file: processed.file });
      const result = await labClient({ action: 'registerMedia', actorId, fileUri: file_uri, mimeType: processed.file.type, byteSize: processed.file.size, width: processed.width, height: processed.height });
      setImage(result.media); onChange('');
    } catch (err) { setError(labError(err)); } finally { setBusy(false); }
  };
  const review = async status => {
    setBusy(true); setError('');
    try { const result = await labClient({ action: 'reviewMedia', actorId, id: image.id, status }); setImage(result.media); onChange(status === 'APPROVED' ? result.media.id : ''); }
    catch (err) { setError(labError(err)); } finally { setBusy(false); }
  };
  return <div className="space-y-3 rounded-xl border border-identity-border p-3"><label className="block text-xs font-semibold">{label}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy || disabled} className="mt-2 block w-full text-xs"/></label><p className="text-xs text-identity-muted">Private test storage. Raster images only, metadata removed, resized to at most 2048 pixels. Manual operator review is not a malware scan.</p>{busy && <p role="status" className="text-xs text-names-accent">Processing image…</p>}{image && <LabPrivateImage media={image} alt={`${label} review`} className="h-28 w-full rounded-lg"/>}{image?.status === 'PENDING' && <div className="flex gap-4 text-xs"><button type="button" disabled={busy || disabled} onClick={() => review('APPROVED')} className="text-names-accent">Approve reviewed test image</button><button type="button" disabled={busy || disabled} onClick={() => review('REJECTED')} className="text-names-warning">Reject</button></div>}{value && <div className="flex gap-4 text-xs text-names-accent"><span>Approved image selected</span><button type="button" disabled={busy || disabled} onClick={() => { setImage(null); onChange(''); }}>Remove selection</button></div>}{error && <p role="alert" className="text-xs text-names-warning">{error}</p>}</div>;
}