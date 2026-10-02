import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pilotCall } from '@/components/solhandle/partner-mint/partnerPilotClient';
export default function usePartnerMintReport(partnerId, refreshKey) {
  const client = useQueryClient(), [recoveryCursor, setRecoveryCursor] = useState(null);
  const queryKey = ['partner-mint-report', partnerId, refreshKey];
  const query = useInfiniteQuery({ queryKey, initialPageParam: null,
    queryFn: ({ pageParam }) => pilotCall('report', { partnerId, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.hasMore ? page.nextCursor : undefined, refetchOnWindowFocus: false
  });
  const recovery = useMutation({ mutationFn: () => pilotCall('reconcile', { partnerId, ...(recoveryCursor ? { cursor: recoveryCursor } : {}) }),
    onSuccess: result => { setRecoveryCursor(result.hasMore ? result.nextCursor : null); client.invalidateQueries({ queryKey: ['partner-mint-report', partnerId] }); }
  });
  return { query, recovery, receipts: query.data?.pages.flatMap(page => page.receipts) || [], totals: query.data?.pages[0]?.totals, checkedAt: query.data?.pages[0]?.checkedAt };
}