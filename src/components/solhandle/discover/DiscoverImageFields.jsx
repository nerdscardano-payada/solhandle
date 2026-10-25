import { useState } from 'react';
import DiscoverImageUpload from '@/components/solhandle/discover/DiscoverImageUpload';
export default function DiscoverImageFields({ values, onChange, onBusyChange }) {
  const [busy, setBusy] = useState(null);
  const changeBusy = value => { setBusy(value); onBusyChange(!!value); };
  return <section className="discover-image-fields"><h3>Listing images</h3><p className="ep-small">Both images are required. The previews show the final crop. Uploaded images are publicly accessible by URL, even before approval. Only upload images you have permission to publish.</p>{['pfp_url','banner_url'].map(kind => <DiscoverImageUpload key={kind} kind={kind} value={values[kind]} disabled={!!busy} busy={busy === kind} onBusyChange={changeBusy} onChange={onChange}/>)}</section>;
}