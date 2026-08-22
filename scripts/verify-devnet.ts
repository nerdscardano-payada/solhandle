import { Connection, PublicKey } from "@solana/web3.js";

const programId = new PublicKey(process.env.SOLHANDLE_PROGRAM_ID || "");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const [collection] = PublicKey.findProgramAddressSync([Buffer.from("collection")], programId);
const configInfo = await connection.getAccountInfo(config, "confirmed");
const collectionInfo = await connection.getAccountInfo(collection, "confirmed");

if (!configInfo || configInfo.owner.toBase58() !== programId.toBase58()) throw new Error("Fresh Config PDA is missing or owned by the wrong program.");
if (configInfo.data.length !== 186) throw new Error(`Unexpected Config size: ${configInfo.data.length}; expected 186.`);
if (!collectionInfo) throw new Error("Official Core collection PDA is missing.");

console.log(JSON.stringify({ verified: true, programId: programId.toBase58(), config: config.toBase58(), collection: collection.toBase58(), configBytes: configInfo.data.length }, null, 2));