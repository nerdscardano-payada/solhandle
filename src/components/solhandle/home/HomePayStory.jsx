import { Link } from 'react-router-dom';
import { ArrowUpRight, QrCode, Send, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import useHomePayCopy from '@/components/solhandle/home/useHomePayCopy';

const uses = [
  { Icon: QrCode, title: 'Receive SOL', text: 'Share your @handle instead of a long wallet address.', action: 'Share your payment QR', to: '/receive' },
  { Icon: LinkIcon, title: 'Request a payment', text: 'Choose a SOL amount and share a payment link or QR code.', action: 'Create a payment link', to: '/receive' },
  { Icon: Send, title: 'Pay a contact', text: 'Send SOL to an @handle or a privately saved contact.', action: 'Open SolHandle Pay', to: '/pay' },
];
export default function HomePayStory() {
  const t = useHomePayCopy();
  return <section id="solhandle-pay" aria-labelledby="home-pay-title" className="home-content-section !py-10" data-no-translate>
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-end">
      <div><p className="text-xs font-semibold uppercase tracking-widest text-names-accent">SolHandle Pay · {t('Claim it. Then use it.')}</p><h2 id="home-pay-title" className="mt-3 font-heading text-3xl font-semibold tracking-tight lg:text-4xl">{t('Pay people, not addresses.')}</h2></div>
      <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{t('Your @handle is more than a name. Use it to receive SOL, share payment requests and become a familiar contact.')}</p>
    </div>
    <div className="mt-7 grid gap-4 lg:grid-cols-3">{uses.map(({ Icon, title, text, action, to }) => <Link key={title} to={to} className="group flex flex-col rounded-2xl border border-names-accent/20 bg-card p-6 transition-colors hover:border-names-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-names-accent">
      <Icon className="h-6 w-6 text-names-accent" aria-hidden="true"/>
      <h3 className="mt-5 text-xl font-semibold">{t(title)}</h3><p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">{t(text)}</p>
      <span className="mt-auto flex items-center justify-between gap-3 text-sm font-semibold text-names-accent">{t(action)}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></span>
    </Link>)}</div>
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-names-accent/5 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-names-accent" aria-hidden="true"/><div><p className="text-sm font-medium">{t('Your wallet stays yours. Every payment needs your approval.')}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t('SolHandle never holds your funds or private keys. Payers only need a compatible Solana wallet, not their own handle.')}</p></div></div>
  </section>;
}