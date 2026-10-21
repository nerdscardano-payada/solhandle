const prefix = 'solhandle_marketplace_recovery_v1:';
export function readAttempts(wallet) {
  if (!wallet) return [];
  const value = localStorage.getItem(prefix + wallet);
  if (!value) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error('Saved recovery history is unreadable. Do not sign another cancellation; contact support.');
  return parsed;
}
export function saveAttempt(wallet, attempt) {
  const rows = readAttempts(wallet), index = rows.findIndex(row => row.signature === attempt.signature);
  if (index < 0) rows.push(attempt); else rows[index] = { ...rows[index], ...attempt };
  localStorage.setItem(prefix + wallet, JSON.stringify(rows));
  return rows;
}
export function signature58(data) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let n = 0n, out = ''; for (const value of data) n = n * 256n + BigInt(value);
  while (n) { out = alphabet[Number(n % 58n)] + out; n /= 58n; }
  for (const value of data) { if (value) break; out = '1' + out; } return out;
}
export function formatRecoverySol(value) {
  const signed = BigInt(value || '0'), amount = signed < 0n ? -signed : signed;
  const fraction = (amount % 1000000000n).toString().padStart(9, '0').replace(/0+$/, '');
  return `${signed < 0n ? '-' : ''}${amount / 1000000000n}${fraction ? '.' + fraction : ''}`;
}