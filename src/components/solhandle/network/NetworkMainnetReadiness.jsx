import { useQuery } from '@tanstack/react-query';
import { Download, ShieldCheck } from 'lucide-react';
import { networkRead } from '@/components/solhandle/network/networkClient';
import NetworkAuditContent from '@/components/solhandle/network/NetworkAuditContent';
import report from '@/components/solhandle/network/MAINNET_READINESS.md?raw';

const gates = [['publicBrowse', 'Public reading'], ['operatorPreview', 'Operator preview'], ['developmentSocial', 'Admin development'], ['walletAuthentication', 'Member wallet login'], ['contributions', 'Public contributions'], ['moderation', 'Production moderation'], ['entitlements', 'Production entitlements']];
export default function NetworkMainnetReadiness() {
  const query = useQuery({ queryKey: ['network', 'mainnet-capabilities'], queryFn: () => networkRead({ action: 'capabilities' }), staleTime: 0, retry: 1 });
  return <details className="network-implementation-audit">
    <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-names-accent"><ShieldCheck className="h-4 w-4"/>Production readiness · release blocked</summary>
    <p className="my-3 text-xs text-identity-muted">Identity, Pay and Contacts migration is in progress. Live timelines and discovery no longer mix in demo content. Public member release remains blocked pending supported wallet login, production identity, transfer monitoring, moderation and acceptance. Enabled settings alone are not a security approval.</p>
    {query.isPending ? <p role="status" className="text-xs text-identity-muted">Loading server release gates…</p> : query.isError ? <p role="alert" className="text-xs text-names-warning">Server release gates could not be loaded. <button type="button" onClick={() => query.refetch()} className="underline">Retry</button></p> : <ul className="space-y-2 text-xs">{gates.map(([key, label]) => <li key={key} className="flex flex-wrap justify-between gap-2"><span>{label}</span><strong className="text-identity-muted">{query.data?.flags?.[key] === true ? 'Enabled' : query.data?.flags?.[key] === false ? 'Disabled' : 'Unknown'}</strong></li>)}</ul>}
    <a download="SolHandle-Network-Mainnet-24-October-2026.md" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(report)}`} className="my-4 inline-flex items-center gap-2 text-xs text-names-accent"><Download className="h-4 w-4"/>Download implementation register</a>
    <div className="network-audit-content"><NetworkAuditContent content={report}/></div>
  </details>;
}