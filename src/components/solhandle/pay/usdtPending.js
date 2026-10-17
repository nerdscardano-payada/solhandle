export const usdtPendingKey = wallet => `solhandle_usdt_pending:${wallet}`;
export function readUsdtPending(wallet) {
  if (!wallet) return null;
  const value = localStorage.getItem(usdtPendingKey(wallet));
  if (!value) return null;
  try { const pending = JSON.parse(value); return pending.senderWallet === wallet && pending.asset === 'USDT' ? pending : null; } catch { return null; }
}
export function usdtSignature(bytes) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let value = 0n, result = '';
  for (const byte of bytes) value = value * 256n + BigInt(byte);
  while (value) { result = alphabet[Number(value % 58n)] + result; value /= 58n; }
  for (const byte of bytes) { if (byte !== 0) break; result = '1' + result; }
  return result;
}