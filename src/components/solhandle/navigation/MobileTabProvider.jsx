import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import useTabScroll from '@/components/solhandle/navigation/useTabScroll';
import getMobileTabStack from '@/components/solhandle/navigation/getMobileTabStack';
import { emptyTabHistory, updateMobileTabHistory } from '@/components/solhandle/navigation/updateMobileTabHistory';

const Context = createContext(null);
export const useMobileTabs = () => useContext(Context);
const allowed = path => !path.startsWith('/admin') && !path.startsWith('/widgets/') && !['/login', '/register', '/forgot-password', '/reset-password', '/mint', '/oauth-consent'].includes(path);
export default function MobileTabProvider({ children }) {
  const location = useLocation(), navigate = useNavigate(), type = useNavigationType(), mobile = useIsMobile();
  const stacks = useRef(location.state?.solhandleTab?.stacks || emptyTabHistory());
  const selected = useRef(location.state?.solhandleTab?.tab || '/'), active = useRef(null), lastTap = useRef(null);
  const [ticket, setTicket] = useState(null);
  const enabled = mobile && allowed(location.pathname);
  const save = useTabScroll(ticket, enabled, active);
  useLayoutEffect(() => {
    if (!enabled) return;
    const next = updateMobileTabHistory(stacks.current, location, type, { tab: selected.current, entry: active.current }, () => crypto.randomUUID());
    selected.current = next.tab; active.current = next.entry;
    setTicket({ ...next, key: location.key });
  }, [location, type, enabled]);
  const visit = (tab, entry, move = 'tab', reset) => {
    save();
    if (active.current) active.current.url = window.location.pathname + window.location.search + window.location.hash;
    navigate(entry?.url || tab, { replace: move === 'reset' || move === 'pop', state: { ...entry?.state, solhandleTab: { tab, id: entry?.id, move, reset, stacks: structuredClone(stacks.current) } } });
  };
  const selectTab = tab => {
    const now = performance.now(), doubleTap = lastTap.current?.tab === tab && now - lastTap.current.time < 350;
    lastTap.current = { tab, time: now };
    if (doubleTap && tab === selected.current) {
      const root = { id: crypto.randomUUID(), keys: [], url: tab, state: {}, scroll: { x: 0, y: 0, panels: [] } };
      stacks.current[tab] = { entries: [root], index: 0 };
      lastTap.current = null; visit(tab, root, 'reset', root.id);
    } else if (tab !== selected.current) { const stack = getMobileTabStack(stacks.current, tab); visit(tab, stack.entries[stack.index]); }
  };
  const back = () => {
    const stack = getMobileTabStack(stacks.current, selected.current);
    if (!enabled || stack.index <= 0) return false;
    const entry = stack.entries[stack.index - 1], delta = entry.historyIndex - window.history.state?.idx;
    if (Number.isFinite(delta) && delta < 0) { save(); navigate(delta); }
    else visit(selected.current, entry, 'pop');
    return true;
  };
  return <Context.Provider value={{ enabled, direction: ticket?.direction || 0, activeTab: selected.current, selectTab, back, target: tab => { const stack = getMobileTabStack(stacks.current, tab); return stack.entries[stack.index]?.url || tab; } }}>{children}</Context.Provider>;
}