import { base44 } from "@/api/base44Client";

const SESSION_KEY = "solhandle_analytics_session";
const REFERRAL_KEY = "solhandle_referral_attribution";
export function analyticsSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, id); }
  return id;
}
export function referralCode() {
  const direct = new URLSearchParams(window.location.search).get("ref");
  if (direct) return direct;
  try { return JSON.parse(localStorage.getItem(REFERRAL_KEY) || "null")?.code || ""; } catch { return ""; }
}
export function trackProtocol(type, data = {}) {
  base44.functions.invoke("trackProtocolAnalytics", { type, session_id: analyticsSessionId(), referral_code: referralCode(), ...data }).catch(() => null);
}
export function trackFunnel(step, handle = "") { trackProtocol("funnel", { step, handle }); }