import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
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

export async function executeMarketplaceAction({ action, handle, assetAddress, amountLamports = 0, seller, bidder, wallet, signTransaction }) {
  if (!wallet || !signTransaction) throw new Error("Connect a wallet that can sign transactions.");
  const asset = new PublicKey(assetAddress); const sellerKey = new PublicKey(seller || wallet); const bidderKey = new PublicKey(bidder || wallet);
  const prepared = await base44.functions.invoke("prepareMarketplaceTx", { action, wallet: wallet.toBase58(), handle });
  const protocol = prepared.data; const config = new PublicKey(protocol.config); const collection = new PublicKey(protocol.collection); const rewards = new PublicKey(protocol.rewardsVault);
  const [record] = PublicKey.findProgramAddressSync([seed(SEEDS.handle), seed(handle)], PROGRAM_ID); const { listing, bid } = marketplacePdas(asset, bidderKey);
  const name = { list: "list_handle", buy: "buy_handle", delist: "delist_handle", bid: "place_bid", accept_bid: "accept_bid", cancel_bid: "cancel_bid" }[action];
  const discriminator = (await hash(name)).slice(0, 8); let keys; let args = new Uint8Array(); let pda = listing;
  if (action === "list") { keys = [[wallet,1,1],[config,0,0],[record,0,0],[asset,0,1],[listing,0,1],[collection,0,1],[SystemProgram.programId,0,0],[MPL_CORE,0,0]]; args = join(u64(amountLamports), u64(0)); }
  if (action === "buy") { keys = [[wallet,1,1],[config,0,0],[record,0,0],[asset,0,1],[listing,0,1],[sellerKey,0,1],[rewards,0,1],[collection,0,0],[SystemProgram.programId,0,0],[MPL_CORE,0,0]]; args = u64(amountLamports); }
  if (action === "delist") keys = [[wallet,1,1],[record,0,0],[asset,0,1],[listing,0,1],[collection,0,1],[SystemProgram.programId,0,0],[MPL_CORE,0,0]];
  if (action === "bid") { pda = bid; keys = [[wallet,1,1],[record,0,0],[asset,0,0],[bid,0,1],[SystemProgram.programId,0,0]]; args = join(u64(amountLamports), u64(0)); }
  if (action === "accept_bid") { pda = bid; keys = [[wallet,1,1],[config,0,0],[record,0,0],[asset,0,1],[listing,0,1],[bid,0,1],[bidderKey,0,1],[rewards,0,1],[collection,0,0],[SystemProgram.programId,0,0],[MPL_CORE,0,0]]; }
  if (action === "cancel_bid") { pda = bid; keys = [[wallet,1,1],[record,0,0],[asset,0,0],[bid,0,1]]; }
  if (action === "delist") {
    const openBids = await base44.entities.NativeBid.filter({ asset_address: asset.toBase58(), status: "ACTIVE" }, "-created_at", 20);
    keys.push(...openBids.flatMap((offer) => [[new PublicKey(offer.bid_pda),0,1],[new PublicKey(offer.bidder),0,1]]));
  }
  const instruction = new TransactionInstruction({ programId: PROGRAM_ID, keys: keys.map(([pubkey,isSigner,isWritable]) => ({ pubkey, isSigner: Boolean(isSigner), isWritable: Boolean(isWritable) })), data: join(discriminator, args) });
  const signed = await signTransaction(new Transaction({ feePayer: wallet, recentBlockhash: protocol.blockhash }).add(instruction));
  const transaction_base64 = btoa(String.fromCharCode(...signed.serialize()));
  const submitted = await base44.functions.invoke("submitMarketplaceTx", { action, transaction_base64, wallet: wallet.toBase58(), handle, asset: asset.toBase58(), pda: pda.toBase58(), amount_lamports: amountLamports, seller: sellerKey.toBase58(), bidder: bidderKey.toBase58(), buyer: action === "accept_bid" ? bidderKey.toBase58() : wallet.toBase58(), rewards_vault: rewards.toBase58() });
  return submitted.data;
}