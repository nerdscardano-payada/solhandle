import { LoaderCircle } from 'lucide-react';
export default function PullRefreshStatus({ refreshing }) {
  if (!refreshing) return null;
  return <div role="status" aria-label="Refreshing" className="flex items-center justify-center gap-2 py-3 text-sm text-names-accent"><LoaderCircle className="h-4 w-4 animate-spin"/>Refreshing…</div>;
}