import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { calculateHandlePrice } from '../../shared/handlePricing.ts';
import { getCachedProtocolConfig } from '../../shared/protocolConfigCache.ts';
import { getRushPricing } from '../../shared/rushPricing.ts';
import { deriveHandleAccountAddresses, rpc } from '../../shared/solanaRpc.ts';

const restrictionIsActive = (account) => {
  if (!account?.data?.[0]) return false;
  const bytes = Uint8Array.from(atob(account.data[0]), (character) => character.charCodeAt(0));
  return bytes[9] === 1;
};

export default async function(req: Request): Promise<Response> {
  try {
    const input = await req.json().catch(() => ({}));
    const length = [2, 3, 4].includes(Number(input.length)) ? Number(input.length) : 2;
    const page = Math.max(1, Number(input.page) || 1);
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const [first, second, third, protocol, rush, premiumRows, protectedRows] = await Promise.all([
      base44.asServiceRole.entities.PremiumDirectoryHandle.filter({}, 'Rank', 500, 0),
      base44.asServiceRole.entities.PremiumDirectoryHandle.filter({}, 'Rank', 500, 500),
      base44.asServiceRole.entities.PremiumDirectoryHandle.filter({}, 'Rank', 500, 1000),
      getCachedProtocolConfig(base44, rpcUrl),
      getRushPricing(rpcUrl),
      base44.asServiceRole.entities.PremiumHandle.list('-created_date', 5000),
      base44.asServiceRole.entities.ProtectedName.filter({ status: 'active' }, '-updated_date', 5000)
    ]);
    const allForLength = [...first, ...second, ...third]
      .filter((row) => String(row.Handle || '').length === length)
      .sort((a, b) => Number(a.Rank) - Number(b.Rank));
    const categories = [...new Set(allForLength.map((row) => row.Category).filter(Boolean))].sort();
    const filtered = allForLength.filter((row) => (!input.tier || row.Tier === input.tier) && (!input.category || row.Category === input.category));
    const batchSize = 48;
    const candidates = filtered.slice((page - 1) * batchSize, page * batchSize);
    const addresses = candidates.flatMap((row) => {
      const derived = deriveHandleAccountAddresses(String(row.Handle));
      return [derived.record, derived.restriction];
    });
    const accountData = addresses.length ? await rpc(rpcUrl, 'getMultipleAccounts', [addresses, { encoding: 'base64', commitment: 'confirmed' }]) : { value: [] };
    const premium = new Set(premiumRows.map((row) => row.handle));
    const protectedNames = new Set(protectedRows.map((row) => row.handle));
    const available = candidates.filter((row, index) => !accountData.value[index * 2] && !restrictionIsActive(accountData.value[index * 2 + 1]) && !protectedNames.has(row.Handle));
    const handles = available.map((row) => {
      const pricing = calculateHandlePrice(row.Handle, protocol.pricesLamports, premium.has(row.Handle), rush);
      return { handle: row.Handle, display: row.Display, rank: row.Rank, tier: row.Tier, score: row.Score, category: row.Category, reason: row['Why it ranks'], priceLamports: pricing.finalPriceLamports, premium: pricing.isPremium, rushActive: pricing.rushActive };
    });
    return Response.json({ handles, categories, page, hasMore: page * batchSize < filtered.length, checked: candidates.length, length });
  } catch (error) {
    console.error('getPremiumDirectory failed', error?.stack || error?.message || String(error));
    return Response.json({ error: error?.message || 'Unable to load the premium directory.' }, { status: 500 });
  }
}