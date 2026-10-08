import { Send, Link as LinkIcon, Layers, Signal, Wifi, BatteryFull } from 'lucide-react';
import { Image } from '@/components/ui/image';
import HandleCard from '@/components/solhandle/HandleCard';

export default function IPhoneIdentityPreview({ handle }) {
  const name = handle || 'yourname';
  return <div className="home-phone home-iphone">
    <span className="home-iphone-side home-iphone-action" aria-hidden="true"/>
    <span className="home-iphone-side home-iphone-volume" aria-hidden="true"/>
    <span className="home-iphone-side home-iphone-power" aria-hidden="true"/>
    <div className="home-iphone-screen">
      <div className="home-iphone-status" aria-hidden="true"><span>9:41</span><div><Signal/><Wifi/><BatteryFull/></div></div>
      <div className="home-iphone-island mx-auto mb-8 h-5 w-24 rounded-full bg-hero-canvas" aria-hidden="true"><span/></div>
      <div className="home-iphone-content">
        <div className="text-center">{handle ? <div className="mx-auto w-full"><HandleCard handle={handle}/></div> : <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle logo" className="home-phone-logo mx-auto h-28 w-28 mix-blend-screen" fittingType="fit"/>}<b className="mt-3 block break-all text-3xl tracking-tight">@{name}</b><span className="mt-2 block text-sm text-foreground/65">On Solana</span></div>
        <div className="mt-8 space-y-3">{[[Send, 'Receive payments'], [LinkIcon, 'Share your handle'], [Layers, 'Use across apps']].map(([Icon, text]) => <div key={text} className="flex items-center gap-3 rounded-xl border border-names-accent/15 bg-names-accent/5 p-3 text-sm"><Icon className="h-5 w-5 text-names-accent"/>{text}</div>)}</div>
        <p className="mt-8 text-center font-mono text-xs text-foreground/60">7xA9...Kp82 → <span className="break-all text-names-accent">@{name}</span></p>
        <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-foreground/40">Identity preview</p>
      </div>
      <span className="home-iphone-home" aria-hidden="true"/>
    </div>
  </div>;
}