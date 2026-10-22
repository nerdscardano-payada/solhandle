import { Loader2 } from 'lucide-react';
export default function NetworkState({ query, empty, children }) {
  if (query.isPending) return <div role="status" className="flex items-center justify-center gap-3 p-12 text-identity-muted"><Loader2 className="h-5 w-5 animate-spin"/>Loading Network…</div>;
  if (query.isError) return <div role="alert" className="rounded-2xl border border-names-warning/30 p-6"><p>Network could not be loaded.</p><button onClick={() => query.refetch()} className="mt-3 text-names-accent underline">Try again</button></div>;
  if (empty) return <div className="py-12 text-center text-identity-muted">{empty}</div>;
  return children;
}