import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function IdentityCopy({ value, label = 'Copy' }) {
  const [status, setStatus] = useState('');
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setStatus('Copied'); }
    catch { setStatus('Select the text to copy'); }
  };
  return <span className="identity-copy"><button type="button" onClick={copy} aria-label={`${label}: ${value}`} title={label}>{status === 'Copied' ? <Check size={16}/> : <Copy size={16}/>}</button><span role="status" className="identity-copy-status">{status}</span></span>;
}