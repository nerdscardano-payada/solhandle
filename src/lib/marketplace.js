import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, SEEDS } from "@/lib/solhandleProtocol";

const encoder = new TextEncoder();
const seed = (value) => encoder.encode(value);

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