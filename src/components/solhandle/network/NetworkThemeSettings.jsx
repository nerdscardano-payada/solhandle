import { Sun, Moon, Monitor } from 'lucide-react';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
const options = [[Sun, 'light', 'Light'], [Moon, 'dark', 'Dark'], [Monitor, 'system', 'System']];
export default function NetworkThemeSettings() {
  const { preference, setPreference } = useNetworkTheme();
  return <section id="appearance" className="social-section border-t border-identity-border"><h2>Appearance</h2><p className="mb-4 text-sm text-identity-muted">Choose what feels comfortable to read. System follows your device’s appearance setting.</p><div role="group" aria-label="Color mode" className="flex flex-wrap gap-2">{options.map(([Icon, value, label]) => <button key={value} type="button" aria-pressed={preference === value} onClick={() => setPreference(value)} className={`social-action ${preference === value ? 'bg-names-accent/10 text-names-accent' : 'text-identity-muted'}`}><Icon className="h-4 w-4"/>{label}</button>)}</div></section>;
}