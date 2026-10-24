import { MessageCircle } from 'lucide-react';
import NetworkProfileDialog from '@/components/solhandle/network/NetworkProfileDialog';

export default function NetworkProfileMessageButton() {
  return <NetworkProfileDialog title="Private messages" description="Private messaging is not available in the live Network yet. No message has been sent and no conversation is created." trigger={<button type="button" className="sd-button sd-secondary"><MessageCircle size={16}/> Message</button>}/>;
}