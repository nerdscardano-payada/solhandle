export function parseUsdtAmount(value) {
  if (!/^\d+(\.\d{1,6})?$/.test(value) || value.length > 27) return '';
  const [whole, fraction = ''] = value.split('.');
  const amount = BigInt(whole) * 1000000n + BigInt(fraction.padEnd(6, '0'));
  return amount > 0n && amount <= 18446744073709551615n ? amount.toString() : '';
}
export function formatRawAmount(value, decimals = 6, language = 'en') {
  const raw = BigInt(value || '0'), scale = 10n ** BigInt(decimals);
  const whole = (raw / scale).toLocaleString(language);
  const fraction = (raw % scale).toString().padStart(decimals, '0').replace(/0+$/, '');
  const separator = new Intl.NumberFormat(language).formatToParts(1.1).find(part => part.type === 'decimal')?.value || '.';
  return fraction ? `${whole}${separator}${fraction}` : whole;
}
export function paymentAmountLabel(payment, language = 'en') {
  return payment.asset === 'USDT' ? `${formatRawAmount(payment.amount_raw, 6, language)} USDT` : `${(payment.amount_lamports / 1e9).toLocaleString(language, { maximumFractionDigits: 9 })} SOL`;
}