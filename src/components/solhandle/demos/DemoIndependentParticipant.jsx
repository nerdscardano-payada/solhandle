import { useCallback } from 'react';
import DemoParticipantCard from '@/components/solhandle/demos/DemoParticipantCard';
import DemoCounterpartyLookup from '@/components/solhandle/demos/DemoCounterpartyLookup';
export default function DemoIndependentParticipant({ slot, role, identity, onResolve, enhanced, presentation }) {
  const accept = useCallback(value => onResolve(slot, value), [slot, onResolve]);
  return <div className="min-w-0 space-y-3"><DemoParticipantCard role={role} identity={identity} enhanced={enhanced}/>{enhanced && !presentation && <DemoCounterpartyLookup role={role} onIdentity={accept}/>}</div>;
}