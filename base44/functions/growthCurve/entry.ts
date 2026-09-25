import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { secrets } from 'base44:runtime';
import { rpc } from '../../shared/solanaRpc.ts';
const MINT = 'BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump';
const MIN_BALANCE = 1000n;
const TARGETS = [250, 500, 1000, 2500];
const tokenPrograms = new Set(['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb']);
const u64 = bytes => { let n = 0n; for (let i = 0; i < 8; i++) n |= BigInt(bytes[i]) << BigInt(i * 8); return n; };
const chunks = (values, size = 500) => Array.from({ length: Math.ceil(values.length / size) }, (_, i) => values.slice(i * size, (i + 1) * size));
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    if (body.action === 'view') {
      const cycles = await base44.entities.GrowthCycle.list('-cycle_number', 10);
      return Response.json({ cycle: cycles[0] || null, completed_cycles: cycles.slice(1), minimum_balance: Number(MIN_BALANCE) });
    }
    if (body.action !== 'refresh') return Response.json({ error: 'Unsupported action.' }, { status: 400 });
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden.' }, { status: 403 });
    const settings = await base44.asServiceRole.entities.TokenLaunchSettings.list('-updated_date', 1);
    if (settings[0]?.token_mint_address !== MINT) return Response.json({ error: 'Official $HANDLE mint is not configured.' }, { status: 409 });
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const mintAccount = await rpc(rpcUrl, 'getAccountInfo', [MINT, { encoding: 'jsonParsed', commitment: 'confirmed' }]);
    const decimals = mintAccount?.value?.data?.parsed?.info?.decimals;
    if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18 || !tokenPrograms.has(mintAccount.value.owner)) throw new Error('Could not verify official token mint and decimals.');
    const accounts = await rpc(rpcUrl, 'getProgramAccounts', [mintAccount.value.owner, { commitment: 'confirmed', encoding: 'base64', filters: [{ memcmp: { offset: 0, bytes: MINT } }], dataSlice: { offset: 32, length: 40 } }]);
    if (!Array.isArray(accounts) || accounts.length >= 5000) throw new Error('Holder scan unavailable or beyond the supported range; progress was not updated.');
    const balances = new Map();
    for (const account of accounts) {
      const encoded = account.account?.data?.[0]; if (!encoded) throw new Error('Incomplete holder snapshot.');
      const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      if (bytes.length !== 40) throw new Error('Incomplete token account.');
      const wallet = new PublicKey(bytes.slice(0, 32)).toBase58();
      balances.set(wallet, (balances.get(wallet) || 0n) + u64(bytes.slice(32, 40)));
    }
    const threshold = MIN_BALANCE * (10n ** BigInt(decimals));
    const eligible = [...balances].filter(([, balance]) => balance >= threshold).map(([wallet]) => wallet);
    const now = new Date(); const stamp = now.toISOString();
    const previous = await base44.asServiceRole.entities.GrowthHolder.list('-last_seen_at', 5000);
    if (previous.length >= 5000) throw new Error('Holder history exceeds supported range; progress was not updated.');
    const byWallet = new Map(previous.map(row => [row.wallet, row]));
    const create = [], update = [];
    let qualified = 0;
    for (const wallet of eligible) {
      const old = byWallet.get(wallet);
      const consecutive = old && now.getTime() - Date.parse(old.last_seen_at) <= 90 * 60 * 1000;
      const first = consecutive ? old.first_seen_at : stamp;
      if (consecutive && now.getTime() - Date.parse(first) >= 24 * 3600 * 1000) qualified++;
      if (old) update.push({ id: old.id, first_seen_at: first, last_seen_at: stamp });
      else create.push({ wallet, first_seen_at: stamp, last_seen_at: stamp });
    }
    const handles = await base44.asServiceRole.entities.HandleIndex.filter({ mint_price_lamports: { $gt: 0 } }, '-minted_at', 5000);
    if (handles.length >= 5000) throw new Error('Mint history exceeds supported range; progress was not updated.');
    const minted = new Set(handles.filter(h => h.mint_signature && h.minted_at && h.status !== 'pending').map(h => h.handle)).size;
    for (const batch of chunks(create)) await base44.asServiceRole.entities.GrowthHolder.bulkCreate(batch);
    for (const batch of chunks(update)) await base44.asServiceRole.entities.GrowthHolder.bulkUpdate(batch);
    const cycles = await base44.asServiceRole.entities.GrowthCycle.list('-cycle_number', 1);
    let cycle = cycles[0];
    if (!cycle) cycle = await base44.asServiceRole.entities.GrowthCycle.create({ cycle_number: 1, started_at: stamp, handles_start: minted, holders_start: eligible.length, handles_target: TARGETS[0], holders_target: TARGETS[0], handles_now: minted, holders_now: qualified, max_progress: 0, last_checked_at: stamp });
    else {
      if (cycle.cycle_number === 1 && cycle.holders_start === 0 && cycle.holders_now === 0 && eligible.length > 0) cycle = await base44.asServiceRole.entities.GrowthCycle.update(cycle.id, { holders_start: eligible.length });
      const progress = Math.floor((Math.min(1, Math.max(0, minted - cycle.handles_start) / cycle.handles_target) + Math.min(1, Math.max(0, qualified - cycle.holders_start) / cycle.holders_target)) * 50);
      const maxProgress = Math.max(cycle.max_progress || 0, progress);
      if (maxProgress === 100) {
        await base44.asServiceRole.entities.GrowthCycle.update(cycle.id, { handles_now: minted, holders_now: qualified, max_progress: 100, last_checked_at: stamp });
        cycle = await base44.asServiceRole.entities.GrowthCycle.create({ cycle_number: cycle.cycle_number + 1, started_at: stamp, handles_start: minted, holders_start: qualified, handles_target: TARGETS[Math.min(cycle.cycle_number, TARGETS.length - 1)], holders_target: TARGETS[Math.min(cycle.cycle_number, TARGETS.length - 1)], handles_now: minted, holders_now: qualified, max_progress: 0, last_checked_at: stamp });
      } else cycle = await base44.asServiceRole.entities.GrowthCycle.update(cycle.id, { handles_now: minted, holders_now: qualified, max_progress: maxProgress, last_checked_at: stamp });
    }
    return Response.json({ cycle, eligible: eligible.length, qualified });
  } catch (error) { return Response.json({ error: error.message || 'Growth snapshot failed.' }, { status: 500 }); }
}