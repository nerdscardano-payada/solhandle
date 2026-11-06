const ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export async function magicEdenListingCheck(asset) {
  if (!ADDRESS.test(String(asset || ''))) return { error: 'Missing or invalid asset address.' };
  try {
    const response = await fetch(`https://api-mainnet.magiceden.dev/v2/tokens/${asset}/listings?listingAggMode=false`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      const retry = response.headers.get('retry-after');
      const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : (Date.parse(retry || '') - Date.now()) / 1000;
      return { error: `Magic Eden HTTP ${response.status}`, rateLimited: response.status === 429, cooldown: Number.isFinite(seconds) && seconds > 0 ? Math.max(900, seconds) : 900 };
    }
    const rows = await response.json();
    if (!Array.isArray(rows)) return { error: 'Unexpected Magic Eden response; previous listing preserved.' };
    if (!rows.length) return { listing: null };
    const listing = rows.filter(row => row.tokenMint === asset && Number.isFinite(Number(row.price)) && Number(row.price) > 0 && ADDRESS.test(String(row.seller || ''))).sort((a, b) => Number(a.price) - Number(b.price))[0];
    if (!listing) return { error: 'Unrecognized listing data; previous listing preserved.' };
    return { listing };
  } catch (error) {
    return { error: error.name === 'TimeoutError' || error.name === 'AbortError' ? 'Magic Eden request timed out.' : 'Magic Eden request failed.' };
  }
}