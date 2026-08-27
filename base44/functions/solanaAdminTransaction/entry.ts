import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { ComputeBudgetProgram, PublicKey, Transaction } from "npm:@solana/web3.js@1.98.4";
import { secrets } from "base44:runtime";
import { rpc } from "../../shared/solanaRpc.ts";
import { PROGRAM_ID, SEEDS } from "../../shared/solhandleProtocol.ts";

function encodeBase58(bytes) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let value = 0n;
  for (const byte of bytes) value = (value << 8n) + BigInt(byte);
  let result = "";
  while (value > 0n) { result = alphabet[Number(value % 58n)] + result; value /= 58n; }
  for (const byte of bytes) { if (byte === 0) result = "1" + result; else break; }
  return result || "1";
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const rpcUrl = secrets.get("SOLANA_RPC_URL");
    const program = new PublicKey(PROGRAM_ID);
    const [config] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.config)], program);

    if (body.action === "prepare") {
      const account = await rpc(rpcUrl, "getAccountInfo", [config.toBase58(), { encoding: "base64", commitment: "confirmed" }]);
      if (!account?.value?.data?.[0] || account.value.owner !== PROGRAM_ID) throw new Error("SolHandle V2 is not initialized on Solana Mainnet-beta.");
      const binary = atob(account.value.data[0]);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const latest = await rpc(rpcUrl, "getLatestBlockhash", [{ commitment: "confirmed" }]);
      return Response.json({
        config: config.toBase58(),
        authority: encodeBase58(bytes.slice(8, 40)),
        collection: encodeBase58(bytes.slice(40, 72)),
        blockhash: latest.value.blockhash,
        lastValidBlockHeight: latest.value.lastValidBlockHeight
      });
    }

    if (body.action === "submit") {
      if (typeof body.transaction_base64 !== "string") return Response.json({ error: "Signed transaction is required." }, { status: 400 });
      const raw = Uint8Array.from(atob(body.transaction_base64), (character) => character.charCodeAt(0));
      const transaction = Transaction.from(raw);
      const protocolInstructions = transaction.instructions.filter((instruction) => instruction.programId.equals(program));
      const unsupportedInstructions = transaction.instructions.filter((instruction) => !instruction.programId.equals(program) && !instruction.programId.equals(ComputeBudgetProgram.programId));
      if (protocolInstructions.length !== 1 || unsupportedInstructions.length > 0) return Response.json({ error: "The signed transaction contains unsupported instructions." }, { status: 400 });
      const signature = await rpc(rpcUrl, "sendTransaction", [body.transaction_base64, { encoding: "base64", preflightCommitment: "confirmed" }]);
      for (let attempt = 0; attempt < 25; attempt += 1) {
        const statuses = await rpc(rpcUrl, "getSignatureStatuses", [[signature], { searchTransactionHistory: true }]);
        const status = statuses?.value?.[0];
        if (status?.err) throw new Error(`Solana transaction failed: ${JSON.stringify(status.err)}`);
        if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") return Response.json({ signature });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      throw new Error("Transaction confirmation timed out. Check the signature in Solana Explorer before retrying.");
    }

    return Response.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message || "Solana transaction failed." }, { status: 500 });
  }
}