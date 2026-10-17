// Native mainnet assets only. Never accept caller-provided mint addresses.
// USDC: https://developers.circle.com/stablecoins/usdc-contract-addresses
// USDt: https://tether.to/en/supported-protocols/
const tokens = Object.freeze({
  USDC: Object.freeze({ asset: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 }),
  USDT: Object.freeze({ asset: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 }),
});
export default function getPayToken(asset = 'USDT') {
  if (!Object.prototype.hasOwnProperty.call(tokens, asset)) throw Object.assign(new Error('Only official USDC and USDT on Solana are supported.'), { status: 400 });
  return tokens[asset];
}