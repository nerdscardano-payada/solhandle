import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { parseMintEvent, PROGRAM_ID } from './solanaRpc.ts';
export function weekendMintEvents(transaction) {
  const stack = [], events = [];
  for (const line of transaction.meta?.logMessages || []) {
    const invoke = line.match(/^Program (\w+) invoke \[(\d+)\]/);
    if (invoke) { stack.length = Number(invoke[2]) - 1; stack.push(invoke[1]); continue; }
    if (/^Program \w+ (success|failed:)/.test(line)) { stack.pop(); continue; }
    if (stack.at(-1) !== PROGRAM_ID || !line.startsWith('Program data: ')) continue;
    const encoded = line.slice(14), mint = parseMintEvent(encoded);
    if (!mint) continue;
    const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    const length = new DataView(bytes.buffer).getUint32(8, true);
    // Only public mints. Authority-granted official claims are not qualifying purchases.
    if (bytes.length !== 12 + length + 73 || bytes.at(-1) !== 0) continue;
    const [asset] = PublicKey.findProgramAddressSync([new TextEncoder().encode('asset'), new TextEncoder().encode(mint.handle)], new PublicKey(PROGRAM_ID));
    if (asset.toBase58() !== mint.assetAddress) throw new Error('Mint event asset does not match the official protocol PDA.');
    events.push(mint);
  }
  return events;
}