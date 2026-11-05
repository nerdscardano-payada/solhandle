import { base44 } from '@/api/base44Client';
export default async function memberPassportRequest(payload) {
  try {const {data}=await base44.functions.invoke('tokenPassportMember',payload);if(data.error)throw new Error(data.error);return data;}
  catch(error){throw new Error(error.response?.data?.error||error.message||'Token Passport could not be loaded.');}
}