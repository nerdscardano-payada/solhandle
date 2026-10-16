import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import useTabScroll from '@/components/solhandle/navigation/useTabScroll';

const Context = createContext(null);
export const useMobileTabs = () => useContext(Context);
const roots = ['/', '/pay', '/receive', '/my-handles'];
const allowed = path => !path.startsWith('/admin') && !path.startsWith('/widgets/') && !['/login', '/register', '/forgot-password', '/reset-password', '/mint', '/oauth-consent'].includes(path);
export default function MobileTabProvider({ children }) {
  const location = useLocation(), navigate = useNavigate(), type = useNavigationType(), mobile = useIsMobile();
  const stacks = useRef(Object.fromEntries(roots.map(root => [root, { entries: [], index: -1 }])));
  const selected = useRef('/'), active = useRef(null), sequence = useRef(0);
  const [ticket, setTicket] = useState(null);
  const enabled = mobile && allowed(location.pathname);
  const save = useTabScroll(ticket, enabled, active);
  useLayoutEffect(() => {
    if (!enabled) return;
    const intent = location.state?.solhandleTab;
    let tab = roots.includes(location.pathname) ? location.pathname : location.pathname === '/search' ? '/' : selected.current;
    let index = -1;
    for (const root of roots) {
      const found = stacks.current[root].entries.findIndex(entry => (intent?.tab === root && entry.id === intent.id && entry.url === location.pathname + location.search + location.hash) || entry.keys.includes(location.key));
      if (found >= 0) { tab = root; index = found; break; }
    }
    const stack = stacks.current[tab], url = location.pathname + location.search + location.hash;
    if (index >= 0) stack.index = index;
    else {
      const entry = { id: ++sequence.current, keys: [location.key], url, state: location.state };
      if (type === 'REPLACE' && stack.index >= 0 && selected.current === tab) stack.entries[stack.index] = entry;
      else { stack.entries = stack.entries.slice(0, stack.index + 1); stack.entries.push(entry); stack.index = stack.entries.length - 1; }
    }
    selected.current = tab; active.current = stack.entries[stack.index];
    if (!active.current.keys.includes(location.key)) active.current.keys.push(location.key);
    setTicket({ entry: active.current, key: location.key });
  }, [location, type, enabled]);
  const visit = (tab, entry) => {
    save();
    if (active.current) active.current.url = window.location.pathname + window.location.search + window.location.hash;
    navigate(entry?.url || tab, { state: { ...entry?.state, solhandleTab: { tab, id: entry?.id } } });
  };
  const selectTab = tab => { if (tab !== selected.current) { const stack = stacks.current[tab]; visit(tab, stack.entries[stack.index]); } };
  const back = () => {
    const stack = stacks.current[selected.current];
    if (!enabled || stack.index <= 0) return false;
    visit(selected.current, stack.entries[stack.index - 1]); return true;
  };
  return <Context.Provider value={{ enabled, activeTab: selected.current, selectTab, back, target: tab => { const stack = stacks.current[tab]; return stack.entries[stack.index]?.url || tab; } }}>{children}</Context.Provider>;
}