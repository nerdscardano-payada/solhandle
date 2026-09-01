import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { secrets } from "base44:runtime";
import { deriveHandleAccountAddresses, parseNameRestrictionAccount, rpc } from "../../shared/solanaRpc.ts";
import { getFallbackSuggestions, shuffled, uniqueSuggestionRows } from "../../shared/handleSuggestionPool.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const [premiumRows, discoveryRows] = await Promise.all([
      base44.asServiceRole.entities.PremiumHandle.list("-created_date", 5000),
      base44.asServiceRole.entities.HandleDiscovery.filter({ active: true }, "-handle_score", 300)
    ]);
    const premium = new Set(premiumRows.map((row) => String(row.handle || "").toLowerCase()));
    const allRows = uniqueSuggestionRows([...discoveryRows, ...getFallbackSuggestions()]);
    const standard = shuffled(allRows.filter((row) => !premium.has(row.handle)));
    const premiumCandidates = shuffled(premiumRows.map((row) => ({ handle: String(row.handle || "").toLowerCase() })).filter((row) => /^[a-z0-9]{1,20}$/.test(row.handle)));
    const preferPremium = Math.random() < 0.2;
    const candidates = uniqueSuggestionRows(preferPremium
      ? [...premiumCandidates.slice(0, 5), ...standard.slice(0, 15)]
      : [...standard.slice(0, 16), ...premiumCandidates.slice(0, 4)]
    ).slice(0, 20);
    if (!candidates.length) return Response.json({ handle: null });

    const addresses = candidates.flatMap(({ handle }) => {
      const derived = deriveHandleAccountAddresses(handle);
      return [derived.record, derived.restriction];
    });
    const rpcUrl = secrets.get("SOLANA_RPC_URL");
    const response = await rpc(rpcUrl, "getMultipleAccounts", [addresses, { encoding: "base64", commitment: "confirmed" }]);
    const available = candidates.find(({ handle }, index) => {
      const derived = deriveHandleAccountAddresses(handle);
      const restriction = parseNameRestrictionAccount(response?.value?.[index * 2 + 1], derived.restriction);
      return !response?.value?.[index * 2] && !restriction?.active;
    });
    console.info("getRandomAvailablePremium RPC calls", { rpcCalls: 1, candidatesChecked: candidates.length, selectedClass: available && premium.has(available.handle) ? "premium" : "standard" });
    return Response.json({ handle: available?.handle || null });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to select a handle suggestion." }, { status: 500 });
  }
}