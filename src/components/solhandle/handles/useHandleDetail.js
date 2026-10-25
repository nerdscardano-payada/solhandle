import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { setHandleShareMetadata } from '@/lib/shareSolHandle';
import { normalizeHandle, validateHandle } from '@/lib/solhandle';
export default function useHandleDetail() {
  const handle = normalizeHandle(window.location.pathname.split('/').filter(Boolean).pop());
  const [data, setData] = useState(null);
  useEffect(() => {
    if (validateHandle(handle)) { setData({ state: 'invalid' }); return; }
    base44.functions.invoke('getHandleAvailability', { handle }).then(res => setData(res.data)).catch(() => setData({ state: 'invalid' }));
  }, [handle]);
  useEffect(() => {
    if (!handle || validateHandle(handle)) return;
    return setHandleShareMetadata(handle, data?.nameClass === 'Premium');
  }, [handle, data?.nameClass]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('utm_source') === 'x') base44.analytics.track({ eventName: 'shared_handle_visit', properties: { handle, source: 'x' } });
  }, [handle]);
  return { handle, data, invalid: data?.status === 'INVALID', available: data?.available, owner: data?.currentOwner || data?.original_minter };
}