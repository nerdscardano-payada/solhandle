import { base44 } from '@/api/base44Client';
export default async function growthHubClient(payload) {
  const { data } = await base44.functions.invoke('growthHubService', payload);
  return data;
}
export const growthError = error => error.response?.data?.error || error.message || 'Growth Hub is tijdelijk niet bereikbaar.';