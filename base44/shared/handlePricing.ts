export const PREMIUM_SURCHARGE_LAMPORTS = 1_000_000_000;

export function normalizeHandle(value: unknown) {
  return String(value || '').trim().replace(/^@+/, '').toLowerCase();
}

export function calculateHandlePrice(handleValue: unknown, pricesLamports: number[], isPremium: boolean, rush = null) {
  const handle = normalizeHandle(handleValue);
  const length = handle.length;
  const normalBasePrice = Number(pricesLamports[Math.min(Math.max(length, 1), 5) - 1]);
  const now = Math.floor(Date.now() / 1000);
  const rushActive = Boolean(rush?.enabled && now >= rush.startAt && now < rush.endAt);
  const basePriceLamports = rushActive
    ? length >= 3 ? rush.standardPriceLamports : Math.floor(normalBasePrice * rush.shortDiscountBps / 10_000)
    : normalBasePrice;
  const premiumSurchargeLamports = isPremium ? (rushActive ? rush.premiumSurchargeLamports : PREMIUM_SURCHARGE_LAMPORTS) : 0;
  return {
    handle,
    length,
    isPremium,
    rushActive,
    basePriceLamports,
    premiumSurchargeLamports,
    finalPriceLamports: basePriceLamports + premiumSurchargeLamports
  };
}