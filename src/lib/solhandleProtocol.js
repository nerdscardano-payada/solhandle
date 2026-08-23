import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("3178akzXJ1fr86G1y7KRoBiYcq8MxJj8fayg3K3rUxrM");
export const PROTOCOL_VERSION = 2;
export const SEEDS = {
  config: "config",
  handle: "handle",
  asset: "asset",
  primary: "primary",
  restriction: "restriction",
  price: "price",
};

const publicKeyAt = (data, cursor) => new PublicKey(data.slice(cursor, cursor + 32));

export function decodeSolHandleConfig(data) {
  const bytes = Uint8Array.from(data);
  if (bytes.length !== 187) throw new Error(`Unexpected SolHandle Config layout (${bytes.length} bytes).`);
  let cursor = 8;
  const authority = publicKeyAt(bytes, cursor); cursor += 32;
  const collection = publicKeyAt(bytes, cursor); cursor += 32;
  const treasury = publicKeyAt(bytes, cursor); cursor += 32;
  const rewardsVault = publicKeyAt(bytes, cursor); cursor += 32;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const pricesLamports = Array.from({ length: 5 }, () => {
    const price = view.getBigUint64(cursor, true);
    cursor += 8;
    return price;
  });
  const totalMinted = view.getBigUint64(cursor, true); cursor += 8;
  const paused = bytes[cursor++] === 1;
  const bump = bytes[cursor++];
  const protocolVersion = bytes[cursor];
  return { authority, collection, treasury, rewardsVault, pricesLamports, totalMinted, paused, bump, protocolVersion };
}