import { useState } from 'react';
import { Code2, MousePointer2 } from 'lucide-react';
import ResolveCodeBlock from '@/components/solhandle/resolve/ResolveCodeBlock';
import SolHandleWidget from '@/components/solhandle/widgets/SolHandleWidget';
import WidgetAffiliateSetup from '@/components/solhandle/widgets/WidgetAffiliateSetup';
import WidgetExtrasOptions from '@/components/solhandle/widgets/WidgetExtrasOptions';
import { widgetOptions, widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
import createWidgetEmbed from '@/components/solhandle/widgets/createWidgetEmbed';
export default function WidgetGallery() {
  const type = 'search';
  const [referralCode, setReferralCode] = useState('');
  const [showClaimed, setShowClaimed] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const embedHeight = 360 + (showClaimed ? 240 : 0) + (showMarket ? 240 : 0);
  const option = widgetOptions.find(item => item.id === type);
  const params = new URLSearchParams();
  if (referralCode) params.set('ref', referralCode);
  if (showClaimed) params.set('claimed', '1');
  if (showMarket) params.set('market', '1');
  const url = `${widgetOrigin}/widgets/${type}${params.size ? `?${params}` : ''}`;
  const snippet = createWidgetEmbed(url, `SolHandle ${option.title}`, embedHeight);
  return <section id="widgets" className="mt-8">

    <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-names-accent/20 bg-names-accent/5 p-4 lg:p-6"><p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-names-accent"><MousePointer2 size={15}/>Try it · real lookups, not sample results</p><SolHandleWidget type="search" referralCode={referralCode} showClaimed={showClaimed} showMarket={showMarket}/></div>
      <div className="rounded-2xl border border-border bg-card p-5 lg:p-6"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-names-secondary"><Code2 size={15}/>Make it yours</p><h3 className="mt-3 text-2xl font-semibold">A small embed. A useful addition.</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{option.benefit}</p>
        <WidgetExtrasOptions showClaimed={showClaimed} showMarket={showMarket} onClaimedChange={setShowClaimed} onMarketChange={setShowMarket}/>
        <WidgetAffiliateSetup onVerified={setReferralCode} verifiedCode={referralCode}/>
        <ol className="mt-5 space-y-3 text-sm text-muted-foreground"><li><strong className="text-foreground">1. Copy</strong> the embed below.</li><li><strong className="text-foreground">2. Paste</strong> it into your website’s HTML/embed block.</li><li><strong className="text-foreground">3. Publish</strong> your page and try the widget.</li></ol>
        <ResolveCodeBlock code={snippet} language="HTML embed · no API key"/>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">Copy the complete snippet, including the script, for automatic height adjustment. Your website must allow iframe embeds and scripts. Claims continue on SolHandle. Add your Share & Earn referral code to link eligible mints to your account.</p>
      </div>
    </div>

  </section>;
}