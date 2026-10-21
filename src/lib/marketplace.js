import { PublicKey } from "@solana/web3.js";
import { base44 } from "@/api/base44Client";
import { PROGRAM_ID, SEEDS } from "@/lib/solhandleProtocol";

const MPL_CORE = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const encoder = new TextEncoder();
const seed = (value) => encoder.encode(value);
const join = (...parts) => Uint8Array.from(parts.flatMap((part) => [...part]));
const u64 = (value) => { const data = new Uint8Array(8); new DataView(data.buffer).setBigUint64(0, BigInt(value), true); return data; };
const text = (value) => { const content = encoder.encode(value); const size = new Uint8Array(4); new DataView(size.buffer).setUint32(0, content.length, true); return join(size, content); };
const hash = async (name) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(`global:${name}`)));
export const solToLamports = (value) => Math.round(Number(value) * 1_000_000_000);
export const lamportsToSol = (value) => (Number(value || 0) / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 4 });

export function marketplacePdas(asset, bidder) {
  const [listing] = PublicKey.findProgramAddressSync([seed(SEEDS.listing), asset.toBytes()], PROGRAM_ID);
  const [bid] = bidder ? PublicKey.findProgramAddressSync([seed(SEEDS.bid), asset.toBytes(), bidder.toBytes()], PROGRAM_ID) : [];
  return { listing, bid };
}

export async function executeMarketplaceAction({ action }) {
  if (!['delist', 'cancel_bid'].includes(action)) throw new Error('Native marketplace trading is retired. New trades and escrow are disabled.');
  throw new Error('Open /marketplace-recovery to review and cancel live positions with saved-signature recovery.');
}