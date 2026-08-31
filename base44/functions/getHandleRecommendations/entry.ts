import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { secrets } from "base44:runtime";
import { calculateHandlePrice, normalizeHandle } from "../../shared/handlePricing.ts";
import { getProtocolConfig, PROGRAM_ID, rpc } from "../../shared/solanaRpc.ts";
import { SEEDS } from "../../shared/solhandleProtocol.ts";

const overlap = (left = [], right = []) => left.filter((value) => right.includes(value)).length;
const scoreCandidate = (source, candidate) => overlap(source?.categories, candidate.categories) * 30 + Math.min(30, overlap(source?.tags, candidate.tags) * 10) + (Math.abs((source?.handle || "").length - candidate.handle.length) <= 1 ? 5 : 0) + (source?.handle?.[0] === candidate.handle[0] ? 4 : 0) + Number(candidate.handle_score || 0) * 0.15;
const restrictionIsActive = (account) => { if (!account?.data?.[0]) return false; const bytes = Uint8Array.from(atob(account.data[0]), (character) => character.charCodeAt(0)); return bytes[9] === 1; };

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const handle = normalizeHandle(body.handle);
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ error: "Invalid handle." }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const rows = await base44.asServiceRole.entities.HandleDiscovery.filter({ active: true }, "-handle_score", 500);
    const source = rows.find((row) => row.handle === handle) || { handle, categories: ["identity"], tags: ["personal", "solana"] };
    const candidates = rows.filter((row) => row.handle !== handle && /^[a-z0-9]{1,20}$/.test(row.handle)).sort((a, b) => scoreCandidate(source, b) - scoreCandidate(source, a)).slice(0, 45);
    const rpcUrl = secrets.get("SOLANA_RPC_URL");
    const [protocol, premiumRows] = await Promise.all([getProtocolConfig(rpcUrl), base44.asServiceRole.entities.PremiumHandle.list("-created_date", 5000)]);
    const program = new PublicKey(PROGRAM_ID); const encoder = new TextEncoder();
    const accounts = candidates.flatMap((candidate) => {
      const seed = encoder.encode(candidate.handle);
      const [record] = PublicKey.findProgramAddressSync([encoder.encode(SEEDS.handle), seed], program);
      const [restriction] = PublicKey.findProgramAddressSync([encoder.encode(SEEDS.restriction), seed], program);
      return [record.toBase58(), restriction.toBase58()];
    });
    const accountData = accounts.length ? await rpc(rpcUrl, "getMultipleAccounts", [accounts, { encoding: "base64", commitment: "confirmed" }]) : { value: [] };
    const premium = new Set(premiumRows.map((row) => row.handle));
    const recommendations = candidates.filter((candidate, index) => !accountData.value[index * 2] && !restrictionIsActive(accountData.value[index * 2 + 1])).slice(0, 6).map((candidate) => {
      const pricing = calculateHandlePrice(candidate.handle, protocol.pricesLamports, premium.has(candidate.handle));
      return { handle: candidate.handle, available: true, premium: pricing.isPremium, priceLamports: pricing.finalPriceLamports, categories: candidate.categories, tags: candidate.tags, recommendationScore: Math.round(scoreCandidate(source, candidate)) };
    });
    return Response.json({ handle, categories: source.categories, tags: source.tags, recommendations });
  } catch (error) { return Response.json({ error: error.message || "Unable to load recommendations." }, { status: 500 }); }
}