import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const expiresAt = Date.parse('2026-10-10T18:05:00.000Z');
export default function WeekendClosureNotice() {
  const [visible, setVisible] = useState(() => Date.now() < expiresAt);
  useEffect(() => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) { setVisible(false); return; }
    const timer = setTimeout(() => setVisible(false), remaining);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <section role="status" className="rounded-2xl border border-names-success/40 bg-card p-5 lg:p-7">
    <div className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 shrink-0 text-names-success"/><h2 className="text-xl font-semibold">All eligible wallets have been paid.</h2></div>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">Mint Weekend is complete. Every winner received 100,000 $HANDLE. Thank you for taking part!</p>
    <p className="mt-2 text-sm text-names-success">Each reward payment is linked to its on-chain transaction below.</p>
    <p className="mt-3 text-xs text-muted-foreground">This notice is visible until 10 October 2026, 20:05 Brussels time. The proof archive remains available afterwards.</p>
  </section>;
}