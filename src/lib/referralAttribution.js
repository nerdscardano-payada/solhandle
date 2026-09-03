import { base44 } from "@/api/base44Client";

const STORAGE_KEY = "solhandle_referral_attribution";
const SESSION_KEY = "solhandle_referral_session";

function sessionId() {
  let value = localStorage.getItem(SESSION_KEY);
  if (!value) { value = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, value); }
  return value;
}

export async function captureReferralAttribution() {
  const url = new URL(window.location.href);
  const code = String(url.searchParams.get("ref") || "").trim();
  if (!code) return;
  const response = await base44.functions.invoke("referralAttribution", { code, browser_session_id: sessionId() });
  if (response.data?.valid) {
    const value = JSON.stringify({ id: response.data.attributionId, code: response.data.referralCode, expiresAt: response.data.expiresAt });
    localStorage.setItem(STORAGE_KEY, value);
    document.cookie = `solhandle_ref=${encodeURIComponent(response.data.attributionId)}; expires=${new Date(response.data.expiresAt).toUTCString()}; path=/; SameSite=Lax; Secure`;
  }
  url.searchParams.delete("ref");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

export function getReferralAttributionId() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!stored?.id || Date.parse(stored.expiresAt) <= Date.now()) { localStorage.removeItem(STORAGE_KEY); return ""; }
    return stored.id;
  } catch { localStorage.removeItem(STORAGE_KEY); return ""; }
}