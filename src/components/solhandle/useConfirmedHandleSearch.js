import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { analyticsSessionId, referralCode, trackProtocol } from '@/lib/protocolAnalytics';
import { validateHandle } from '@/lib/solhandle';
export default function useConfirmedHandleSearch(handle, result, userEntered) {
  const client = useQueryClient();
  useEffect(() => {
    if (!userEntered || validateHandle(handle) || result?.handle !== handle || result.state || result.status === 'INVALID') return;
    const timer = setTimeout(async () => {
      const source = 'manual_confirmed_v1';
      const response = (await base44.functions.invoke('trackProtocolAnalytics', { type: 'search', handle, available: Boolean(result.available), status: result.status, source, session_id: analyticsSessionId(), referral_code: referralCode() })).data;
      if (response.recorded) {
        client.invalidateQueries({ queryKey: ['names'] });
        client.invalidateQueries({ queryKey: ['name-interest'] });
      }
      if (response.recorded && !response.duplicate) {
        base44.analytics.track({ eventName: 'referral_handle_searched', properties: { available: Boolean(result.available) } });
        trackProtocol('funnel', { step: 'SEARCH', handle, source });
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [handle, result, userEntered, client]);
}