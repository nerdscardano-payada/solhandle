import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Check, Copy, Download, Share2 } from 'lucide-react';
export default function PaymentLinkShare({ handle, requestId }) {
  const { t } = useLanguage();
  const [qr, setQr] = useState(''), [copied, setCopied] = useState(false), [error, setError] = useState('');
  const url = `${window.location.origin}/pay?request=@${handle}&link=${encodeURIComponent(requestId)}`;
  useEffect(() => { let active = true; setQr(''); setCopied(false); setError(''); QRCode.toDataURL(url, { width: 320, margin: 2 }).then(value => { if (active) setQr(value); }).catch(() => { if (active) setError('Could not create QR code.'); }); return () => { active = false; }; }, [url]);
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setError(''); } catch { setError('Could not copy the link.'); } };
  const share = async () => { try { if (navigator.share) await navigator.share({ title: t('Pay @{0}').replace('{0}', handle), url }); else await copy(); } catch (e) { if (e.name !== 'AbortError') setError('Could not share. Copy the link instead.'); } };
  const download = () => { const a = document.createElement('a'); a.href = qr; a.download = `solhandle-pay-${handle}.png`; a.click(); };
  return <div className="mt-4 space-y-3"><a href={url} className="block break-all rounded-xl border border-names-accent/25 bg-names-accent/5 p-3 font-mono text-xs text-names-accent">{url}</a><div className="flex flex-wrap gap-2"><button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg border border-names-accent/40 px-3 py-2 text-sm text-names-accent">{copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}{copied ? 'Copied' : 'Copy link'}</button><button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><Share2 className="h-4 w-4"/>Share</button></div>{qr ? <div className="flex flex-wrap items-center gap-4"><img src={qr} alt={`Payment QR code for @${handle}`} className="h-40 w-40 rounded-xl"/><button type="button" onClick={download} className="inline-flex items-center gap-2 text-sm text-names-accent"><Download className="h-4 w-4"/>Download PNG</button></div> : !error && <p role="status" className="text-xs text-muted-foreground">Creating QR code…</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}