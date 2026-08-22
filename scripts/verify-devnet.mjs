import { Connection, PublicKey } from "@solana/web3.js";

const programIdText = process.env.SOLHANDLE_PROGRAM_ID;
if (!programIdText) throw new Error("SOLHANDLE_PROGRAM_ID is required.");
const programId = new PublicKey(programIdText);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], programId);
const [collection] = PublicKey.findProgramAddressSync([Buffer.from("collection")], programId);
const configInfo = await connection.getAccountInfo(config, "confirmed");
const collectionInfo = await connection.getAccountInfo(collection, "confirmed");
if (!configInfo || !configInfo.owner.equals(programId)) throw new Error("Config PDA is missing or belongs to another program.");
if (configInfo.data.length !== 187) throw new Error(`Unexpected Config size: ${configInfo.data.length}; expected 187.`);
if (configInfo.data[186] !== 1) throw new Error(`Unexpected protocol version: ${configInfo.data[186]}.`);
if (!collectionInfo) throw new Error("Official SolHandle Core collection is missing.");
console.log(JSON.stringify({ verified: true, protocolVersion: 1, programId: programId.toBase58(), config: config.toBase58(), collection: collection.toBase58() }, null, 2));