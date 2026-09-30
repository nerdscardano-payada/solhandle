import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import invokeWithRetry from '@/lib/invokeWithRetry';
import { analyticsSessionId, referralCode, trackProtocol } from '@/lib/protocolAnalytics';
import { validateHandle } from '@/lib/solhandle';
export default function useConfirmedHandleSearch(handle, result) {
  const inFlight = useRef(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const confirmSearch = async () => {
    if (inFlight.current) return;
    const invalid = validateHandle(handle);
    if (invalid) { setError(invalid); return; }
    inFlight.current = true; setBusy(true); setError('');
    try {
      const checked = result?.handle === handle && !result.state ? result : (await invokeWithRetry('getHandleAvailability', { handle })).data;
      if (checked?.handle !== handle || checked.status === 'INVALID') throw new Error('Could not check this handle. Please try again.');
      const source = 'manual_confirmed_v1';
      const response = (await base44.functions.invoke('trackProtocolAnalytics', { type: 'search', handle, available: Boolean(checked.available), status: checked.status, source, session_id: analyticsSessionId(), referral_code: referralCode() })).data;
      if (response.recorded && !response.duplicate) {
        base44.analytics.track({ eventName: 'referral_handle_searched', properties: { available: Boolean(checked.available) } });
        trackProtocol('funnel', { step: 'SEARCH', handle, source });
      }
    } catch (caught) { setError(caught.response?.data?.error || caught.message || 'Could not confirm your search. Please try again.'); }
    finally { inFlight.current = false; setBusy(false); }
  };
  return { busy, error, confirmSearch };
}