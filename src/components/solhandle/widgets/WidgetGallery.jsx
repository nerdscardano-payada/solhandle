import { useState } from 'react';
import { Check, Code2, MousePointer2 } from 'lucide-react';
import AttoAvatar from '@/components/solhandle/AttoAvatar';
import ResolveCodeBlock from '@/components/solhandle/resolve/ResolveCodeBlock';
import SolHandleWidget from '@/components/solhandle/widgets/SolHandleWidget';
import { widgetOptions, widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
export default function WidgetGallery() {
  const [type, setType] = useState('search');
  const [wallet, setWallet] = useState('');
  const option = widgetOptions.find(item => item.id === type);
  const validWallet = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet.trim());
  const url = `${widgetOrigin}/widgets/${type}${type === 'identity' && validWallet ? `?wallet=${encodeURIComponent(wallet.trim())}` : ''}`;
  const snippet = `<iframe\n  src="${url}"\n  title="SolHandle ${option.title}"\n  width="100%" height="620"\n  style="border:0; border-radius:16px; max-width:480px;"\n  loading="lazy"\n  referrerpolicy="strict-origin-when-cross-origin"\n></iframe>`;
  return <section id="widgets" className="mt-8">
    <div className="flex items-center gap-4 rounded-2xl border border-names-secondary/25 bg-names-secondary/5 p-5"><AttoAvatar className="h-14 w-14"/><p className="text-sm leading-6"><strong className="text-names-secondary">Atto’s shortcut:</strong> Choose a widget, try it here, then copy one embed. We handle the interface and lookups. You choose where it lives.</p></div>
    <div className="mt-6 grid gap-3 lg:grid-cols-3">{widgetOptions.map(item => <button key={item.id} type="button" onClick={() => setType(item.id)} aria-pressed={type === item.id} className={`rounded-2xl border p-5 text-left ${type === item.id ? 'border-names-accent bg-names-accent/5' : 'border-border bg-card'}`}><span className="text-xs font-semibold uppercase tracking-wider text-names-secondary">{item.label}</span><span className="mt-3 block text-xl font-semibold">{item.title}</span><span className="mt-2 block text-sm leading-6 text-muted-foreground">{item.description}</span>{type === item.id && <span className="mt-4 flex items-center gap-2 text-xs text-names-accent"><Check size={14}/>Selected</span>}</button>)}</div>
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-names-accent/20 bg-names-accent/5 p-4 lg:p-6"><p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-names-accent"><MousePointer2 size={15}/>Try it · real lookups, not sample results</p><SolHandleWidget key={`${type}-${validWallet ? wallet.trim() : ''}`} type={type} wallet={type === 'identity' && validWallet ? wallet.trim() : ''}/></div>
      <div className="rounded-2xl border border-border bg-card p-5 lg:p-6"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-names-secondary"><Code2 size={15}/>Make it yours</p><h3 className="mt-3 text-2xl font-semibold">A small embed. A useful addition.</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{option.benefit}</p>
        {type === 'identity' && <label className="mt-4 block text-sm">Wallet for your card<input value={wallet} onChange={event => setWallet(event.target.value)} placeholder="Paste the wallet to display" spellCheck={false} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm"/><span className="mt-2 block text-xs leading-5 text-muted-foreground">Use a fixed wallet, or have your developer pass a member’s wallet. A name must be set on SolHandle, not on your website.</span></label>}
        <ol className="mt-5 space-y-3 text-sm text-muted-foreground"><li><strong className="text-foreground">1. Copy</strong> the embed below.</li><li><strong className="text-foreground">2. Paste</strong> it into your website’s HTML/embed block.</li><li><strong className="text-foreground">3. Publish</strong> your page and try the widget.</li></ol>
        {type !== 'identity' || validWallet ? <ResolveCodeBlock code={snippet} language="HTML embed · no API key"/> : <p className="mt-4 text-sm text-names-warning">Enter a valid wallet above to generate your identity-card embed.</p>}
        <p className="mt-4 text-xs leading-6 text-muted-foreground">Your website must allow iframe embeds. These widgets do not sign members in, replace existing member labels, or send payments. No partner commissions are attached.</p>
      </div>
    </div>
    <details className="mt-5 rounded-xl border border-border p-4"><summary className="cursor-pointer text-sm text-names-accent">Publishing & embedding requirements</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">Widget routes become available on solhandle.io after this app is published. The SolHandle owner must allow embedding for partner websites in the app’s Security settings. If an embed is blocked, check those permissions and your website’s embed restrictions.</p></details>
  </section>;
}