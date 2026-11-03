import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
export default function AdvisorCopyBlock({ label, value }) {
 const [copied,setCopied]=useState(false),[error,setError]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(value);setError('');setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);setError('Copy is unavailable. Select the code to copy it manually.');}}
 return <div className="advisor-copy-block"><div className="advisor-copy-heading"><h4>{label}</h4><button type="button" className="ep-link advisor-copy-button" onClick={copy} aria-label={`Copy ${label}`}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy'}</button></div><pre><code>{value}</code></pre><span role="status" className="advisor-muted">{error||(copied?'Copied to clipboard.':'')}</span></div>;
}