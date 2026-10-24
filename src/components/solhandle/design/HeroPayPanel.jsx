import { Send, ArrowUpRight, BadgeCheck, ShieldCheck, Wallet } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
export default function HeroPayPanel() {
  const d = useDesign();
  return <article className="sd-visual-panel sd-visual-pay">
    <button className="sd-visual-panel-title" onClick={() => d.openPay('@friend')}><span><Wallet size={15}/></span><strong>Pay</strong><ArrowUpRight size={13}/></button>
    <div className="sd-visual-pay-tab">Versturen <span>Direct naar een naam</span></div>
    <div className="sd-visual-pay-body"><small>Stuur naar</small><button className="sd-visual-pay-recipient" onClick={() => d.openPay('@friend')}><span className="sd-visual-avatar">f</span><strong>@friend</strong><BadgeCheck size={13}/></button><small>Bedrag</small><div className="sd-visual-pay-amount"><span><span className="sd-visual-sol-mark"><i/><i/><i/></span> SOL</span><strong>0.5<small>SOL</small></strong></div><div className="sd-visual-memo">Voor die goede ideeën <span>♥</span></div><button className="sd-button sd-gradient" onClick={() => d.openPay('@friend')}><Send size={13}/> Betalen</button><span className="sd-visual-pay-trust"><ShieldCheck size={12}/> Jij bevestigt in je wallet.</span><small className="sd-visual-fineprint">Ontwerp · geen echte betaling</small></div>
  </article>;
}