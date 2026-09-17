import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { PublicKey, Transaction } from "npm:@solana/web3.js@1.98.4";
import { secrets } from "base44:runtime";
import { rpc } from "../../shared/solanaRpc.ts";
import { PROGRAM_ID, SEEDS } from "../../shared/solhandleProtocol.ts";

const actions = new Set(["list", "buy", "delist", "bid", "accept_bid", "cancel_bid"]);

export default async function(req: Request): Promise<Response> {
  try {
    createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    if (!actions.has(body.action)) return Response.json({ error: "Unsupported marketplace action." }, { status: 400 });
    if (typeof body.wallet !== "string" || typeof body.handle !== "string" || !/^[a-z0-9]{1,20}$/.test(body.handle)) return Response.json({ error: "A valid wallet and handle are required." }, { status: 400 });
    const wallet = new PublicKey(body.wallet);
    const program = new PublicKey(PROGRAM_ID);
    if (typeof body.transaction_base64 === "string") {
      const raw = Uint8Array.from(atob(body.transaction_base64), (character) => character.charCodeAt(0));
      const transaction = Transaction.from(raw);
      const protocolInstructions = transaction.instructions.filter((item) => item.programId.equals(program));
      if (protocolInstructions.length !== 1 || transaction.instructions.length !== 1) return Response.json({ error: "Marketplace preflight rejected an unexpected transaction." }, { status: 400 });
      if (!transaction.feePayer?.equals(wallet)) return Response.json({ error: "Connected wallet does not match the transaction fee payer." }, { status: 400 });
      const simulation = await rpc(secrets.get("SOLANA_RPC_URL"), "simulateTransaction", [body.transaction_base64, { encoding: "base64", sigVerify: false, replaceRecentBlockhash: true, commitment: "confirmed" }]);
      if (simulation?.value?.err) {
        const rentError = simulation.value.err?.InsufficientFundsForRent;
        if (rentError && Number.isInteger(rentError.account_index)) {
          const account = transaction.compileMessage().accountKeys[rentError.account_index]?.toBase58();
          return Response.json({ error: `Insufficient SOL for the rent-exempt marketplace account${account ? ` (${account})` : ""}. Listing requires account-storage rent in addition to the network fee; keep at least 0.005 SOL freely available in the connected wallet.` }, { status: 422 });
        }
        const logs = simulation.value.logs || [];
        const detail = [...logs].reverse().find((line) => line.includes("Error Message:") || line.includes("insufficient lamports") || line.includes("custom program error"));
        return Response.json({ error: detail ? `Transaction simulation failed: ${detail.replace("Program log: ", "")}` : `Transaction simulation failed: ${JSON.stringify(simulation.value.err)}` }, { status: 422 });
      }
      return Response.json({ simulation: "ok", unitsConsumed: simulation?.value?.unitsConsumed || 0 });
    }
    const [config] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.config)], program);
    const account = await rpc(secrets.get("SOLANA_RPC_URL"), "getAccountInfo", [config.toBase58(), { encoding: "base64", commitment: "confirmed" }]);
    if (!account?.value?.data?.[0] || account.value.owner !== PROGRAM_ID) throw new Error("SolHandle marketplace is not initialized on Mainnet-beta.");
    const bytes = Uint8Array.from(atob(account.value.data[0]), (character) => character.charCodeAt(0));
    const encode = (value) => { const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; let number = 0n; for (const byte of value) number = (number << 8n) + BigInt(byte); let out = ""; while (number) { out = alphabet[Number(number % 58n)] + out; number /= 58n; } for (const byte of value) { if (byte === 0) out = `1${out}`; else break; } return out || "1"; };
    const latest = await rpc(secrets.get("SOLANA_RPC_URL"), "getLatestBlockhash", [{ commitment: "confirmed" }]);
    return Response.json({ config: config.toBase58(), collection: encode(bytes.slice(40, 72)), rewardsVault: encode(bytes.slice(104, 136)), blockhash: latest.value.blockhash, lastValidBlockHeight: latest.value.lastValidBlockHeight, royaltyBps: 500 });
  } catch (error) {
    return Response.json({ error: error.message || "Unable to prepare marketplace transaction." }, { status: 500 });
  }
}