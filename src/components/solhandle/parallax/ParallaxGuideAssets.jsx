import { useState } from 'react';
import { Download, Link as LinkIcon } from 'lucide-react';
import sdk from '@/lib/solhandle-sdk/index.js?raw';
import errors from '@/lib/solhandle-sdk/errors.js?raw';
import license from '@/lib/solhandle-sdk/LICENSE?raw';
import { guideSections } from '@/components/solhandle/parallax/parallaxGuide';

export default function ParallaxGuideAssets() {
  const [notice, setNotice] = useState('');
  const download = (name, content, type) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a'); link.href = url; link.download = name; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const downloadSdk = () => {
    const source = sdk.replace('import { ERROR_CODES, SolHandleError } from "./errors.js";', '').replace('export { ERROR_CODES, SolHandleError };', '');
    download('solhandle-sdk.mjs', '/*\n' + license + '\n*/\n' + errors + '\n' + source, 'text/javascript;charset=utf-8');
  };
  const downloadGuide = () => download('solhandle-parallax-integration.md', '# SolHandle × Parallax\n\nProject Passport integration guide\n\n' + guideSections.map(section => '## ' + section.title + '\n\n' + section.text + '\n\n' + (section.code ? '```\n' + section.code + '\n```\n\n' : '') + section.bullets.map(text => '- ' + text).join('\n')).join('\n\n'), 'text/markdown;charset=utf-8');
  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.origin + '/integrations/parallax'); setNotice('Guide link copied.'); }
    catch { setNotice('Copy the guide URL from your browser address bar.'); }
  };
  return <div className="mt-7"><div className="flex flex-wrap gap-3">
    <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl border border-names-accent/40 px-4 py-3 text-sm text-names-accent"><LinkIcon size={16}/>Copy guide link</button>
    <button onClick={downloadSdk} className="inline-flex items-center gap-2 rounded-xl bg-names-accent px-4 py-3 text-sm font-semibold text-primary-foreground"><Download size={16}/>Download SDK (.mjs)</button>
    <button onClick={downloadGuide} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm"><Download size={16}/>Download guide (.md)</button>
  </div><p role="status" className="mt-3 text-sm text-names-accent">{notice}</p></div>;
}