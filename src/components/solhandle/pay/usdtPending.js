export const usdtPendingKey = (wallet, asset = 'USDT') => `solhandle_${asset.toLowerCase()}_pending:${wallet}`;
export function readUsdtPending(wallet, asset = 'USDT') {
  if (!wallet) return null;
  const value = localStorage.getItem(usdtPendingKey(wallet, asset));
  if (!value) return null;
  try { const pending = JSON.parse(value); return pending.senderWallet === wallet && pending.asset === asset ? pending : null; } catch { return null; }
}
export function usdtSignature(bytes) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let value = 0n, result = '';
  for (const byte of bytes) value = value * 256n + BigInt(byte);
  while (value) { result = alphabet[Number(value % 58n)] + result; value /= 58n; }
  for (const byte of bytes) { if (byte !== 0) break; result = '1' + result; }
  return result;
}