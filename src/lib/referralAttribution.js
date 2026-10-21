// Old referral links still open the normal identity flow without attribution.
export async function captureReferralAttribution() {
  localStorage.removeItem('solhandle_referral_attribution');
  localStorage.removeItem('solhandle_referral_session');
  document.cookie = 'solhandle_ref=; Max-Age=0; path=/; SameSite=Lax; Secure';
  const url = new URL(window.location.href);
  if (url.searchParams.has('ref')) {
    url.searchParams.delete('ref');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }
}
export function getReferralAttributionId() { return ''; }