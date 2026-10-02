import { base44 } from '@/api/base44Client';
export default async function partnerRegistryCall(action, payload = {}) {
  const { data } = await base44.functions.invoke('partnerMintRegistry', { ...payload, action, cluster: 'devnet' });
  if (data.error) throw new Error(data.error.message || data.error.code);
  return data;
}