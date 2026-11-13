import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { Connection, PublicKey } from 'npm:@solana/web3.js@1.98.4';
import createIrysUploader from '../../shared/irysUploader.ts';

const reserve = 50000;
const amountSol = n => String(n / 1e9);
function parseAmount(value) {
  if (typeof value !== 'string' || !/^\d{1,2}(\.\d{1,9})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const n = Number(BigInt(whole) * 1000000000n + BigInt(fraction.padEnd(9, '0')));
  return Number.isSafeInteger(n) && n >= 1000 && n <= 100000000 ? n : null;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => e.status === 401 ? null : Promise.reject(e));
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    if (!['status', 'prepare', 'confirm'].includes(body.action)) return Response.json({ error: 'Invalid action' }, { status: 400 });
    const amount = body.action === 'prepare' ? parseAmount(body.amount_sol) : null;
    if (body.action === 'prepare' && amount === null) return Response.json({ error: 'Enter between 0.000001 and 0.1 SOL, with at most nine decimal places.' }, { status: 400 });
    if (body.action === 'confirm' && (typeof body.request_id !== 'string' || !/^[a-f0-9-]{36}$/.test(body.request_id) || body.confirmed !== true)) return Response.json({ error: 'Explicit deposit confirmation is required.' }, { status: 400 });
    const db = base44.entities.IrysStorageFunding;
    const page = await db.filter({ scope: 'IRYS_MAINNET' }, { limit: 2 });
    if (page.items.length !== 1) return Response.json({ error: 'Storage funding control needs administrator maintenance.' }, { status: 503 });
    const control = page.items[0];
    const uploader = await createIrysUploader();
    const rpc = new Connection(secrets.get('SOLANA_RPC_URL'), { commitment: 'confirmed', fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) });
    const [walletBalance, credit] = await Promise.all([rpc.getBalance(new PublicKey(uploader.address)), uploader.getLoadedBalance()]);
    if (body.action === 'status') return Response.json({ wallet: uploader.address, wallet_sol: amountSol(walletBalance), credit_sol: credit.dividedBy(1e9).toFixed(9), fee_reserve_sol: amountSol(reserve), status: control.status, transaction_id: control.transaction_id || '', message: control.message || '' });
    if (['executing', 'unknown'].includes(control.status)) return Response.json({ error: 'A previous deposit is pending or uncertain. Check balances and the uploader wallet before another deposit; funding is locked to prevent duplicates.' }, { status: 409 });
    if (body.action === 'prepare') {
      if (walletBalance < amount + reserve) return Response.json({ error: 'The uploader wallet needs enough SOL for the chosen deposit plus a 0.00005 SOL fee reserve. Your connected wallet is not used.' }, { status: 400 });
      const request_id = crypto.randomUUID(), expires_at = Date.now() + 300000;
      const claim = await db.updateMany({ id: control.id, status: control.status, request_id: control.request_id }, { $set: { status: 'prepared', request_id, operator_id: user.id, wallet: uploader.address, amount_lamports: amount, expires_at, transaction_id: '', message: '' } });
      if (claim.updated !== 1) return Response.json({ error: 'Funding state changed. Refresh before continuing.' }, { status: 409 });
      return Response.json({ request_id, expires_at, wallet: uploader.address, amount_sol: amountSol(amount) });
    }
    if (control.request_id !== body.request_id || control.operator_id !== user.id || control.status !== 'prepared' || control.expires_at <= Date.now() || control.wallet !== uploader.address) return Response.json({ error: 'This confirmation expired or was already used. Prepare a new deposit.' }, { status: 409 });
    const deposit = control.amount_lamports;
    if (!Number.isSafeInteger(deposit) || deposit < 1000 || deposit > 100000000) return Response.json({ error: 'Invalid deposit amount' }, { status: 400 });
    if (walletBalance < deposit + reserve) return Response.json({ error: 'Uploader wallet balance changed; insufficient SOL for deposit and fee reserve.' }, { status: 400 });
    if (await rpc.getGenesisHash() !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') return Response.json({ error: 'Funding requires a Solana Mainnet RPC.' }, { status: 400 });
    const claim = await db.updateMany({ id: control.id, request_id: body.request_id, operator_id: user.id, status: 'prepared', expires_at: { $gt: Date.now() }, amount_lamports: deposit, wallet: uploader.address }, { $set: { status: 'executing', message: 'Deposit in progress. Do not submit another deposit.' } });
    if (claim.updated !== 1) return Response.json({ error: 'This deposit was already submitted or expired.' }, { status: 409 });
    try {
      const receipt = await uploader.fund(deposit);
      if (!receipt?.id) throw new Error('Funding receipt was not returned');
      const transaction_id = String(receipt.id);
      await db.updateMany({ id: control.id, request_id: body.request_id, status: 'executing' }, { $set: { status: 'confirmed', transaction_id, message: 'Deposit submitted to Irys. Refresh the credit balance if it is still processing.' } });
      return Response.json({ status: 'confirmed', transaction_id, amount_sol: amountSol(deposit) });
    } catch {
      const message = 'Deposit outcome is uncertain. Do not retry: check the uploader wallet and Irys balance first. Funding remains locked to prevent a duplicate deposit.';
      await db.updateMany({ id: control.id, request_id: body.request_id, status: 'executing' }, { $set: { status: 'unknown', message } });
      return Response.json({ status: 'unknown', message }, { status: 202 });
    }
  } catch (error) {
    return Response.json({ error: error.message || 'Storage funding is unavailable' }, { status: 500 });
  }
}