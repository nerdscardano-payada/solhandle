import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { rpc } from "./solanaRpc.ts";
import { program, core, bytes, key, pda, seed, u64, discriminator, encode58, same } from "./marketplaceRecoveryCodec.ts";
export async function recoveryConfig(url) {
  if (await rpc(url, "getGenesisHash", []) !== "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d") throw new Error("Recovery requires Solana Mainnet.");
  const result = await rpc(url, "getAccountInfo", [pda([seed("config")]).toBase58(), { encoding: "base64", commitment: "finalized" }]);
  const account = result?.value, data = account?.data?.[0] ? bytes(account.data[0]) : null;
  if (account?.owner !== program.toBase58() || data?.length !== 187 || !same(data.slice(0, 8), await discriminator("account:Config"))) throw new Error("Invalid protocol configuration.");
  const collection = new PublicKey(data.slice(40, 72)).toBase58();
  const found = await rpc(url, "getAccountInfo", [collection, { encoding: "base64", commitment: "finalized" }]);
  if (found.value?.owner !== core.toBase58() || bytes(found.value.data[0])[0] !== 5) throw new Error("Official Core collection is invalid.");
  return { collection };
}
async function scan(url, name, wallet) {
  const filters = [{ memcmp: { offset: 0, bytes: encode58(await discriminator(`account:${name}`)) } }];
  if (wallet) filters.push({ memcmp: { offset: 40, bytes: wallet } });
  return rpc(url, "getProgramAccounts", [program.toBase58(), { encoding: "base64", commitment: "finalized", withContext: true, filters }]);
}
export async function recoveryPositions(url, input) {
  const wallet = key(input.wallet), config = await recoveryConfig(url);
  const [listings, bids, records] = await Promise.all([scan(url, "MarketplaceListing", wallet), scan(url, "MarketplaceBid", wallet), scan(url, "HandleRecord")]);
  const mappings = new Map();
  for (const row of records.value) {
    const data = bytes(row.account.data[0]); if (data.length < 48) continue;
    const length = new DataView(data.buffer).getUint32(8, true); if (!length || length > 80 || data.length < 44 + length) continue;
    const handle = new TextDecoder().decode(data.slice(12, 12 + length)); if (seed(handle).length > 32) continue;
    if (pda([seed("handle"), seed(handle)]).toBase58() !== row.pubkey) continue;
    mappings.set(new PublicKey(data.slice(12 + length, 44 + length)).toBase58(), handle);
  }
  const positions = [[listings, "delist"], [bids, "cancel_bid"]].flatMap(([result, action]) => result.value.map(row => {
    const data = bytes(row.account.data[0]);
    if (data.length !== 89) throw new Error(`Unsupported recovery account layout: ${row.pubkey}. Contact support; this account has not been hidden.`);
    const asset = new PublicKey(data.slice(8, 40)), owner = new PublicKey(data.slice(40, 72));
    const expected = pda(action === "delist" ? [seed("listing"), asset.toBytes()] : [seed("bid"), asset.toBytes(), owner.toBytes()]);
    const amount = u64(data, 72), balance = BigInt(row.account.lamports);
    return { action, position: row.pubkey, wallet: owner.toBase58(), asset: asset.toBase58(), handle: mappings.get(asset.toBase58()) || "", amountLamports: amount.toString(), balanceLamports: balance.toString(), rentLamports: (action === "cancel_bid" && balance >= amount ? balance - amount : balance).toString(), expiresUnix: new DataView(data.buffer).getBigInt64(80, true).toString(), validationError: row.pubkey !== expected.toBase58() || owner.toBase58() !== wallet || !mappings.has(asset.toBase58()) ? "Position or official handle association could not be verified. Contact support." : "" };
  })).sort((a, b) => a.position.localeCompare(b.position));
  for (let index = 0; index < positions.length; index += 75) {
    const batch = positions.slice(index, index + 75);
    const result = await rpc(url, "getMultipleAccounts", [batch.map(p => p.asset), { encoding: "base64", commitment: "finalized", minContextSlot: Math.min(listings.context.slot, bids.context.slot) }]);
    batch.forEach((position, i) => {
      const account = result.value[i], data = account?.data?.[0] ? bytes(account.data[0]) : new Uint8Array();
      if (account?.owner !== core.toBase58() || data.length < 66 || data[0] !== 1 || data[33] !== 2 || new PublicKey(data.slice(34, 66)).toBase58() !== config.collection) position.validationError ||= "Official Core asset/collection could not be verified. Contact support.";
      else { position.currentOwner = new PublicKey(data.slice(1, 33)).toBase58(); if (position.action === "delist" && position.currentOwner !== wallet) position.validationError ||= "The listing seller no longer owns this NFT; cancellation may require support."; }
    });
  }
  const cursor = input.cursor == null ? 0 : Number(input.cursor);
  if (!Number.isSafeInteger(cursor) || cursor < 0) throw new Error("Invalid recovery cursor.");
  const filtered = input.position ? positions.filter(p => p.position === key(input.position)) : positions;
  return { network: "mainnet-beta", ...config, wallet, checkedAt: new Date().toISOString(), slot: Math.min(listings.context.slot, bids.context.slot), items: filtered.slice(cursor, cursor + 25), next_cursor: cursor + 25 < filtered.length ? String(cursor + 25) : null, has_more: cursor + 25 < filtered.length, total: positions.length, totalBidPrincipalLamports: positions.filter(p => p.action === "cancel_bid").reduce((sum, p) => sum + BigInt(p.amountLamports), 0n).toString() };
}