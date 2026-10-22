import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export default function NetworkExternalLink({ href, children }) {
  const [open, setOpen] = useState(false);
  let url;
  try { url = new URL(href); } catch { return <span className="break-all text-identity-muted">{children || href}</span>; }
  if (url.protocol !== 'https:' || url.username || url.password) return <span className="break-all text-identity-muted">Unsupported external link</span>;
  return <><button type="button" onClick={() => setOpen(true)} className="max-w-full break-all text-left text-sm text-names-accent underline">{children || url.hostname} ↗</button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="dark border-identity-border bg-hero-canvas text-identity-text"><DialogHeader><DialogTitle>External website</DialogTitle><DialogDescription className="text-identity-muted">This destination is not verified or endorsed. Never share recovery phrases or sign unexpected transactions.</DialogDescription></DialogHeader><p className="break-all text-xs">{url.href}</p><a href={url.href} target="_blank" rel="noopener noreferrer nofollow ugc" onClick={() => setOpen(false)} className="text-names-accent underline">Continue to external website</a></DialogContent></Dialog></>;
}