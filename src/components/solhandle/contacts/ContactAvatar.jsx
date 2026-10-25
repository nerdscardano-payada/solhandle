import { useQuery } from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import '@/components/solhandle/profile/profile-media.css';

export default function ContactAvatar({ contact }) {
  const handle = (contact.handle || '').replace(/^@/, '').toLowerCase();
  const query = useQuery({
    queryKey: ['contact-profile-avatar', handle, contact.recipient_wallet],
    enabled: /^[a-z0-9]{1,20}$/.test(handle) && !!contact.recipient_wallet,
    staleTime: 30000,
    retry: false,
    queryFn: async () => {
      const [result, ownership] = await Promise.all([
        publicProfileRequest({ action: 'public', handle }),
        base44.functions.invoke('getHandleAvailability', { handle }),
      ]);
      return ownership.data?.currentOwner === contact.recipient_wallet ? result.profile?.avatar || null : null;
    },
  });
  return query.data ? <ProfileAvatar avatar={query.data} handle={handle} mintFallback={false} className="!h-11 !w-11 !rounded-xl"/> : <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-names-secondary/10 text-names-secondary"><UserRound className="h-5 w-5"/></div>;
}