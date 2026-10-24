import NetworkSessionProvider from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkThemeProvider from '@/components/solhandle/network/NetworkThemeProvider';
import NetworkShell from '@/components/solhandle/network/NetworkShell';
import '@/components/solhandle/network/network.css';
import '@/components/solhandle/network/network-desktop.css';
import '@/components/solhandle/network/network-social.css';
import '@/components/solhandle/network/network-compact.css';
import '@/components/solhandle/network/network-structure.css';
import '@/components/solhandle/design/design-preview.css';
import '@/components/solhandle/design/hero-cinematic.css';
import '@/components/solhandle/design/network-cinematic.css';
import '@/components/solhandle/design/network-responsive.css';
import '@/components/solhandle/design/network-section-headings.css';
import '@/components/solhandle/design/network-light-contrast.css';
import '@/components/solhandle/design/network-panel-consistency.css';
import '@/components/solhandle/home/platform-live.css';
import '@/components/solhandle/network/network-preview-parity.css';
import '@/components/solhandle/network/network-profile-parity.css';
import '@/components/solhandle/design/profile-identity-preview.css';
export default function NetworkLayout() {
  return <NetworkSessionProvider><NetworkThemeProvider><NetworkShell/></NetworkThemeProvider></NetworkSessionProvider>;
}