export const PREMIUM_SURCHARGE_LAMPORTS = 1_000_000_000;

export function normalizeHandle(value: unknown) {
  return String(value || '').trim().replace(/^@+/, '').toLowerCase();
}

export function calculateHandlePrice(handleValue: unknown, pricesLamports: number[], isPremium: boolean) {
  const handle = normalizeHandle(handleValue);
  const length = handle.length;
  const basePriceLamports = Number(pricesLamports[Math.min(Math.max(length, 1), 5) - 1]);
  const premiumSurchargeLamports = isPremium ? PREMIUM_SURCHARGE_LAMPORTS : 0;
  return {
    handle,
    length,
    isPremium,
    basePriceLamports,
    premiumSurchargeLamports,
    finalPriceLamports: basePriceLamports + premiumSurchargeLamports
  };
}