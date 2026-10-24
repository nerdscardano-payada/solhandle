import { ArrowRight, ShieldCheck, Search, Users } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import HeroEcosystemVisual from '@/components/solhandle/design/HeroEcosystemVisual';
import ClaimTokenNote from '@/components/solhandle/design/ClaimTokenNote';
import '@/components/solhandle/design/hero-cinematic.css';
export default function PublicHero() {
  const d = useDesign();
  const submit = e => { e.preventDefault(); d.setDialog('claim'); };
  return <section className="sd-public-hero sd-hero-cinematic">
    <Image className="sd-city sd-cinematic-city" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" alt="" aria-hidden="true" focalPointX={0.68} focalPointY={0.5}/>
    <div className="sd-cinematic-shade"/>
    <div className="sd-cinematic-copy">
      <div className="sd-eyebrow"><span className="sd-status-dot"/> YOUR SOCIAL IDENTITY ON SOLANA</div>
      <h1>Your @handle.<br/>Your <em>identity.</em><br/>Your <em>network.</em></h1>
      <p>One recognizable name for everything you do.<br/>Meet people, build your network and pay<br className="sd-cinematic-break"/> easily with @handles.</p>
      <form className="sd-cinematic-search" onSubmit={submit}>
        <label htmlFor="sd-claim">Find your @handle</label>
        <div className="sd-cinematic-search-row"><div className="sd-cinematic-input"><Search size={17}/><input id="sd-claim" placeholder="yourname" value={d.search} onChange={e => d.setSearch(e.target.value.replace(/^@/, ''))} maxLength={20} required autoComplete="off"/><span>@</span></div><button className="sd-button sd-gradient" type="submit">Search <ArrowRight size={16}/></button></div>
      </form>
      <ClaimTokenNote/>
      <div className="sd-cinematic-cta-row"><button className="sd-cinematic-explore" onClick={() => d.go('home')}><Users size={19}/> Explore Social <ArrowRight size={15}/></button><span><ShieldCheck size={14}/> Your wallet. Your ownership.</span></div>
    </div>
    <HeroEcosystemVisual/>
    <div className="sd-cinematic-caption"><span>SOCIAL <b>·</b> IDENTITY <b>·</b> PAY</span><small>One name. A world of possibilities.</small></div>
  </section>;
}