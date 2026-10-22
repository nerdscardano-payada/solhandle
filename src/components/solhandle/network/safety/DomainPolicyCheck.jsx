import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { domainSafety } from '@/components/solhandle/network/safety/useDomainSafety';

export default function DomainPolicyCheck() {
  const [target, setTarget] = useState('');
  const check = useMutation({ mutationFn: () => domainSafety({ action: 'check', target }) });
  const submit = event => { event.preventDefault(); check.mutate(); };
  const result = check.data;
  return <section className="rounded-2xl border border-border bg-card p-6"><h2 className="flex items-center gap-2 text-xl font-semibold"><ShieldCheck className="h-5 w-5 text-names-accent"/>Check a link policy</h2><p className="mt-2 text-sm text-muted-foreground">No page is fetched or opened. This checks the exact domain against your latest stored decision.</p><form onSubmit={submit} className="mt-5 space-y-3"><Label htmlFor="check-domain">Domain or URL</Label><Input id="check-domain" value={target} onChange={e => { setTarget(e.target.value); check.reset(); }} required maxLength={2048} disabled={check.isPending}/><Button type="submit" variant="outline" disabled={check.isPending}>{check.isPending ? 'Checking…' : 'Check policy'}</Button></form>
    {check.isError && <p role="alert" className="mt-4 text-sm text-destructive">{check.error.response?.data?.error || check.error.message}</p>}
    {result && <div role="status" className="mt-5 space-y-3 rounded-xl border border-names-accent/30 bg-background p-4"><p className="break-all font-mono text-sm">{result.hostname}</p><p className="font-semibold text-names-accent">{result.outcome} · {result.classification}</p><p className="text-sm">{result.reason}</p>{result.international && <p className="text-sm">Internationalized domain: review punycode and lookalike risks.</p>}{result.insecure && <p className="text-sm">HTTP is not encrypted. A warning is required.</p>}<p className="text-xs text-muted-foreground">{result.disclaimer}</p></div>}
    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">TRUSTED never means a safe investment or a trustworthy person. These policies do not yet intercept links elsewhere in SolHandle.</p>
  </section>;
}