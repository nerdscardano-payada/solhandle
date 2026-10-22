import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
export default function LabPrivateImage({ media, alt, className = '', fittingType = 'fill' }) {
  const query = useQuery({ queryKey: ['network-private-image', media?.fileUri], enabled: Boolean(media?.fileUri), queryFn: () => base44.integrations.Core.CreateFileSignedUrl({ file_uri: media.fileUri, expires_in: 300 }), staleTime: 240000, refetchInterval: 240000, retry: 1 });
  if (!media) return null;
  if (query.isError) return <span role="status" className={className}>Image unavailable</span>;
  if (!query.data) return <span role="status" className={className}>Loading image…</span>;
  return <Image src={query.data.signed_url} alt={alt} fittingType={fittingType} className={className}/>;
}