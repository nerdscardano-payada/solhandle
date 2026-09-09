import { createClientFromRequest } from "npm:@base44/sdk@0.8.46";
import { secrets } from "base44:runtime";

const short = (value = "") => value ? `${value.slice(0, 4)}…${value.slice(-4)}` : "Unknown";
const formatRarity = (value = "STANDARD") => value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req); const body = await req.json().catch(() => ({}));
    let webhookUrl = ""; let payload; let handleRecord = null;
    if (body.type === "registration") {
      webhookUrl = secrets.get("DISCORD_MINTS_WEBHOOK_URL") || "";
      const records = await base44.asServiceRole.entities.HandleIndex.filter({ id: body.handleIndexId }, "-created_date", 1); handleRecord = records[0];
      if (!handleRecord || handleRecord.status !== "active") return Response.json({ error: "Active handle not found." }, { status: 404 });
      if (handleRecord.discord_announced_at) return Response.json({ ok: true, skipped: true });
      const explorerUrl = handleRecord.asset_address ? `https://explorer.solana.com/address/${handleRecord.asset_address}` : undefined;
      payload = { username: "SolHandle", embeds: [{ title: `${handleRecord.display_handle} is now on-chain`, description: "A new SolHandle has been minted on Solana Mainnet.", color: 3973375, fields: [{ name: "Owner", value: short(handleRecord.current_owner_cached || handleRecord.original_minter), inline: true }, { name: "Rarity", value: formatRarity(handleRecord.rarity), inline: true }], url: explorerUrl, timestamp: handleRecord.minted_at || new Date().toISOString() }] };
    } else if (body.type === "developer") {
      webhookUrl = secrets.get("DISCORD_DEVELOPER_WEBHOOK_URL") || ""; const user = await base44.auth.me();
      if (!user || user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
      const message = String(body.message || "").trim(); if (!message) return Response.json({ error: "Message is required." }, { status: 400 });
      payload = { username: "SolHandle Dev", embeds: [{ title: String(body.title || "Developer update").slice(0, 100), description: message.slice(0, 1800), color: 10181046, timestamp: new Date().toISOString() }] };
    } else return Response.json({ error: "Invalid message type." }, { status: 400 });
    if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) return Response.json({ error: "Discord webhook is not configured for this channel." }, { status: 500 });
    const response = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) return Response.json({ error: "Discord rejected the message." }, { status: 502 });
    if (handleRecord) await base44.asServiceRole.entities.HandleIndex.update(handleRecord.id, { discord_announced_at: new Date().toISOString() });
    return Response.json({ ok: true });
  } catch (error) { return Response.json({ error: error.message || "Discord publication failed." }, { status: 500 }); }
}