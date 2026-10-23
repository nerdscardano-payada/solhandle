import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
const NetworkPostAction = forwardRef(function NetworkPostAction({ icon: Icon, label, accessibleLabel = label, count, active, pending = false, disabled = false, tone = 'reply', className = '', ...props }, ref) {
  const exactCount = typeof count === 'number' ? count.toLocaleString() : null;
  const compactCount = typeof count === 'number' ? new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(count) : null;
  return <button {...props} ref={ref} type="button" className={`network-feed-action ${className}`} data-tone={tone} data-active={active || undefined} aria-label={`${accessibleLabel}${exactCount !== null ? `, ${exactCount}` : ''}`} aria-pressed={typeof active === 'boolean' ? active : undefined} aria-busy={pending || undefined} disabled={disabled || pending} title={`${accessibleLabel}${exactCount !== null ? ` · ${exactCount}` : ''}`}><span className="network-action-icon">{pending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Icon className="h-4 w-4" fill={active && tone === 'like' ? 'currentColor' : 'none'}/>}</span><span className="network-action-label">{label}</span>{compactCount !== null && <span className="network-action-count" aria-hidden="true">{compactCount}</span>}</button>;
});
export default NetworkPostAction;