import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import SolHandleIntro from '@/components/solhandle/intro/SolHandleIntro';

// Set false to restore the previous homepage presentation immediately.
const INTRO_ENABLED = true;
const SEEN_KEY = 'solhandle_intro_seen_v1';
export default function HomeEntrance({ children }) {
  const [open, setOpen] = useState(() => INTRO_ENABLED && localStorage.getItem(SEEN_KEY) !== 'yes');
  const finish = () => { localStorage.setItem(SEEN_KEY, 'yes'); setOpen(false); window.scrollTo(0, 0); };
  const replay = () => { localStorage.removeItem(SEEN_KEY); setOpen(true); };
  return <>{children}{INTRO_ENABLED && <div className="solhandle-intro border-t border-border bg-background px-5 py-3 text-center text-muted-foreground"><button type="button" onClick={replay} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors hover:text-names-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-names-accent"><RotateCcw className="h-3.5 w-3.5"/>SolHandle introductie opnieuw bekijken</button></div>}{open && <SolHandleIntro onContinue={finish}/>}</>;
}