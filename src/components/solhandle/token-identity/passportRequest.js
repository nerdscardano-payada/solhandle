import { base44 } from '@/api/base44Client';
export default async function passportRequest(payload) {
  try { const {data}=await base44.functions.invoke('tokenPassportTest',payload); if(data.error) throw new Error(data.error); return data; }
  catch(error) { throw new Error(error.response?.data?.error || error.message || 'The test request could not be completed.'); }
}