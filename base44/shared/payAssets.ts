import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getAccountLen, ExtensionType } from 'npm:@solana/spl-token@0.4.14';
import { HANDLE_MINT } from './handlePaymentStatus.ts';
// Native mainnet assets only. Never accept caller-provided mint addresses.
// USDC: https://developers.circle.com/stablecoins/usdc-contract-addresses
// USDt: https://tether.to/en/supported-protocols/
const legacy = { programId: TOKEN_PROGRAM_ID.toBase58(), accountSize: 165 };
const tokens = Object.freeze({
  USDC: Object.freeze({ ...legacy, asset: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 }),
  USDT: Object.freeze({ ...legacy, asset: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 }),
  HANDLE: Object.freeze({ asset: 'HANDLE', mint: HANDLE_MINT, decimals: 6, programId: TOKEN_2022_PROGRAM_ID.toBase58(), accountSize: getAccountLen([ExtensionType.ImmutableOwner]) }),
});
export default function getPayToken(asset = 'USDT') {
  if (!Object.prototype.hasOwnProperty.call(tokens, asset)) throw Object.assign(new Error('Only official USDC, USDT and HANDLE on Solana are supported.'), { status: 400 });
  return tokens[asset];
}