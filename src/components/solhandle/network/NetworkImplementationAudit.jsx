import NetworkAuditContent from '@/components/solhandle/network/NetworkAuditContent';
import { ClipboardList, Download } from 'lucide-react';
import audit from '@/components/solhandle/network/SOCIAL_WEB_AUDIT.md?raw';
export default function NetworkImplementationAudit() {
  return <details className="network-implementation-audit"><summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-names-accent"><ClipboardList className="h-4 w-4"/>Audit & bouwplan · 23 oktober</summary><a download="SolHandle-Social-Audit-23-oktober-2026.md" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(audit)}`} className="my-4 inline-flex items-center gap-2 text-xs text-names-accent"><Download className="h-4 w-4"/>Download volledige audit</a><div className="network-audit-content"><NetworkAuditContent content={audit}/></div></details>;
}