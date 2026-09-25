import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { secrets } from 'base44:runtime';
import { rpc } from '../../shared/solanaRpc.ts';
const MINT = 'BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump';
const MIN_BALANCE = 1000n;
const MINT_TARGET = 200;
const HOLDER_TARGETS = [50, 100, 200, 400];
const PRICE_TARGET_PERCENT = 150;
const tokenPrograms = new Set(['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb']);
const u64 = bytes => { let n = 0n; for (let i = 0; i < 8; i++) n |= BigInt(bytes[i]) << BigInt(i * 8); return n; };
const chunks = (values, size = 500) => Array.from({ length: Math.ceil(values.length / size) }, (_, i) => values.slice(i * size, (i + 1) * size));
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    if (body.action === 'view') {
      const cycles = await base44.entities.GrowthCycle.list('-cycle_number', 10);
      return Response.json({ cycle: cycles[0] || null, completed_cycles: cycles.slice(1), minimum_balance: Number(MIN_BALANCE), weights: { handles: 40, holders: 40, price: 20 } });
    }
    if (body.action !== 'refresh') return Response.json({ error: 'Unsupported action.' }, { status: 400 });
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden.' }, { status: 403 });
    const settings = await base44.asServiceRole.entities.TokenLaunchSettings.list('-updated_date', 1);
    if (settings[0]?.token_mint_address !== MINT) return Response.json({ error: 'Official $HANDLE mint is not configured.' }, { status: 409 });
    const [previousCycle] = await base44.asServiceRole.entities.GrowthCycle.list('-cycle_number', 1);
    let price = Number(previousCycle?.price_now_usd);
    let priceChecked = false;
    try {
      const marketResponse = await fetch(`https://api.dexscreener.com/token-pairs/v1/solana/${MINT}`);
      if (marketResponse.ok) {
        const pairs = await marketResponse.json();
        const pair = Array.isArray(pairs) ? pairs.filter(p => p.chainId === 'solana' && p.baseToken?.address === MINT && Number(p.liquidity?.usd) >= 1000 && Number(p.priceUsd) > 0).sort((a, b) => Number(b.liquidity.usd) - Number(a.liquidity.usd))[0] : null;
        if (pair) { price = Number(pair.priceUsd); priceChecked = true; }
      }
    } catch { /* Keep the last verified price when the feed is temporarily unavailable. */ }
    if (!Number.isFinite(price) || price <= 0) throw new Error('Verified $HANDLE market price unavailable; snapshot was not updated.');
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
    let cycle = previousCycle;
    if (!cycle) cycle = await base44.asServiceRole.entities.GrowthCycle.create({ cycle_number: 1, started_at: stamp, handles_start: minted, holders_start: eligible.length, handles_target: MINT_TARGET, holders_target: HOLDER_TARGETS[0], price_start_usd: price, price_now_usd: price, price_checked_at: stamp, price_target_percent: PRICE_TARGET_PERCENT, handles_now: minted, holders_now: qualified, max_progress: 0, last_checked_at: stamp });
    else {
      const changes = {};
      if (cycle.cycle_number === 1 && (cycle.handles_target === 250 || cycle.handles_target === 50)) changes.handles_target = MINT_TARGET;
      if (cycle.cycle_number === 1 && cycle.holders_target === 250) changes.holders_target = HOLDER_TARGETS[0];
      if (cycle.price_target_percent !== PRICE_TARGET_PERCENT) changes.price_target_percent = PRICE_TARGET_PERCENT;
      if (!cycle.price_checked_at && cycle.price_now_usd && cycle.last_checked_at) changes.price_checked_at = cycle.last_checked_at;
      if (cycle.cycle_number === 1 && cycle.holders_start === 0 && cycle.holders_now === 0 && eligible.length > 0) changes.holders_start = eligible.length;
      if (!cycle.price_start_usd) changes.price_start_usd = price;
      if (Object.keys(changes).length) cycle = await base44.asServiceRole.entities.GrowthCycle.update(cycle.id, changes);
      const handleShare = Math.min(1, Math.max(0, minted - cycle.handles_start) / cycle.handles_target);
      const holderShare = Math.min(1, Math.max(0, qualified - cycle.holders_start) / cycle.holders_target);
      const priceShare = Math.min(1, Math.max(0, price / cycle.price_start_usd - 1) / (cycle.price_target_percent / 100));
      const progress = Math.floor(handleShare * 40 + holderShare * 40 + priceShare * 20);
      const maxProgress = Math.max(cycle.max_progress || 0, progress);
      if (handleShare === 1 && holderShare === 1 && priceShare === 1 && priceChecked) {
        await base44.asServiceRole.entities.GrowthCycle.update(cycle.id, { handles_now: minted, holders_now: qualified, price_now_usd: price, ...(priceChecked ? { price_checked_at: stamp } : {}), max_progress: 100, last_checked_at: stamp });
        cycle = await base44.asServiceRole.entities.GrowthCycle.create({ cycle_number: cycle.cycle_number + 1, started_at: stamp, handles_start: minted, holders_start: qualified, handles_target: MINT_TARGET, holders_target: HOLDER_TARGETS[Math.min(cycle.cycle_number, HOLDER_TARGETS.length - 1)], price_start_usd: price, price_now_usd: price, price_checked_at: stamp, price_target_percent: PRICE_TARGET_PERCENT, handles_now: minted, holders_now: qualified, max_progress: 0, last_checked_at: stamp });
      } else cycle = await base44.asServiceRole.entities.GrowthCycle.update(cycle.id, { handles_now: minted, holders_now: qualified, price_now_usd: price, ...(priceChecked ? { price_checked_at: stamp } : {}), max_progress: maxProgress, last_checked_at: stamp });
    }
    return Response.json({ cycle, eligible: eligible.length, qualified });
  } catch (error) { return Response.json({ error: error.message || 'Growth snapshot failed.' }, { status: 500 }); }
}