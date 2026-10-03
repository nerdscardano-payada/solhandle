import { useState } from 'react';
import { normalizeHandle, validateHandle } from '@/lib/solhandle';
import { localAvailability } from '@/components/solhandle/bulk-local/localAvailability';
const key = 'solhandle-local-bulk-cart-v1';
export default function useLocalBulkCart() {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } });
  const [input, setInput] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const save = next => { localStorage.setItem(key, JSON.stringify(next)); setItems(next); };
  const add = async event => {
    event.preventDefault(); if (busy) return; setError('');
    const handle = normalizeHandle(input), invalid = validateHandle(handle);
    if (invalid) { setError(invalid); return; }
    if (items.some(item => item.handle === handle)) { setError('This name is already in your cart.'); return; }
    if (items.length >= 10) { setError('Your local cart holds up to 10 names.'); return; }
    setBusy(true);
    try {
      const { items: checked } = await localAvailability([handle]);
      if (!checked[0].available) throw new Error(`@${handle}: ${checked[0].status}`);
      save([...items, checked[0]]); setInput('');
    } catch (caught) { setError(caught.message); } finally { setBusy(false); }
  };
  const refresh = async () => {
    if (busy || !items.length) return; setBusy(true); setError('');
    try { save((await localAvailability(items.map(item => item.handle))).items); } catch (caught) { setError(caught.message); } finally { setBusy(false); }
  };
  return { items, input, setInput, busy, error, add, refresh, remove: handle => save(items.filter(item => item.handle !== handle)), clear: () => { save([]); setError(''); } };
}