import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { secrets } from "base44:runtime";
import { findHandleOnChain, getNameRestriction } from "../../shared/solanaRpc.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const premiumRows = await base44.asServiceRole.entities.PremiumHandle.list("-created_date", 5000);
    const candidates = premiumRows
      .map((row) => row.handle)
      .filter((handle) => /^[a-z0-9]{1,20}$/.test(handle))
      .sort(() => Math.random() - 0.5);
    const rpcUrl = secrets.get("SOLANA_RPC_URL");

    for (let index = 0; index < candidates.length; index += 10) {
      const checks = await Promise.all(candidates.slice(index, index + 10).map(async (handle) => {
        const [chainRecord, restriction] = await Promise.all([
          findHandleOnChain(rpcUrl, handle),
          getNameRestriction(rpcUrl, handle)
        ]);
        return !chainRecord && !restriction?.active ? handle : null;
      }));
      const availableHandle = checks.find(Boolean);
      if (availableHandle) return Response.json({ handle: availableHandle });
    }

    return Response.json({ handle: null });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to select a premium handle." }, { status: 500 });
  }
}