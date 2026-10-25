import { Zap, Send, Compass, Search, Fingerprint, ArrowUpRight } from 'lucide-react';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
export default function EcosystemQuickActions({ mobile = false }) {
  const d = useEcosystem();
  const actions = mobile ? [[Fingerprint, 'Claim Handle', () => d.setModal({ type: 'claim' })], [Compass, 'Discover', () => d.go('discover')], [Send, 'Pay', () => d.openPay()]] : [[Send, 'Send to a Handle', () => d.openPay()], [Compass, 'Discover Projects', () => { d.setSearch(''); d.setCategory('Projects'); d.go('discover'); }], [Search, 'Find People', () => { d.setSearch(''); d.setCategory('People'); d.go('discover'); }], [Fingerprint, 'Manage Your Handles', () => d.setModal({ type: 'handles' })]];
  return <section className={`ep-card ep-quick ${mobile ? 'ep-mobile-quick' : ''}`}><h2><Zap size={18}/>Quick Actions</h2><div>{actions.map(([Icon, label, action]) => <button key={label} onClick={action}><Icon size={19}/><span>{label}</span>{!mobile && <ArrowUpRight size={14}/>}</button>)}</div></section>;
}