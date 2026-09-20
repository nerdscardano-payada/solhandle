import { createClientFromRequest } from "npm:@base44/sdk@0.8.46";
import { secrets } from "base44:runtime";
import { getReferralSettings } from "../../shared/referralEngine.ts";
import { recordOriginRevenue } from "../../shared/earnNetwork.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const source = body.source === "CREATOR_FEE" ? "CREATOR_FEE" : body.source === "SECONDARY_ROYALTY" ? "SECONDARY_ROYALTY" : "";
    const signature = String(body.signature || "").trim();
    const actualReceivedLamports = Number(body.actual_received_lamports || 0);
    if (!source || !/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(signature) || !Number.isSafeInteger(actualReceivedLamports) || actualReceivedLamports <= 0) return Response.json({ error: "A valid source, transaction signature and actual received amount are required." }, { status: 400 });
    const assetAddress = String(body.asset_address || "");
    const referredWallet = String(body.referred_wallet || "");
    if (!assetAddress && !referredWallet) return Response.json({ error: "Asset address or referred wallet is required." }, { status: 400 });
    const settings = await getReferralSettings(base44);
    const result = await recordOriginRevenue(base44, settings, { source, signature, assetAddress, referredWallet, handle: body.handle, grossActivityLamports: Number(body.gross_activity_lamports || 0), actualReceivedLamports, occurredAt: String(body.occurred_at || "") }, secrets.get("SOLANA_RPC_URL"));
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message || "Unable to record Earn Network revenue." }, { status: 500 });
  }
}