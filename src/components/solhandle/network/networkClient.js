import { base44 } from '@/api/base44Client';
export async function networkRead(payload) {
  const { data } = await base44.functions.invoke('networkRead', payload);
  if (data.error) throw new Error(data.error);
  return data;
}
export async function networkPreview(payload) {
  const { data } = await base44.functions.invoke('networkPreview', payload);
  if (data.error) throw new Error(data.error);
  return data;
}
export const profilePath = profile => `/network/account/${encodeURIComponent(profile.id)}`;