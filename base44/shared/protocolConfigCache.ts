import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { PROGRAM_ID, SEEDS } from "./solhandleProtocol.ts";
import { parseProtocolConfigAccount, rpc } from "./solanaRpc.ts";

const TTL_MS = 5 * 60 * 1000;
let memoryCache = null;

function fromRow(row, allowStale = false) {
  if (!row?.config_cached_at || (!allowStale && Date.now() - Date.parse(row.config_cached_at) > TTL_MS)) return null;
  const pricesLamports = [row.price_1_char, row.price_2_char, row.price_3_char, row.price_4_char, row.price_5_plus];
  if (!row.collection || !row.treasury || !row.rewards_vault || pricesLamports.some((value) => typeof value !== "number")) return null;
  return { authority: row.authority || "", collection: row.collection, treasury: row.treasury, rewardsVault: row.rewards_vault, pricesLamports, totalMinted: row.total_minted || 0, paused: Boolean(row.paused) };
}

export async function readProtocolConfigCache(base44) {
  if (memoryCache && Date.now() - memoryCache.cachedAt < TTL_MS) return memoryCache.protocol;
  const rows = await base44.asServiceRole.entities.ProtocolStatus.list("-config_cached_at", 1);
  const protocol = fromRow(rows[0]);
  if (protocol) memoryCache = { protocol, cachedAt: Date.parse(rows[0].config_cached_at) };
  return protocol;
}

export async function readLatestProtocolConfigCache(base44) {
  const rows = await base44.asServiceRole.entities.ProtocolStatus.list("-config_cached_at", 1);
  return fromRow(rows[0], true);
}

export async function cacheProtocolConfigAccount(base44, account) {
  const protocol = parseProtocolConfigAccount(account);
  const cachedAt = new Date().toISOString();
  const data = {
    paused: protocol.paused, authority: protocol.authority, total_minted: protocol.totalMinted, collection: protocol.collection,
    treasury: protocol.treasury, rewards_vault: protocol.rewardsVault,
    price_1_char: protocol.pricesLamports[0], price_2_char: protocol.pricesLamports[1],
    price_3_char: protocol.pricesLamports[2], price_4_char: protocol.pricesLamports[3],
    price_5_plus: protocol.pricesLamports[4], config_cached_at: cachedAt
  };
  const rows = await base44.asServiceRole.entities.ProtocolStatus.list("-config_cached_at", 1);
  if (rows[0]) await base44.asServiceRole.entities.ProtocolStatus.update(rows[0].id, data);
  else await base44.asServiceRole.entities.ProtocolStatus.create(data);
  memoryCache = { protocol, cachedAt: Date.parse(cachedAt) };
  return protocol;
}

export async function getCachedProtocolConfig(base44, rpcUrl) {
  const cached = await readProtocolConfigCache(base44);
  if (cached) return cached;
  const program = new PublicKey(PROGRAM_ID);
  const [config] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.config)], program);
  const response = await rpc(rpcUrl, "getAccountInfo", [config.toBase58(), { encoding: "base64", commitment: "confirmed" }]);
  return cacheProtocolConfigAccount(base44, response?.value);
}