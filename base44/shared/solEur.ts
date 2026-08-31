async function getJson(url: string) {
  const response = await fetch(url, { headers: { Accept: "application/json", "User-Agent": "SolHandle/1.0" } });
  const text = await response.text();
  if (!response.ok) throw new Error(`SOL/EUR price service returned HTTP ${response.status}: ${text.slice(0, 180)}`);
  return JSON.parse(text);
}

export async function getCurrentSolEur() {
  const data = await getJson("https://query1.finance.yahoo.com/v8/finance/chart/SOL-EUR?range=1d&interval=1m");
  const rate = Number(data?.chart?.result?.[0]?.meta?.regularMarketPrice);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("A valid current SOL/EUR rate was not available.");
  return rate;
}

export async function getHistoricalSolEur(unixSeconds: number) {
  const from = Math.max(0, unixSeconds - 180);
  const to = unixSeconds + 180;
  const data = await getJson(`https://query1.finance.yahoo.com/v8/finance/chart/SOL-EUR?period1=${from}&period2=${to}&interval=1m`);
  const result = data?.chart?.result?.[0];
  const times = Array.isArray(result?.timestamp) ? result.timestamp : [];
  const closes = result?.indicators?.quote?.[0]?.close || [];
  const points = times.map((time, index) => [time, closes[index]]).filter((point) => Number.isFinite(Number(point[1])));
  if (!points.length) throw new Error("A historical SOL/EUR rate was not available for this mint.");
  const nearest = points.reduce((best, point) => Math.abs(point[0] - unixSeconds) < Math.abs(best[0] - unixSeconds) ? point : best);
  const rate = Number(nearest[1]);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("The historical SOL/EUR rate was invalid.");
  return rate;
}