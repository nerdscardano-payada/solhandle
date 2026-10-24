import { AlertCircle, Wallet, Fingerprint, UserRound } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
export default function ScenarioNotice() {
  const d = useDesign();
  const states = {
    nowallet: [Wallet, 'Start with your own wallet', 'Explore the network first. Connect your wallet when you want to use a handle.', 'Connect wallet', () => d.setDialog('wallet')],
    nohandle: [Fingerprint, 'Your name starts here', 'Your wallet is connected. Find your own @handle or explore the network first.', 'Find a handle', () => d.go('public')],
    nosession: [UserRound, 'Your wallet is connected, but your social account is not', 'You can view public posts. Signing in to Social is a separate step.', 'View sign-in', () => d.setDialog('session')],
    error: [AlertCircle, 'We cannot verify your handle right now', 'Your data is preserved. Payments and publishing wait for a new check.', 'Try again', () => d.setScenario('ready')]
  };
  if (!states[d.scenario]) return null;
  const [Icon,title,copy,action,run] = states[d.scenario];
  return <section className={`sd-notice ${d.scenario === 'error' ? 'sd-notice-error' : ''}`} role={d.scenario === 'error' ? 'alert' : 'status'}><Icon size={22}/><div><strong>{title}</strong><p>{copy}</p></div><button className="sd-button sd-secondary" onClick={run}>{action}</button></section>;
}