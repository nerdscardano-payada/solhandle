import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkWalletSetup from '@/components/solhandle/network/NetworkWalletSetup';
import NetworkWorkspace from '@/components/solhandle/network/NetworkWorkspace';
export default function NetworkOwnerView({ view = 'latest', search = '' }) {
  const session = useNetworkSession();
  return <>{session.ready ? <details className="border-b border-identity-border"><summary className="cursor-pointer p-4 text-sm text-identity-muted"><span data-no-translate className="font-semibold text-names-accent">{session.profile.handle}</span><span className="ml-3">Wallet & my handles</span><span className="ml-2 text-xs text-names-secondary">Private preview</span></summary><NetworkWalletSetup/></details> : <NetworkWalletSetup/>}{session.ready && <NetworkWorkspace key={`${session.address}:${session.actorId}:${search}`} actorId={session.actorId} initialView={view} initialSearch={search}/>}</>;
}