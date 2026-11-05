import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import bs58 from 'npm:bs58@6.0.0';
import { rpc } from './solanaRpc.ts';
import { resolveOnChain } from './solhandleResolver.ts';
import { profileError } from './handleProfileProof.ts';
export const PASSPORT_VERSION = 'mainnet-mint-pump-create-v1';
const PROGRAMS = ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'];
const PUMP = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
const DOCS = 'https://github.com/pump-fun/pump-public-docs/blob/main/idl/pump.json';
export async function passportChain(url, input, requireOwner = true) {
  if (await rpc(url, 'getGenesisHash', []) !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp') throw profileError('De verificatiebron is niet Solana Mainnet.', 503);
  const [identity, account] = await Promise.all([resolveOnChain(url, input.handle), rpc(url, 'getAccountInfo', [input.mint, { encoding: 'jsonParsed', commitment: 'finalized' }])]);
  if (requireOwner && (!identity?.verified || identity.address !== input.wallet)) throw profileError('Deze wallet bezit deze officiële SolHandle niet.', 403);
  const info = account?.value?.data?.parsed?.info;
  if (!PROGRAMS.includes(account?.value?.owner) || account.value.data?.parsed?.type !== 'mint' || !info?.isInitialized) throw profileError('Dit adres is geen ondersteunde, geïnitialiseerde SPL-tokenmint.', 400);
  return { identity, checked_at: new Date().toISOString(), token: { program: account.value.owner, standard: account.value.owner === PROGRAMS[0] ? 'SPL Token' : 'Token-2022', decimals: info.decimals, supply: info.supply, mint_authority: info.mintAuthority || null, freeze_authority: info.freezeAuthority || null, slot: account.context.slot, method: 'Solana getAccountInfo / jsonParsed / finalized' } };
}
export async function passportCreator(url, input) {
  const base = { status: 'not_provided', method: 'Pump create/create_v2 transaction; creator parameter + user + transaction signer', docs: DOCS, checked_at: new Date().toISOString(), launch_tx: input.launch_tx || '' };
  if (!input.launch_tx) return base;
  const tx = await rpc(url, 'getTransaction', [input.launch_tx, { encoding: 'jsonParsed', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);
  if (!tx || tx.meta?.err || !tx.meta) return { ...base, status: 'not_established', reason: 'Geen beschikbare succesvolle, definitieve transactie.' };
  const signer = tx.transaction.message.accountKeys.some(key => key.pubkey === input.wallet && key.signer === true);
  for (const ix of tx.transaction.message.instructions) {
    if (ix.programId !== PUMP || !Array.isArray(ix.accounts) || ix.accounts[0] !== input.mint || typeof ix.data !== 'string') continue;
    let bytes; try { bytes = bs58.decode(ix.data); } catch { continue; }
    const original = [24,30,200,40,5,28,7,119].every((b,i) => bytes[i] === b), v2 = [214,144,76,236,95,139,49,180].every((b,i) => bytes[i] === b);
    if (!original && !v2) continue;
    let offset = 8, valid = true;
    for (let i = 0; i < 3; i++) { if (offset + 4 > bytes.length) { valid = false; break; } const size = new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, true); offset += 4; if (size > 4096 || offset + size > bytes.length) { valid = false; break; } offset += size; }
    if (!valid || offset + 32 > bytes.length) continue;
    const creator = new PublicKey(bytes.slice(offset, offset + 32)).toBase58();
    return { ...base, status: signer && creator === input.wallet && ix.accounts[original ? 7 : 5] === input.wallet ? 'matched' : 'not_matched', creator_wallet: creator, slot: tx.slot, block_time: tx.blockTime, instruction: original ? 'create' : 'create_v2', reason: 'Controle van de creator-parameter, user-account en ondertekenaar van dezelfde top-level Pump-creatie-instructie. Geen bewijs van een echte persoon.' };
  }
  return { ...base, status: 'not_established', reason: 'Geen ondersteunde top-level Pump create/create_v2-instructie voor deze mint. Andere launchplatformen en CPI-creaties zijn nog niet ondersteund.' };
}