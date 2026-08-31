import { base44 } from "@/api/base44Client";

const SITE_ORIGIN = "https://solhandle.io";
const cleanHandle = (handle) => String(handle || "").trim().toLowerCase().replace(/^@/, "");

export function getCanonicalHandleUrl(handle) {
  return `${SITE_ORIGIN}/@${encodeURIComponent(cleanHandle(handle))}`;
}

export function getTrackedHandleUrl(handle) {
  return `${getCanonicalHandleUrl(handle)}?utm_source=x&utm_medium=social&utm_campaign=handle_share`;
}

export function generateShareMessage({ handle, isPremium = false }) {
  const display = `@${cleanHandle(handle)}`;
  return isPremium
    ? `💎 I just claimed my SolHandle: ${display}\n\nA Premium SolHandle on Solana.`
    : `I just claimed my SolHandle: ${display} ⚡\n\nMy human-readable identity on Solana.`;
}

export function shareHandleOnX({ handle, isPremium, location }) {
  base44.analytics.track({ eventName: "x_share_click", properties: { handle: cleanHandle(handle), share_location: location } });
  const params = new URLSearchParams({ text: generateShareMessage({ handle, isPremium }), url: getTrackedHandleUrl(handle) });
  const popup = window.open(`https://x.com/intent/tweet?${params.toString()}`, "_blank", "noopener,noreferrer");
  if (popup) popup.opener = null;
}

export async function copyHandleLink({ handle, location }) {
  await navigator.clipboard.writeText(getCanonicalHandleUrl(handle));
  base44.analytics.track({ eventName: "handle_link_copy", properties: { handle: cleanHandle(handle), share_location: location } });
}

export function setHandleShareMetadata(handle, isPremium) {
  const title = `@${cleanHandle(handle)} — SolHandle`;
  const description = isPremium ? "A Premium SolHandle on Solana" : "A human-readable identity on Solana";
  document.title = title;
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", getCanonicalHandleUrl(handle));
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", getCanonicalHandleUrl(handle));
  return () => {
    document.title = "SolHandle — Claim Your @Handle on Solana";
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", "SolHandle — Claim Your @Handle on Solana");
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", "Claim and own your unique SolHandle identity on Solana.");
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${SITE_ORIGIN}/`);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${SITE_ORIGIN}/`);
  };
}