import { ChevronDown, Coins } from 'lucide-react';
import ClaimTokenNote from '@/components/solhandle/design/ClaimTokenNote';

export default function HomeDesktopTokenNote() {
  return <details className="home-desktop-token-note">
    <summary><Coins size={16} aria-hidden="true"/><span>About $HANDLE, the ecosystem token</span><ChevronDown size={14} aria-hidden="true"/></summary>
    <ClaimTokenNote/>
  </details>;
}