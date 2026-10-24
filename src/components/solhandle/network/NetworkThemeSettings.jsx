import { Sun, Moon, Monitor } from 'lucide-react';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
const options = [[Sun, 'light', 'Light'], [Moon, 'dark', 'Dark'], [Monitor, 'system', 'Systeem']];
export default function NetworkThemeSettings() {
  const { preference, setPreference } = useNetworkTheme();
  return <section id="appearance" className="social-section border-t border-identity-border"><h2>Weergave</h2><p className="mb-4 text-sm text-identity-muted">Kies wat prettig leest. Systeem volgt automatisch de instelling van je apparaat.</p><div role="group" aria-label="Kleurmodus" className="flex flex-wrap gap-2">{options.map(([Icon, value, label]) => <button key={value} type="button" aria-pressed={preference === value} onClick={() => setPreference(value)} className={`social-action ${preference === value ? 'bg-names-accent/10 text-names-accent' : 'text-identity-muted'}`}><Icon className="h-4 w-4"/>{label}</button>)}</div></section>;
}