import NetworkSessionProvider from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkThemeProvider from '@/components/solhandle/network/NetworkThemeProvider';
import NetworkShell from '@/components/solhandle/network/NetworkShell';
import '@/components/solhandle/network/network.css';
import '@/components/solhandle/network/network-desktop.css';
import '@/components/solhandle/network/network-social.css';
import '@/components/solhandle/network/network-compact.css';
export default function NetworkLayout() {
  return <NetworkSessionProvider><NetworkThemeProvider><NetworkShell/></NetworkThemeProvider></NetworkSessionProvider>;
}