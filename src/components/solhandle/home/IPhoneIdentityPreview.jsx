import { Send, Link as LinkIcon, Layers, Signal, Wifi, BatteryFull } from 'lucide-react';

import HandleCard from '@/components/solhandle/HandleCard';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function IPhoneIdentityPreview({ handle }) {
  const name = handle || 'ansem';
  const { t } = useLanguage();
  return <div className="home-phone home-iphone">
    <span className="home-iphone-side home-iphone-action" aria-hidden="true"/>
    <span className="home-iphone-side home-iphone-volume" aria-hidden="true"/>
    <span className="home-iphone-side home-iphone-power" aria-hidden="true"/>
    <div className="home-iphone-screen">
      <div className="home-iphone-status" aria-hidden="true"><span>9:41</span><div><Signal/><Wifi/><BatteryFull/></div></div>
      <div className="home-iphone-island mx-auto mb-8 h-5 w-24 rounded-full bg-hero-canvas" aria-hidden="true"><span/></div>
      <div className="home-iphone-content">
        <div className="text-center"><div className="home-iphone-artwork mx-auto aspect-square w-full overflow-hidden rounded-2xl"><HandleCard key={name} handle={name}/></div><b className="mt-3 block break-all text-3xl tracking-tight">{`@${name}`}</b><span className="mt-2 block text-sm text-foreground/65">{t('On Solana')}</span></div>
        <div className="mt-8 space-y-3">{[[Send, 'Receive payments'], [LinkIcon, 'Share your handle'], [Layers, 'Supported integrations']].map(([Icon, text]) => <div key={text} className="!m-0 flex items-center gap-3 rounded-xl border border-names-accent/15 bg-names-accent/5 p-3 text-sm"><Icon className="h-5 w-5 shrink-0 text-names-accent"/><span className="flex min-h-[2.8em] items-center justify-center">{t(text)}</span></div>)}</div>
        <p className="mt-8 text-center text-xs text-foreground/60"><>7xA9...N5aP → <span className="break-all font-mono text-names-accent">@{name}</span></></p>
        <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-foreground/40">{t('Example identity · Preview only')}</p>
      </div>
      <span className="home-iphone-home" aria-hidden="true"/>
    </div>
  </div>;
}