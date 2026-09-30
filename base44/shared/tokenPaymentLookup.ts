import { AddressLookupTableAccount, AddressLookupTableProgram, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, SystemProgram } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { pda, mint } from './handleTokenTransactions.ts';
export function lookupAddresses(protocol, payment, tokenProgram) {
  return [pda('config'), pda('token_payment'), pda('rush'), pda('premium'), new PublicKey(protocol.collection), mint, new PublicKey(payment.treasuryToken), tokenProgram, SYSVAR_INSTRUCTIONS_PUBKEY, SystemProgram.programId, new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d')];
}
export async function lookupSettings(base44) {
  const page = await base44.asServiceRole.entities.TokenLaunchSettings.filter({}, { sort: '-updated_date', limit: 1 });
  return page.items[0] || null;
}
export async function readFrozenLookup(rpcUrl, address, addresses) {
  const result = await rpc(rpcUrl, 'getAccountInfo', [new PublicKey(address).toBase58(), { encoding: 'base64', commitment: 'finalized' }]);
  if (!result.value) return null;
  if (result.value.owner !== AddressLookupTableProgram.programId.toBase58()) throw new Error('Invalid lookup table owner.');
  const data = Uint8Array.from(atob(result.value.data[0]), c => c.charCodeAt(0));
  const state = AddressLookupTableAccount.deserialize(data);
  if (state.authority || state.deactivationSlot !== 18446744073709551615n || state.addresses.length !== addresses.length || !addresses.every((key, i) => key.equals(state.addresses[i]))) throw new Error('The lookup table must be frozen and contain exactly the verified protocol accounts.');
  if (result.context.slot <= state.lastExtendedSlot) return null;
  return new AddressLookupTableAccount({ key: new PublicKey(address), state });
}
export async function activeTokenLookup(base44, rpcUrl, addresses) {
  const settings = await lookupSettings(base44);
  if (!settings?.token_payment_lookup_table) return null;
  const table = await readFrozenLookup(rpcUrl, settings.token_payment_lookup_table, addresses);
  if (!table) throw new Error('The configured token lookup table is not finalized yet. Please retry shortly.');
  return table;
}
export function lookupSetupInstructions(authority, recentSlot, addresses) {
  if (!Number.isSafeInteger(recentSlot) || recentSlot < 1) throw new Error('Invalid lookup table slot.');
  const [create, address] = AddressLookupTableProgram.createLookupTable({ authority, payer: authority, recentSlot });
  const extend = AddressLookupTableProgram.extendLookupTable({ authority, payer: authority, lookupTable: address, addresses });
  const freeze = AddressLookupTableProgram.freezeLookupTable({ authority, lookupTable: address });
  return { address, instructions: [create, extend, freeze] };
}