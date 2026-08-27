import { ComputeBudgetProgram, PublicKey, Transaction } from "npm:@solana/web3.js@1.98.4";
import { secrets } from "base44:runtime";
import { rpc, getProtocolConfig } from "../../shared/solanaRpc.ts";
import { PROGRAM_ID, SEEDS } from "../../shared/solhandleProtocol.ts";

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

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const rpcUrl = secrets.get("SOLANA_RPC_URL");
    const program = new PublicKey(PROGRAM_ID);
    const [config] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.config)], program);

    if (body.action === "prepare") {
      const protocol = await getProtocolConfig(rpcUrl);
      if (protocol.paused) return Response.json({ error: "SolHandle minting is currently paused." }, { status: 409 });
      const latest = await rpc(rpcUrl, "getLatestBlockhash", [{ commitment: "confirmed" }]);
      return Response.json({
        config: config.toBase58(),
        collection: protocol.collection,
        treasury: protocol.treasury,
        blockhash: latest.value.blockhash,
        lastValidBlockHeight: latest.value.lastValidBlockHeight
      });
    }

    if (body.action === "submit") {
      if (typeof body.transaction_base64 !== "string") return Response.json({ error: "Signed transaction is required." }, { status: 400 });
      const transaction = Transaction.from(decodeBase64(body.transaction_base64));
      const protocolInstructions = transaction.instructions.filter((instruction) => instruction.programId.equals(program));
      const unsupported = transaction.instructions.filter((instruction) => !instruction.programId.equals(program) && !instruction.programId.equals(ComputeBudgetProgram.programId));
      if (protocolInstructions.length !== 1 || unsupported.length > 0) return Response.json({ error: "Only one SolHandle mint instruction is allowed." }, { status: 400 });

      const instruction = protocolInstructions[0];
      const expectedDiscriminator = await mintDiscriminator();
      if (!equalBytes(instruction.data.slice(0, 8), expectedDiscriminator)) return Response.json({ error: "Only public handle mint transactions are allowed." }, { status: 400 });
      if (!transaction.feePayer || instruction.keys[0]?.pubkey.toBase58() !== transaction.feePayer.toBase58() || !instruction.keys[0]?.isSigner) return Response.json({ error: "The connected wallet must be the mint payer." }, { status: 400 });
      if (instruction.keys[1]?.pubkey.toBase58() !== config.toBase58()) return Response.json({ error: "Invalid protocol configuration account." }, { status: 400 });

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