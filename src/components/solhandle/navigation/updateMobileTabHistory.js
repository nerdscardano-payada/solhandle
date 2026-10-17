import getMobileTabStack from '@/components/solhandle/navigation/getMobileTabStack';
export const mobileTabRoots = ['/', '/pay', '/receive', '/my-handles', '/contacts'];
export const emptyTabHistory = () => Object.fromEntries(mobileTabRoots.map(root => [root, { entries: [], index: -1 }]));
export function updateMobileTabHistory(stacks, location, type, previous, nextId) {
  const intent = location.state?.solhandleTab;
  const url = location.pathname + location.search + location.hash;
  let tab = mobileTabRoots.includes(location.pathname) ? location.pathname : location.pathname === '/search' ? '/' : previous.tab;
  let index = -1;
  for (const root of mobileTabRoots) {
    const found = getMobileTabStack(stacks, root).entries.findIndex(entry => (intent?.tab === root && entry.id === intent.id && entry.url === url) || entry.keys.includes(location.key));
    if (found >= 0) { tab = root; index = found; break; }
  }
  const stack = getMobileTabStack(stacks, tab), oldIndex = stack.index;
  const { solhandleTab: ignored, ...state } = location.state || {};
  if (index >= 0) stack.index = index;
  else {
    if (!stack.entries.length && location.pathname !== tab) stack.entries.push({ id: nextId(), keys: [], url: tab, state: {} });
    const entry = { id: nextId(), keys: [location.key], url, state };
    if (type === 'REPLACE' && stack.index >= 0 && previous.tab === tab) stack.entries[stack.index] = entry;
    else { stack.entries = stack.entries.slice(0, Math.max(stack.index + 1, stack.entries.length === 1 && !stack.entries[0].keys.length ? 1 : 0)); stack.entries.push(entry); stack.index = stack.entries.length - 1; }
  }
  const entry = stack.entries[stack.index];
  if (!entry.keys.includes(location.key)) entry.keys.push(location.key);
  entry.historyIndex = window.history.state?.idx;
  const move = previous.tab !== tab ? 'tab' : index >= 0 && index < oldIndex ? 'pop' : type === 'POP' && previous.entry ? 'pop' : intent?.move || (type === 'REPLACE' ? 'replace' : 'push');
  return { tab, entry, direction: move === 'pop' ? -1 : move === 'push' ? 1 : 0 };
}