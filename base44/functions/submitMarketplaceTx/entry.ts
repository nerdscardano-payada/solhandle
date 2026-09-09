import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { ComputeBudgetProgram, PublicKey, Transaction } from "npm:@solana/web3.js@1.98.4";
import { secrets } from "base44:runtime";
import { rpc } from "../../shared/solanaRpc.ts";
import { PROGRAM_ID } from "../../shared/solhandleProtocol.ts";
import { getHistoricalSolEur } from "../../shared/solEur.ts";

const actions = new Set(["list", "buy", "delist", "bid", "accept_bid", "cancel_bid"]);
const instructionNames = { list: "list_handle", buy: "buy_handle", delist: "delist_handle", bid: "place_bid", accept_bid: "accept_bid", cancel_bid: "cancel_bid" };
const address = (value) => new PublicKey(value).toBase58();
const sameBytes = (left, right) => left.length === right.length && left.every((byte, index) => byte === right[index]);
const readU64 = (bytes, offset) => { let value = 0n; for (let index = 0; index < 8; index += 1) value |= BigInt(bytes[offset + index]) << BigInt(index * 8); return Number(value); };

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    if (!actions.has(body.action) || typeof body.transaction_base64 !== "string") return Response.json({ error: "A supported action and signed transaction are required." }, { status: 400 });
    const raw = Uint8Array.from(atob(body.transaction_base64), (character) => character.charCodeAt(0));
    const transaction = Transaction.from(raw);
    const program = new PublicKey(PROGRAM_ID);
    const safe = new Set([ComputeBudgetProgram.programId.toBase58(), "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr", "Memo1UhkJRfHyvLMcVucJwxMyWCqXgDLGmfcHr"]);
    const protocolInstructions = transaction.instructions.filter((item) => item.programId.equals(program));
    const unsupported = transaction.instructions.filter((item) => !item.programId.equals(program) && !safe.has(item.programId.toBase58()));
    if (protocolInstructions.length !== 1 || unsupported.length) return Response.json({ error: "Transaction contains unsupported instructions." }, { status: 400 });
    const instruction = protocolInstructions[0];
    const expectedHash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`global:${instructionNames[body.action]}`))).slice(0, 8);
    if (!sameBytes(Uint8Array.from(instruction.data).slice(0, 8), expectedHash)) return Response.json({ error: "Marketplace action does not match the signed instruction." }, { status: 400 });
    const signedAmount = ["list", "bid"].includes(body.action) ? readU64(Uint8Array.from(instruction.data), 8) : Number(body.amount_lamports || 0);
    if (["list", "bid"].includes(body.action) && signedAmount !== Number(body.amount_lamports)) return Response.json({ error: "Signed marketplace amount does not match the request." }, { status: 400 });
    const signer = instruction.keys.find((key) => key.isSigner)?.pubkey.toBase58();
    if (!signer || signer !== address(body.wallet)) return Response.json({ error: "Connected wallet does not match the transaction signer." }, { status: 400 });
    const required = [body.asset, body.pda, ...(["buy", "accept_bid"].includes(body.action) ? [body.buyer, body.rewards_vault] : [])].filter(Boolean).map(address);
    const accounts = new Set(instruction.keys.map((key) => key.pubkey.toBase58()));
    if (required.some((key) => !accounts.has(key))) return Response.json({ error: "Marketplace transaction accounts do not match the request." }, { status: 400 });
    const rpcUrl = secrets.get("SOLANA_RPC_URL");
    const signature = await rpc(rpcUrl, "sendTransaction", [body.transaction_base64, { encoding: "base64", preflightCommitment: "confirmed" }]);
    let confirmed = null;
    for (let attempt = 0; attempt < 25; attempt += 1) {
      const statuses = await rpc(rpcUrl, "getSignatureStatuses", [[signature], { searchTransactionHistory: true }]);
      const status = statuses?.value?.[0];
      if (status?.err) throw new Error(`Marketplace transaction failed: ${JSON.stringify(status.err)}`);
      if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") { confirmed = status; break; }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!confirmed) throw new Error("Transaction confirmation timed out. Check Solana Explorer before retrying.");
    const now = new Date().toISOString();
    if (body.action === "list") {
      const previous = await base44.asServiceRole.entities.NativeListing.filter({ asset_address: body.asset, status: "ACTIVE" }, "-created_at", 1);
      const record = { asset_address: address(body.asset), handle: body.handle, seller: signer, price_lamports: Number(body.amount_lamports), listing_pda: address(body.pda), status: "ACTIVE", transaction_signature: signature, created_at: now };
      if (previous[0]) await base44.asServiceRole.entities.NativeListing.update(previous[0].id, record); else await base44.asServiceRole.entities.NativeListing.create(record);
    }
    if (body.action === "bid") await base44.asServiceRole.entities.NativeBid.create({ asset_address: address(body.asset), handle: body.handle, bidder: signer, amount_lamports: Number(body.amount_lamports), bid_pda: address(body.pda), status: "ACTIVE", transaction_signature: signature, created_at: now });
    if (["buy", "delist", "accept_bid"].includes(body.action)) {
      const listings = await base44.asServiceRole.entities.NativeListing.filter({ asset_address: address(body.asset), status: "ACTIVE" }, "-created_at", 10);
      if (listings.length) await base44.asServiceRole.entities.NativeListing.bulkUpdate(listings.map((row) => ({ id: row.id, status: body.action === "delist" ? "CANCELLED" : "CLOSED", closed_signature: signature, closed_at: now })));
    }
    if (["accept_bid", "cancel_bid"].includes(body.action)) {
      const bids = await base44.asServiceRole.entities.NativeBid.filter({ bid_pda: address(body.pda), status: "ACTIVE" }, "-created_at", 1);
      if (bids[0]) await base44.asServiceRole.entities.NativeBid.update(bids[0].id, { status: body.action === "accept_bid" ? "ACCEPTED" : "CANCELLED", closed_signature: signature, closed_at: now });
    }
    if (body.action === "delist") {
      const bids = await base44.asServiceRole.entities.NativeBid.filter({ asset_address: address(body.asset), status: "ACTIVE" }, "-created_at", 20);
      if (bids.length) await base44.asServiceRole.entities.NativeBid.bulkUpdate(bids.map((row) => ({ id: row.id, status: "CANCELLED", closed_signature: signature, closed_at: now })));
    }
    if (["buy", "accept_bid"].includes(body.action)) {
      const amount = Number(body.amount_lamports); const royalty = Math.floor(amount * 500 / 10000); const rate = await getHistoricalSolEur(Math.floor(Date.now() / 1000));
      const existing = await base44.asServiceRole.entities.FinancialTransaction.filter({ transaction_signature: signature }, "-timestamp", 1);
      if (!existing[0]) await base44.asServiceRole.entities.FinancialTransaction.create({ transaction_id: signature, transaction_type: "sale", handle: body.handle, buyer_wallet: address(body.buyer), transaction_signature: signature, asset_address: address(body.asset), block_slot: 0, timestamp: now, character_length: body.handle.length, premium_status: false, base_price_lamports: amount, premium_surcharge_lamports: 0, total_paid_lamports: amount, sol_eur_rate: rate, total_value_eur: amount / 1_000_000_000 * rate, mint_source: "native_marketplace", partner_id: "", partner_commission_percentage: 0, partner_fee_lamports: 0, net_solhandle_lamports: royalty, treasury_address: "", rewards_vault_address: address(body.rewards_vault), status: "completed" });
      await base44.asServiceRole.entities.HandleIndex.updateMany({ asset_address: address(body.asset) }, { $set: { current_owner_cached: address(body.buyer), last_chain_sync: now } });
    }
    return Response.json({ signature });
  } catch (error) {
    return Response.json({ error: error.message || "Marketplace transaction failed." }, { status: 500 });
  }
}