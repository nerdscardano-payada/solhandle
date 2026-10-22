import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import useDomainSafety from '@/components/solhandle/network/safety/useDomainSafety';
import DomainPolicyForm from '@/components/solhandle/network/safety/DomainPolicyForm';
import DomainPolicyCheck from '@/components/solhandle/network/safety/DomainPolicyCheck';
import DomainDecisionHistory from '@/components/solhandle/network/safety/DomainDecisionHistory';

export default function SafetyWorkspace() {
  const state = useDomainSafety();
  const [revision, setRevision] = useState(0);
  return <section className="mx-auto max-w-6xl px-5 py-10"><Link to="/admin" className="text-sm text-names-accent">← Developer dashboard</Link><div className="mt-6 flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-names-accent"/><div><p className="text-xs uppercase tracking-widest text-names-accent">SolHandle Network · Foundation</p><h1 className="mt-1 text-3xl font-semibold">Safety Center</h1></div></div><p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">Your @. Your identity. Your network. Start with explainable safety decisions, not an unprotected social feed.</p>
    <aside className="my-6 rounded-xl border border-names-accent/30 bg-card p-5 text-sm leading-relaxed"><h2 className="font-semibold text-names-accent">Internal domain-policy management only</h2><p className="mt-2 text-muted-foreground">This working module stores domain decisions and looks up the resulting policy. Network registration, social posting, automatic link interception and live malware scanning are not enabled. The existing My Profile page remains a wallet identity view, not a social account.</p></aside>
    <div className="grid items-start gap-6 lg:grid-cols-2"><DomainPolicyForm save={state.save} onSaved={() => setRevision(value => value + 1)}/><DomainPolicyCheck key={revision}/></div>
    <DomainDecisionHistory {...state}/>
  </section>;
}