import { base44 } from '@/api/base44Client';
export async function intakeCall(payload, admin = false) {
  const {data} = await base44.functions.invoke(admin ? 'integrationAdmin' : 'integrationIntake', payload);
  if (data.error) throw new Error(data.error);
  return data;
}
export function trackIntake(eventName, properties = {}) { base44.analytics.track({eventName,properties}); }
export function intakeError(error) { return error?.response?.data?.error || error?.data?.error || error.message || 'Please try again.'; }