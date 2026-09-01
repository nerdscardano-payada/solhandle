import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { secrets } from "base44:runtime";
import { deriveHandleAccountAddresses, parseNameRestrictionAccount, rpc } from "../../shared/solanaRpc.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const premiumRows = await base44.asServiceRole.entities.PremiumHandle.list("-created_date", 5000);
    const candidates = premiumRows.map((row) => row.handle).filter((handle) => /^[a-z0-9]{1,20}$/.test(handle)).sort(() => Math.random() - 0.5);
    const rpcUrl = secrets.get("SOLANA_RPC_URL");
    let rpcCalls = 0;

    for (let index = 0; index < candidates.length; index += 10) {
      const batch = candidates.slice(index, index + 10);
      const addresses = batch.flatMap((handle) => {
        const derived = deriveHandleAccountAddresses(handle);
        return [derived.record, derived.restriction];
      });
      const response = await rpc(rpcUrl, "getMultipleAccounts", [addresses, { encoding: "base64", commitment: "confirmed" }]);
      rpcCalls += 1;
      const availableHandle = batch.find((handle, candidateIndex) => {
        const derived = deriveHandleAccountAddresses(handle);
        const restriction = parseNameRestrictionAccount(response?.value?.[candidateIndex * 2 + 1], derived.restriction);
        return !response?.value?.[candidateIndex * 2] && !restriction?.active;
      });
      if (availableHandle) {
        console.info("getRandomAvailablePremium RPC calls", { rpcCalls, candidatesChecked: Math.min(index + batch.length, candidates.length) });
        return Response.json({ handle: availableHandle });
      }
    }

    console.info("getRandomAvailablePremium RPC calls", { rpcCalls, candidatesChecked: candidates.length });
    return Response.json({ handle: null });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to select a premium handle." }, { status: 500 });
  }
}