import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { getFallbackSuggestions, shuffled, uniqueSuggestionRows } from "../../shared/handleSuggestionPool.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const [premiumRows, discoveryRows, claimedRows, protectedRows] = await Promise.all([
      base44.asServiceRole.entities.PremiumHandle.list("-created_date", 5000),
      base44.asServiceRole.entities.HandleDiscovery.filter({ active: true }, "-handle_score", 300),
      base44.asServiceRole.entities.HandleIndex.filter({ status: "active" }, "-updated_date", 5000),
      base44.asServiceRole.entities.ProtectedName.filter({ status: "active" }, "-updated_date", 5000)
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
    const unavailable = new Set([
      ...claimedRows.map((row) => String(row.handle || "").toLowerCase()),
      ...protectedRows.map((row) => String(row.handle || "").toLowerCase())
    ]);
    const available = candidates.find(({ handle }) => !unavailable.has(handle));
    console.info("getRandomAvailablePremium index check", { rpcCalls: 0, candidatesChecked: candidates.length, selectedClass: available && premium.has(available.handle) ? "premium" : "standard" });
    return Response.json({ handle: available?.handle || null });
  } catch (error) {
    console.error("getRandomAvailablePremium failed", error?.stack || error?.message || String(error));
    return Response.json({ error: error?.message || "Unable to select a handle suggestion." }, { status: 500 });
  }
}