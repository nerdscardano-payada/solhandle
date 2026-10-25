import { useId, useRef, useState } from 'react';

export default function NetworkImageFilePicker({ label, onChange, disabled = false }) {
  const id = useId();
  const input = useRef(null);
  const [filename, setFilename] = useState('');
  return <div lang="en" translate="no" data-no-translate className="space-y-2">
    <label htmlFor={id} className="block text-xs font-semibold">{label}</label>
    <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} tabIndex={-1} className="hidden" onChange={event => {
      const file = event.target.files?.[0];
      if (!file) return;
      setFilename(file.name);
      onChange(event);
    }}/>
    <div className="flex min-w-0 items-center gap-3">
      <button type="button" disabled={disabled} onClick={() => input.current?.click()} aria-label={`Choose image for ${label}`} aria-describedby={`${id}-filename`} className="shrink-0 rounded-lg border border-identity-border px-3 py-2 text-xs font-semibold text-names-accent disabled:opacity-50">Choose image</button>
      <span id={`${id}-filename`} role="status" className="min-w-0 truncate text-xs text-identity-muted" title={filename || undefined}>{filename || 'No image selected'}</span>
    </div>
  </div>;
}