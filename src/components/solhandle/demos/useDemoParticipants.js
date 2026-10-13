import { useCallback, useState } from 'react';
export default function useDemoParticipants() {
  const [participants, setParticipants] = useState({});
  const onResolve = useCallback((slot, identity) => setParticipants(previous => ({ ...previous, [slot]: identity })), []);
  return { participants, onResolve };
}