import { Connection, PublicKey } from "@solana/web3.js";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const programId = new PublicKey(programIdText);
const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const connection = new Connection(rpcUrl, "confirmed");

const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const [collection] = PublicKey.findProgramAddressSync([Buffer.from("collection")], programId);
const configInfo = await connection.getAccountInfo(config, "confirmed");
const collectionInfo = await connection.getAccountInfo(collection, "confirmed");

if (!configInfo || !configInfo.owner.equals(programId)) throw new Error("Config PDA is missing or belongs to another program.");
if (configInfo.data.length !== 187) throw new Error(`Unexpected Config size: ${configInfo.data.length}; expected 187.`);
// layout: 8 disc | 32 authority | 32 collection | 32 treasury | 32 rewards | 40 prices | 8 totalMinted | 1 paused | 1 bump | 1 version
const paused = configInfo.data[184] === 1;
const protocolVersion = configInfo.data[186];
if (protocolVersion !== 2) throw new Error(`Unexpected protocol version: ${protocolVersion}.`);
if (!collectionInfo) throw new Error("Official SolHandle collection is missing.");

console.log(JSON.stringify({
  verified: true,
  network: "mainnet",
  protocolVersion: 2,
  programId: programId.toBase58(),
  config: config.toBase58(),
  collection: collection.toBase58(),
  paused,
}, null, 2));
if (!paused) console.warn("WARNING: protocol is currently LIVE (paused=false). Confirm this is intended before opening public mints.");
if (paused) console.log("Protocol is PAUSED. Flip paused=false via set_paused when ready to go live.");