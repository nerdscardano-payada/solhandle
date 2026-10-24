import { useEffect, useRef } from 'react';

export default function useIdentityAttempt({ actorId, address, adapter, connected }) {
  const state = useRef({ actorId, address, adapter, connected, version: 0 });
  const lock = useRef(false);
  const previous = state.current;
  if (previous.actorId !== actorId || previous.address !== address || previous.adapter !== adapter || previous.connected !== connected) {
    state.current = { actorId, address, adapter, connected, version: previous.version + 1 };
  }
  useEffect(() => () => { state.current = { ...state.current, version: state.current.version + 1 }; }, []);
  return {
    begin() {
      if (lock.current || !actorId || !address || !connected) return null;
      lock.current = true;
      const version = state.current.version;
      return {
        current: () => state.current.version === version,
        assertCurrent() {
          if (state.current.version !== version) throw new Error('Your wallet or Network account changed. Start a new verification.');
        },
        finish: () => { lock.current = false; }
      };
    }
  };
}