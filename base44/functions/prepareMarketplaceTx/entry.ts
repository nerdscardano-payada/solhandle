import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { PublicKey } from "npm:@solana/web3.js@1.98.4";
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
    new PublicKey(body.wallet);
    const program = new PublicKey(PROGRAM_ID);
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