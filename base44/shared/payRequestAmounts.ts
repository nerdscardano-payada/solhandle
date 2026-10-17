import getPayToken from './payAssets.ts';
import { requestError, solLamports } from './payRequestRules.ts';
export const requestCurrency = link => link.asset || 'SOL';
export const requestAmountText = link => requestCurrency(link) === 'SOL' ? link.requested_amount_sol || '' : link.requested_amount || '';
export function requestAmountRaw(value, asset) {
  if (asset === 'SOL') return String(solLamports(value));
  const token = getPayToken(asset), text = String(value || '');
  if (text.length > 27 || !/^\d+(\.\d{1,6})?$/.test(text)) throw requestError(`Enter a positive ${token.asset} amount with up to 6 decimal places.`, 400);
  const [whole, fraction = ''] = text.split('.');
  const raw = BigInt(whole) * 1000000n + BigInt(fraction.padEnd(6, '0'));
  if (raw <= 0n || raw > 18446744073709551615n) throw requestError('Invalid token amount.', 400);
  return raw.toString();
}
export function matchTokenPayRequest(link, context) {
  if (!link) return;
  if (requestCurrency(link) !== context.asset || link.handle !== context.handle || (context.recipient && link.recipient_wallet_at_creation !== context.recipient)) throw requestError('This payment does not match the request currency or original recipient.', 400);
  if (link.kind === 'SINGLE_USE' && link.requested_amount_raw !== context.amountRaw) throw requestError('The amount must match the fixed amount on this payment request.', 400);
}