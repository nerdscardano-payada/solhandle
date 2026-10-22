import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import labClient from '@/components/solhandle/network/lab/labClient';
import NetworkState from '@/components/solhandle/network/NetworkState';
import LabIdentityBar from '@/components/solhandle/network/lab/LabIdentityBar';
import LabWorkspace from '@/components/solhandle/network/lab/LabWorkspace';
export default function NetworkLab() {
  const { user } = useAuth();
  const [actorId, setActorId] = useState('');
  const query = useQuery({ queryKey: ['network-lab', 'bootstrap', user?.id], queryFn: () => labClient({ action: 'bootstrap' }), enabled: user?.role === 'admin', retry: 1 });
  const identities = query.data?.identities || [];
  useEffect(() => { if (identities.length && !identities.some(profile => profile.id === actorId)) setActorId(identities[0].id); }, [query.data, actorId]);
  if (user?.role !== 'admin') return <p className="p-6">Administrator test access required.</p>;
  return <><header className="space-y-3 border-b border-names-warning/30 bg-names-warning/5 p-5"><p className="text-xs font-semibold uppercase tracking-widest text-names-warning">Development social access · administrator only</p><h1 className="text-2xl font-semibold">Network Social Lab</h1><p className="text-sm leading-relaxed text-identity-muted">Build the social product now without enabling public participation. Real persistent test profiles, content and interactions, isolated from public Network publications. No wallet or handle ownership is asserted.</p></header><NetworkState query={query}><LabIdentityBar identities={identities} actorId={actorId} onSelect={setActorId}/>{actorId && identities.some(profile => profile.id === actorId) ? <LabWorkspace key={actorId} actorId={actorId}/> : <p className="p-8 text-center text-identity-muted">Create your first development identity to begin.</p>}</NetworkState></>;
}