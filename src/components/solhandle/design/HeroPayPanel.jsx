import { Send, ArrowUpRight, BadgeCheck, ShieldCheck, Wallet } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
export default function HeroPayPanel() {
  const d = useDesign();
  return <article className="sd-visual-panel sd-visual-pay">
    <button className="sd-visual-panel-title" onClick={() => d.openPay('@friend')}><span><Wallet size={15}/></span><strong>Pay</strong><ArrowUpRight size={13}/></button>
    <div className="sd-visual-pay-tab">Send <span>Directly to a name</span></div>
    <div className="sd-visual-pay-body"><small>Send to</small><button className="sd-visual-pay-recipient" onClick={() => d.openPay('@friend')}><span className="sd-visual-avatar">f</span><strong>@friend</strong><BadgeCheck size={13}/></button><small>Amount</small><div className="sd-visual-pay-amount"><span><span className="sd-visual-sol-mark"><i/><i/><i/></span> SOL</span><strong>0.5<small>SOL</small></strong></div><div className="sd-visual-memo">For those great ideas <span>♥</span></div><button className="sd-button sd-gradient" onClick={() => d.openPay('@friend')}><Send size={13}/> Pay</button><span className="sd-visual-pay-trust"><ShieldCheck size={12}/> You confirm in your wallet.</span><small className="sd-visual-fineprint">Design preview · no real payment</small></div>
  </article>;
}