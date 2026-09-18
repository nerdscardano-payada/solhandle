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
      const rpcUrl = secrets.get("SOLANA_RPC_URL");
      const walletAccount = await rpc(rpcUrl, "getAccountInfo", [wallet.toBase58(), { encoding: "base64", commitment: "confirmed" }]);
      if (!walletAccount?.value) return Response.json({ error: "Your connected wallet has no SOL on Mainnet. Fund this wallet with a small amount of SOL for the listing account rent and network fee, then try again." }, { status: 422 });
      const simulation = await rpc(rpcUrl, "simulateTransaction", [body.transaction_base64, { encoding: "base64", sigVerify: false, replaceRecentBlockhash: true, commitment: "confirmed" }]);
      if (simulation?.value?.err) {
        const rentError = simulation.value.err?.InsufficientFundsForRent;
        if (rentError && Number.isInteger(rentError.account_index)) {
          const accountKey = transaction.compileMessage().accountKeys[rentError.account_index];
          const account = accountKey?.toBase58();
          const labels = {
            list: ["seller wallet", "protocol config", "handle record", "handle NFT asset", "marketplace listing PDA", "official collection", "system program", "Metaplex Core program"],
            buy: ["buyer wallet", "protocol config", "handle record", "handle NFT asset", "marketplace listing PDA", "seller wallet", "protocol rewards vault", "official collection", "system program", "Metaplex Core program"],
            delist: ["seller wallet", "handle record", "handle NFT asset", "marketplace listing PDA", "official collection", "system program", "Metaplex Core program"],
            bid: ["bidder wallet", "handle record", "handle NFT asset", "marketplace bid PDA", "system program"],
            accept_bid: ["seller wallet", "protocol config", "handle record", "handle NFT asset", "marketplace listing PDA", "marketplace bid PDA", "bidder wallet", "protocol rewards vault", "official collection", "system program", "Metaplex Core program"],
            cancel_bid: ["bidder wallet", "handle record", "handle NFT asset", "marketplace bid PDA"]
          };
          const instructionIndex = accountKey ? transaction.instructions[0].keys.findIndex((key) => key.pubkey.equals(accountKey)) : -1;
          const accountLabel = instructionIndex >= 0 ? labels[body.action]?.[instructionIndex] || "marketplace account" : "marketplace account";
          const rpcUrl = secrets.get("SOLANA_RPC_URL");
          const [balance, affectedBalance, minimumRent] = await Promise.all([
            rpc(rpcUrl, "getBalance", [wallet.toBase58(), { commitment: "confirmed" }]),
            account ? rpc(rpcUrl, "getBalance", [account, { commitment: "confirmed" }]) : Promise.resolve({ value: 0 }),
            rpc(rpcUrl, "getMinimumBalanceForRentExemption", [0, { commitment: "confirmed" }])
          ]);
          const walletSol = (Number(balance?.value || 0) / 1_000_000_000).toFixed(6);
          if (accountLabel === "protocol rewards vault") {
            const vaultSol = (Number(affectedBalance?.value || 0) / 1_000_000_000).toFixed(6);
            const minimumSol = (Number(minimumRent || 0) / 1_000_000_000).toFixed(6);
            return Response.json({ error: `The protocol rewards vault (${account}) holds ${vaultSol} SOL and must be funded once to at least ${minimumSol} SOL before it can receive the marketplace royalty. Your connected wallet balance of ${walletSol} SOL is sufficient.` }, { status: 422 });
          }
          return Response.json({ error: `Rent-exemption failed for the ${accountLabel}${account ? ` (${account})` : ""}. RPC confirms the connected wallet holds ${walletSol} SOL, so this is not a low-wallet-balance error.` }, { status: 422 });
        }
        const logs = simulation.value.logs || [];
        const systemBalanceFailure = logs.some((line) => line.includes("custom program error: 0x1"));
        if (systemBalanceFailure && (body.action === "list" || body.action === "bid")) {
          const balance = await rpc(rpcUrl, "getBalance", [wallet.toBase58(), { commitment: "confirmed" }]);
          const walletSol = (Number(balance?.value || 0) / 1_000_000_000).toFixed(6);
          return Response.json({ error: `Your wallet holds ${walletSol} SOL. Solana rejected this ${body.action === "list" ? "listing" : "bid"} because there is not enough available SOL for the required account rent and network fee. Add a small amount of SOL and try again.` }, { status: 422 });
        }
        const pluginAlreadyExists = logs.some((line) => line.includes("custom program error: 0xf"));
        if (pluginAlreadyExists && body.action === "list") {
          return Response.json({ error: "This handle still has marketplace transfer permission from an earlier listing. Relisting requires the latest SolHandle marketplace program upgrade." }, { status: 422 });
        }
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