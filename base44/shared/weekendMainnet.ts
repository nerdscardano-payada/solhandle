import { rpc } from './solanaRpc.ts';
export async function requireWeekendMainnet(url) {
  if (await rpc(url, 'getGenesisHash', []) !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') throw new Error('Campaign requires Solana Mainnet-beta.');
}