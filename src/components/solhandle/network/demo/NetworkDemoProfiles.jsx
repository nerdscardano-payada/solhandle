import NetworkDemoProfile from '@/components/solhandle/network/demo/NetworkDemoProfile';
import { demoProfilesFor } from '@/components/solhandle/network/demo/networkDemoData';
export default function NetworkDemoProfiles({ q = '' }) {
  const profiles = demoProfilesFor(q);
  if (!profiles.length) return null;
  return <section aria-label="Voorbeeldprofielen" className="mb-6"><p className="mb-4 text-xs leading-relaxed text-identity-muted"><span className="font-semibold text-names-accent">Demo</span> · Ontmoet zes fictieve makers, developers en projecten. Tik op een profiel om rond te kijken; deze handles zijn niet aan wallets gekoppeld.</p><div className="network-discover-grid">{profiles.map(profile => <NetworkDemoProfile key={profile.id} profile={profile}/>)}</div></section>;
}