import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import { rpc } from "./solanaRpc.ts";
import { PROGRAM_ID, SEEDS } from "./solhandleProtocol.ts";

function decodeBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

export async function getRushPricing(rpcUrl) {
  const program = new PublicKey(PROGRAM_ID);
  const [rush] = PublicKey.findProgramAddressSync([new TextEncoder().encode(SEEDS.rush)], program);
  const response = await rpc(rpcUrl, "getAccountInfo", [rush.toBase58(), { encoding: "base64", commitment: "confirmed" }]);
  const encoded = response?.value?.data?.[0];
  if (!encoded) return null;
  const bytes = decodeBase64(encoded);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    enabled: bytes[8] === 1,
    startAt: Number(view.getBigInt64(9, true)),
    endAt: Number(view.getBigInt64(17, true)),
    standardPriceLamports: Number(view.getBigUint64(25, true)),
    shortDiscountBps: Number(view.getBigUint64(33, true)),
    premiumSurchargeLamports: Number(view.getBigUint64(41, true))
  };
}