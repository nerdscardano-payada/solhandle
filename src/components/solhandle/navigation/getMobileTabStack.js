export default function getMobileTabStack(stacks, tab) {
  const stack = stacks[tab] ||= { entries: [], index: -1 };
  // Remove contacts entries previously captured by a primary tab, including during a live update.
  if (tab !== '/contacts') {
    const current = stack.entries[stack.index];
    const entries = stack.entries.filter(entry => entry.url.split(/[?#]/)[0] !== '/contacts');
    if (entries.length !== stack.entries.length) {
      stack.entries = entries;
      const index = entries.indexOf(current);
      stack.index = index >= 0 ? index : entries.length - 1;
    }
  }
  return stack;
}