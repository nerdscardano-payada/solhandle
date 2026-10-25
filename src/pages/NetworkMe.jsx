import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkOwnProfile from '@/components/solhandle/network/NetworkOwnProfile';
import NetworkGuestProfile from '@/components/solhandle/network/NetworkGuestProfile';
import NetworkAccountDialog from '@/components/solhandle/network/NetworkAccountDialog';
export default function NetworkMe() {
  const session = useNetworkSession();
  return <>{session?.operator ? <NetworkOwnProfile/> : <NetworkGuestProfile/>}<NetworkAccountDialog/></>;
}