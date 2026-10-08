import { useState } from 'react';
import SolHandleIntro from '@/components/solhandle/intro/SolHandleIntro';

// Set false to restore the previous homepage presentation immediately.
const INTRO_ENABLED = false;
const SEEN_KEY = 'solhandle_intro_seen_v1';
export default function HomeEntrance({ children }) {
  const [open, setOpen] = useState(() => INTRO_ENABLED && localStorage.getItem(SEEN_KEY) !== 'yes');
  const finish = () => { localStorage.setItem(SEEN_KEY, 'yes'); setOpen(false); window.scrollTo(0, 0); };
  return <>{children}{open && <SolHandleIntro onContinue={finish}/>}</>;
}