import { Children, useRef } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import useMintViewport from '@/components/solhandle/handles/useMintViewport';
import '@/components/solhandle/handles/mint-review-mobile.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function MintReviewSurface({ inline, open, onOpenChange, wallet, handle, children }) {
  const { t } = useLanguage();
  const contentRef = useRef(null);
  useMintViewport(open && !inline, contentRef);
  const sections = Children.toArray(children);
  const action = sections.pop();
  const title = t('Review your Mainnet Beta claim');
  const description = t('Your wallet approves the NFT mint. If no primary name is set, this handle becomes your primary in the same transaction. You can change it later in My Handles.');
  if (inline) return <article className="rounded-2xl border border-border bg-card p-6 text-card-foreground" aria-label={title}>
    <header className="mb-5"><h2 className="font-heading text-xl font-semibold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p></header>
    <div className="space-y-5">{!wallet && <button type="button" className="ep-button ep-primary" onClick={() => window.dispatchEvent(new CustomEvent('solhandle:connect-wallet', { detail: { action: 'claim', handle } }))}>{t('Connect Wallet')}</button>}{children}</div>
  </article>;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent ref={contentRef} overlayClassName="solhandle-mint-overlay z-[70]" className="solhandle-mint-dialog z-[71] max-h-[90dvh] overflow-y-auto border-cyan-300/30 bg-slate-950 text-white sm:max-w-md" onOpenAutoFocus={event => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    event.preventDefault();
    contentRef.current?.focus({ preventScroll: true });
  }}><div className="mint-review-body"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription className="text-slate-400">{description}</DialogDescription></DialogHeader>{sections}</div><div className="mint-review-action">{action}</div></DialogContent></Dialog>;
}