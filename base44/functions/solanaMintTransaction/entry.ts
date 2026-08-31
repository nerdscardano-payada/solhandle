import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { ComputeBudgetProgram, PublicKey, SystemProgram, Transaction } from "npm:@solana/web3.js@1.98.4";
import { secrets } from "base44:runtime";
import { rpc, getProtocolConfig } from "../../shared/solanaRpc.ts";
import { PROGRAM_ID, SEEDS } from "../../shared/solhandleProtocol.ts";
import { calculateHandlePrice, normalizeHandle } from "../../shared/handlePricing.ts";

function decodeBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function mintDiscriminator() {
  const input = new TextEncoder().encode("global:mint_handle");
  return new Uint8Array(await crypto.subtle.digest("SHA-256", input)).slice(0, 8);
}

function equalBytes(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function readU32(bytes, offset) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}

function readU64(bytes, offset) {
  return Number(new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getBigUint64(offset, true));
}

function parseMintData(data) {
  const handleLength = readU32(data, 8);
  const handleStart = 12;
  const handle = new TextDecoder().decode(data.slice(handleStart, handleStart + handleLength));
  const uriLengthOffset = handleStart + handleLength;
  const uriLength = readU32(data, uriLengthOffset);
  const maxPriceOffset = uriLengthOffset + 4 + uriLength;
  return { handle: normalizeHandle(handle), maxPriceLamports: readU64(data, maxPriceOffset) };
}

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get("SOLANA_RPC_URL");
    const program = new PublicKey(PROGRAM_ID);
    const [config] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.config)], program);

    if (body.action === "prepare") {
      const handle = normalizeHandle(body.handle);
      if (!/^[a-z0-9]{1,20}$/.test(handle)) return Response.json({ error: "Invalid handle." }, { status: 400 });
      const [protocol, premiumRows, latest] = await Promise.all([
        getProtocolConfig(rpcUrl),
        base44.asServiceRole.entities.PremiumHandle.filter({ handle }, '-updated_date', 1),
        rpc(rpcUrl, "getLatestBlockhash", [{ commitment: "confirmed" }])
      ]);
      if (protocol.paused) return Response.json({ error: "SolHandle minting is currently paused." }, { status: 409 });
      const pricing = calculateHandlePrice(handle, protocol.pricesLamports, premiumRows.length > 0);
      return Response.json({
        config: config.toBase58(),
        collection: protocol.collection,
        treasury: protocol.treasury,
        basePriceLamports: pricing.basePriceLamports,
        premiumSurchargeLamports: pricing.premiumSurchargeLamports,
        finalPriceLamports: pricing.finalPriceLamports,
        premium: pricing.isPremium,
        blockhash: latest.value.blockhash,
        lastValidBlockHeight: latest.value.lastValidBlockHeight
      });
    }

    if (body.action === "submit") {
      if (typeof body.transaction_base64 !== "string") return Response.json({ error: "Signed transaction is required." }, { status: 400 });
      const transaction = Transaction.from(decodeBase64(body.transaction_base64));
      const walletPrograms = new Set([
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
        "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo",
        "L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95"
      ]);
      const protocolInstructions = transaction.instructions.filter((instruction) => instruction.programId.equals(program));
      const systemInstructions = transaction.instructions.filter((instruction) => instruction.programId.equals(SystemProgram.programId));
      const unsupported = transaction.instructions.filter((instruction) => !instruction.programId.equals(program) && !instruction.programId.equals(SystemProgram.programId) && !instruction.programId.equals(ComputeBudgetProgram.programId) && !walletPrograms.has(instruction.programId.toBase58()));
      if (protocolInstructions.length !== 1 || unsupported.length > 0) return Response.json({ error: "Only one SolHandle mint instruction with approved wallet verification is allowed." }, { status: 400 });

      const instruction = protocolInstructions[0];
      const expectedDiscriminator = await mintDiscriminator();
      if (!equalBytes(instruction.data.slice(0, 8), expectedDiscriminator)) return Response.json({ error: "Only public handle mint transactions are allowed." }, { status: 400 });
      if (!transaction.feePayer || instruction.keys[0]?.pubkey.toBase58() !== transaction.feePayer.toBase58() || !instruction.keys[0]?.isSigner) return Response.json({ error: "The connected wallet must be the mint payer." }, { status: 400 });
      if (instruction.keys[1]?.pubkey.toBase58() !== config.toBase58()) return Response.json({ error: "Invalid protocol configuration account." }, { status: 400 });

      const mintData = parseMintData(instruction.data);
      if (!/^[a-z0-9]{1,20}$/.test(mintData.handle)) return Response.json({ error: "Invalid mint handle." }, { status: 400 });
      const [protocol, premiumRows] = await Promise.all([
        getProtocolConfig(rpcUrl),
        base44.asServiceRole.entities.PremiumHandle.filter({ handle: mintData.handle }, '-updated_date', 1)
      ]);
      const pricing = calculateHandlePrice(mintData.handle, protocol.pricesLamports, premiumRows.length > 0);
      if (mintData.maxPriceLamports !== pricing.finalPriceLamports) return Response.json({ error: "The signed mint price does not match the official handle price." }, { status: 400 });
      if (instruction.keys[6]?.pubkey.toBase58() !== protocol.collection || instruction.keys[7]?.pubkey.toBase58() !== protocol.treasury) return Response.json({ error: "Invalid collection or treasury account." }, { status: 400 });

      if (pricing.isPremium) {
        const transfer = systemInstructions[0];
        const validTransfer = systemInstructions.length === 1 && readU32(transfer.data, 0) === 2 && readU64(transfer.data, 4) === pricing.premiumSurchargeLamports && transfer.keys[0]?.pubkey.toBase58() === transaction.feePayer.toBase58() && transfer.keys[1]?.pubkey.toBase58() === protocol.treasury;
        if (!validTransfer) return Response.json({ error: "The required 1 SOL Premium surcharge is missing or invalid." }, { status: 400 });
      } else if (systemInstructions.length > 0) {
        return Response.json({ error: "Unexpected payment instruction for a Standard handle." }, { status: 400 });
      }

      const signature = await rpc(rpcUrl, "sendTransaction", [body.transaction_base64, { encoding: "base64", preflightCommitment: "confirmed" }]);
      for (let attempt = 0; attempt < 25; attempt += 1) {
        const statuses = await rpc(rpcUrl, "getSignatureStatuses", [[signature], { searchTransactionHistory: true }]);
        const status = statuses?.value?.[0];
        if (status?.err) throw new Error(`Solana transaction failed: ${JSON.stringify(status.err)}`);
        if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") return Response.json({ signature });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      throw new Error("Transaction confirmation timed out. Check Solana Explorer before retrying.");
    }

    return Response.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message || "Solana mint transaction failed." }, { status: 500 });
  }
}