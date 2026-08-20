export const FALLBACK_PRICES = { 1: 500000000, 2: 300000000, 3: 100000000, 4: 50000000, 5: 10000000 };

export function normalizeHandle(value = "") {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

export function validateHandle(handle) {
  if (!handle) return "Enter a handle to search.";
  if (handle.length > 20) return "Handles can be up to 20 characters.";
  if (!/^[a-z0-9_]+$/.test(handle)) return "Use lowercase letters, numbers, or underscores only.";
  return null;
}

export function lamportsToSol(lamports) {
  return (Number(lamports || FALLBACK_PRICES[5]) / 1000000000).toFixed(2);
}

export function shortenAddress(address = "") {
  return address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "—";
}