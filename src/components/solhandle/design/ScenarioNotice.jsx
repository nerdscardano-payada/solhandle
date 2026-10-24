import { AlertCircle, Wallet, Fingerprint, UserRound } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
export default function ScenarioNotice() {
  const d = useDesign();
  const states = {
    nowallet: [Wallet, 'Begin met je eigen wallet', 'Bekijk het netwerk alvast. Verbind je wallet wanneer je een handle wilt gebruiken.', 'Wallet verbinden', () => d.setDialog('wallet')],
    nohandle: [Fingerprint, 'Jouw naam begint hier', 'Je wallet is verbonden. Zoek een eigen @handle of bekijk alvast het netwerk.', 'Zoek een handle', () => d.go('public')],
    nosession: [UserRound, 'Je wallet is verbonden, je sociale account nog niet', 'Openbare berichten kun je bekijken. Aanmelden voor Social is een aparte stap.', 'Bekijk aanmelden', () => d.setDialog('session')],
    error: [AlertCircle, 'We kunnen je handle nu niet controleren', 'Je gegevens blijven behouden. Betalen en publiceren wachten op een nieuwe controle.', 'Opnieuw proberen', () => d.setScenario('ready')]
  };
  if (!states[d.scenario]) return null;
  const [Icon,title,copy,action,run] = states[d.scenario];
  return <section className={`sd-notice ${d.scenario === 'error' ? 'sd-notice-error' : ''}`} role={d.scenario === 'error' ? 'alert' : 'status'}><Icon size={22}/><div><strong>{title}</strong><p>{copy}</p></div><button className="sd-button sd-secondary" onClick={run}>{action}</button></section>;
}