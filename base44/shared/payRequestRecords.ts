import { findPayLink, linkStatus, requestError, solLamports } from './payRequestRules.ts';
import { refreshPayLink } from './payRequestLifecycle.ts';
import { normalizeHandle, resolveOnChain } from './solhandleResolver.ts';
import getPayToken from './payAssets.ts';
import { requestAmountRaw } from './payRequestAmounts.ts';
export function paymentPurpose(body) {
  if (body.action === 'create_link' && body.asset == null && body.kind == null && !body.description && !body.expiresAt) return `create link\nHandle: ${String(body.handle || '')}\nAmount: ${String(body.amount || '')}`;
  if (body.action === 'create_link') return `create request\n${JSON.stringify({ handle: String(body.handle || ''), amount: String(body.amount || ''), kind: String(body.kind || 'REUSABLE'), description: String(body.description || ''), expiresAt: String(body.expiresAt || ''), ...(body.asset == null ? {} : { asset: String(body.asset) }) })}`;
  if (body.action === 'cancel_request') return `cancel request\nRequest: ${String(body.requestId || '')}`;
  return 'history';
}
export async function createPayRequest(client, rpcUrl, wallet, body) {
  const handle = normalizeHandle(body.handle), amount = String(body.amount || ''), kind = body.kind || 'REUSABLE';
  if (!/^[a-z0-9]{1,20}$/.test(handle) || !['REUSABLE', 'SINGLE_USE'].includes(kind)) throw requestError('Invalid payment request.', 400);
  const asset = body.asset || 'SOL';
  if (asset !== 'SOL') getPayToken(asset);
  const amountRaw = amount || kind === 'SINGLE_USE' ? requestAmountRaw(amount, asset) : '';
  const description = String(body.description || '').trim();
  if (description.length > 200) throw requestError('Description must be 200 characters or fewer.', 400);
  const expiry = body.expiresAt ? Date.parse(body.expiresAt) : null;
  if (body.expiresAt && (!Number.isFinite(expiry) || expiry <= Date.now())) throw requestError('Choose a future expiry date.', 400);
  const resolved = await resolveOnChain(rpcUrl, handle);
  if (!resolved?.safeForNativeSol || resolved.address !== wallet) throw requestError('You must currently own this @handle to create a payment link.', 403);
  const link = await client.entities.PayLink.create({ handle, recipient_wallet_at_creation: wallet, created_at: new Date().toISOString(), asset, requested_amount: amount, requested_amount_raw: amountRaw, requested_amount_sol: asset === 'SOL' ? amount : '', kind, description, expires_at: expiry ? new Date(expiry).toISOString() : '', status: 'OPEN' });
  return { requestId: link.id };
}
export async function handleRequestRecords(base44, rpcUrl, wallet, body) {
  const client = base44.asServiceRole;
  if (body.action === 'cancel_request') {
    const link = await findPayLink(client, body.requestId);
    if (link.recipient_wallet_at_creation !== wallet) throw requestError('Request not found for this wallet.', 404);
    const result = await client.entities.PayLink.updateMany({ id: link.id, recipient_wallet_at_creation: wallet, $or: [{ status: 'OPEN' }, { status: null }, { status: { $exists: false } }] }, { $set: { status: 'CANCELLED', cancelled_at: new Date().toISOString() } });
    if (result.updated !== 1) throw requestError('Only an open request can be cancelled. A payment awaiting confirmation must be checked first.');
    return { ok: true };
  }
  if (body.action === 'request_payments') {
    const link = await findPayLink(client, body.requestId);
    if (link.recipient_wallet_at_creation !== wallet) throw requestError('Request not found for this wallet.', 404);
    return await client.entities.Payment.filter({ request_id: link.id, receiver_wallet: wallet, status: 'CONFIRMED' }, { sort: '-confirmed_at', limit: 20, ...(body.cursor ? { cursor: body.cursor } : {}) });
  }
  const filter = { recipient_wallet_at_creation: wallet };
  if (body.filter === 'SINGLE_USE') filter.kind = 'SINGLE_USE';
  else if (body.filter === 'REUSABLE') filter.$or = [{ kind: 'REUSABLE' }, { kind: null }, { kind: { $exists: false } }];
  const page = await client.entities.PayLink.filter(filter, { sort: '-created_at', limit: 20, ...(body.cursor ? { cursor: body.cursor } : {}) });
  const items = [];
  for (let offset = 0; offset < page.items.length; offset += 5) items.push(...await Promise.all(page.items.slice(offset, offset + 5).map(async link => {
    try { return { ...await refreshPayLink(base44, rpcUrl, link), status_checked: true }; }
    catch { return { ...link, status: linkStatus(link), status_checked: false }; }
  })));
  const totals = items.length ? await client.entities.Payment.aggregate({ query: { receiver_wallet: wallet, request_id: { $in: items.map(link => link.id) }, status: 'CONFIRMED' }, groupBy: 'request_id', sum: ['amount_lamports', 'amount_tokens'] }) : { rows: [] };
  return { ...page, items: items.map(link => ({ ...link, status: linkStatus(link), kind: link.kind || 'REUSABLE', payment_count: totals.rows.find(row => row.request_id === link.id)?.count || 0, received_lamports: totals.rows.find(row => row.request_id === link.id)?.sum_amount_lamports || 0, received_tokens: totals.rows.find(row => row.request_id === link.id)?.sum_amount_tokens || 0 })) };
}