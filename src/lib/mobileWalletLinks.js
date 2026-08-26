export const isMobileBrowser = () => typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const isWalletBrowser = () => typeof window !== "undefined" && Boolean(
  window.phantom?.solana?.isPhantom || window.solflare?.isSolflare || window.backpack?.isBackpack
);

export function buildWalletBrowserUrl(wallet, targetUrl) {
  const target = encodeURIComponent(targetUrl);
  const ref = encodeURIComponent(new URL(targetUrl).origin);
  const bases = {
    phantom: "https://phantom.app/ul/browse/",
    solflare: "https://solflare.com/ul/v1/browse/",
    backpack: "https://backpack.app/ul/v1/browse/",
  };
  return `${bases[wallet]}${target}?ref=${ref}`;
}

export function currentWalletTarget(detail) {
  const target = new URL(window.location.href);
  if (detail?.action === "claim" && detail.handle) target.searchParams.set("claim", detail.handle);
  return target.toString();
}