import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import invokeWithRetry from '@/lib/invokeWithRetry';
import { base44 } from '@/api/base44Client';
import { analyticsSessionId, referralCode, trackProtocol } from '@/lib/protocolAnalytics';
import { validateHandle } from '@/lib/solhandle';
export default function useConfirmedHandleSearch(handle, result, userEntered) {
  const client = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async payload => (await invokeWithRetry('trackProtocolAnalytics', payload)).data,
    onSuccess: (response, payload) => {
      if (response.recorded) {
        client.invalidateQueries({ queryKey: ['names'] });
        client.invalidateQueries({ queryKey: ['name-interest'] });
      }
      if (response.recorded && !response.duplicate) {
        base44.analytics.track({ eventName: 'referral_handle_searched', properties: { available: payload.available } });
        trackProtocol('funnel', { step: 'SEARCH', handle: payload.handle, source: payload.source });
      }
    }
  });
  useEffect(() => {
    if (!userEntered || validateHandle(handle) || result?.handle !== handle || result.state || result.status === 'INVALID') return;
    const timer = setTimeout(() => {
      mutate({ type: 'search', handle, available: Boolean(result.available), status: result.status, source: 'manual_confirmed_v1', session_id: analyticsSessionId(), referral_code: referralCode() });
    }, 700);
    return () => clearTimeout(timer);
  }, [handle, result, userEntered, mutate]);
}