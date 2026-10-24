import { useEffect, useRef } from 'react';
import { X, Fingerprint, ArrowRight, Wallet, ShieldCheck } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import PayPreview from '@/components/solhandle/design/PayPreview';
import PreviewProfileEditor from '@/components/solhandle/design/PreviewProfileEditor';
export default function PreviewDialog() {
  const d = useDesign();
  const ref = useRef(null);
  useEffect(() => { if (d.dialog && ref.current) ref.current.showModal(); }, [d.dialog]);
  if (!d.dialog) return null;
  const content = {
    reply: ['Reply to a post', 'Replies belong to the public timeline, not private conversations. In the final design, this opens the post thread with a reply field.', 'Back to the timeline', null],
    identity: ['Your Identity', 'Manage your social profile and NFT handles from the same account entry point, with separate permissions.', 'My handles', 'Edit social profile'],
    wallet: ['Your own wallet. Your control.', 'This is a visual wallet step. No real wallet is opened or connected.', 'View connected state', null],
    session: ['One name. Your own social account.', 'A connected wallet is not a social sign-in. Public wallet sign-in must be securely developed before this flow goes live.', 'View signed-in state', null],
    claim: [`Your name: @${d.search || 'ansem'}`, 'This shows the claim experience, not actual availability or pricing. The existing claim feature remains unchanged.', 'View Identity', 'Explore Network'],
    token: ['$HANDLE. Our ecosystem token.', 'Your @handle is your unique identity as an NFT. $HANDLE is our separate, fungible token within SolHandle. Holding tokens does not give you ownership of an @handle and is not proof of identity or trust.', 'Back to the ecosystem', null],
    developers: ['Build with SolHandle', 'The existing SDK, resolver and integration guides remain the foundation. This concept does not build a second infrastructure.', 'Back to the design', null],
    share: ['Share your profile', 'A public @handle URL requires a current, verified social binding. This prototype does not create a real profile binding.', 'Got it', null]
  };
  const item = content[d.dialog];
  const primary = () => { if (['wallet','session'].includes(d.dialog)) { d.setScenario('ready'); d.setDialog(null); } else if (d.dialog === 'claim') d.setDialog('identity'); else if (d.dialog === 'identity') d.setDialog('handles'); else d.setDialog(null); };
  return <dialog ref={ref} className="sd-dialog" aria-label="Design detail" onCancel={() => d.setDialog(null)} onClick={e => { if (e.target === ref.current) d.setDialog(null); }}><button className="sd-dialog-close sd-icon-button" aria-label="Close" onClick={() => d.setDialog(null)}><X size={20}/></button>{d.dialog === 'edit-profile' ? <PreviewProfileEditor/> : d.dialog === 'pay' ? <PayPreview/> : d.dialog === 'handles' ? <div className="sd-dialog-body"><span className="sd-dialog-symbol"><Fingerprint size={32}/></span><span className="sd-eyebrow">IDENTITY / PREVIEW</span><h2>My handles</h2><div className="sd-owned-handle"><strong>{d.handle || 'No handle yet'}</strong><span className="sd-tiny-pill">{d.handle ? 'Primary · example' : 'Claim your first name'}</span></div><p>Selling a handle never transfers your social account, posts or messages.</p><button className="sd-button sd-gradient" onClick={() => d.go('public')}>Find a handle <ArrowRight size={16}/></button></div> : <div className="sd-dialog-body"><span className="sd-dialog-symbol">{d.dialog === 'wallet' ? <Wallet size={32}/> : <Fingerprint size={32}/>}</span><span className="sd-eyebrow">SOLHANDLE / DESIGN PREVIEW</span><h2>{item?.[0]}</h2><p>{item?.[1]}</p>{d.dialog === 'identity' && <div className="sd-owned-handle"><strong>{d.handle || 'No handle yet'}</strong><span className="sd-tiny-pill">Primary · example</span></div>}<button className="sd-button sd-gradient" onClick={primary}>{item?.[2]} <ArrowRight size={16}/></button>{item?.[3] && <button className="sd-button sd-secondary" onClick={() => d.dialog === 'identity' ? (d.go('profile'), d.setDialog('edit-profile')) : d.go('home')}>{item[3]}</button>}<small className="sd-dialog-note"><ShieldCheck size={14}/> Design only; existing features remain unchanged.</small></div>}</dialog>;
}