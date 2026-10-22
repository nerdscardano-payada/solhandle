import { base44 } from '@/api/base44Client';
export default async function labClient(payload) {
  const { data } = await base44.functions.invoke('networkLab', payload);
  if (data.error) throw new Error(data.error);
  return data;
}
export const labError = error => error?.response?.data?.error || error?.message;