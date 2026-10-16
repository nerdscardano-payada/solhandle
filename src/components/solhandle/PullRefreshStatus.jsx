import { ArrowDown, LoaderCircle } from 'lucide-react';
export default function PullRefreshStatus({ refreshing, distance = 0, ready = false }) {
  if (!refreshing && !distance) return null;
  const Icon = refreshing ? LoaderCircle : ArrowDown;
  return <div role="status" aria-live="polite" className="pointer-events-none flex items-center justify-center gap-2 overflow-hidden text-sm text-names-accent" style={{ height: refreshing ? 48 : distance }}><Icon aria-hidden="true" className={refreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} style={!refreshing ? { transform: `rotate(${ready ? 180 : 0}deg)` } : undefined}/>{refreshing ? 'Refreshing…' : ready ? 'Release to refresh' : 'Pull to refresh'}</div>;
}