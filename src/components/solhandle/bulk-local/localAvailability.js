import { decodeSolHandleConfig } from '@/lib/solhandleProtocol';
import { normalizeHandle, validateHandle } from '@/lib/solhandle';
import { localRpc, localGenesis, METADATA_URL, decodeAccount } from '@/components/solhandle/bulk-local/localRpc';
import { PROGRAM, CORE, CLOCK, pda, checkedData, viewOf } from '@/components/solhandle/bulk-local/localCodec';
export async function localAvailability(names, expectedGenesis) {
  const handles = names.map(normalizeHandle);
  if (!handles.length || handles.length > 10 || new Set(handles).size !== handles.length) throw new Error('Choose 1–10 unique names.');
  for (const handle of handles) { const invalid = validateHandle(handle); if (invalid) throw new Error(invalid); }
  const genesis = await localGenesis(expectedGenesis);
  const addresses = [PROGRAM, CORE, pda('config'), CLOCK, pda('rush'), pda('collection'), ...handles.flatMap(handle => ['handle', 'restriction', 'price', 'premium', 'asset'].map(seed => pda(seed, handle)))];
  const { value } = await localRpc('getMultipleAccounts', [addresses.map(key => key.toBase58()), { encoding: 'base64', commitment: 'confirmed' }]);
  if (!value[0]?.executable || !value[1]?.executable) throw new Error('Start the local launcher with SolHandle and Metaplex Core deployed.');
  const config = decodeSolHandleConfig(await checkedData(value[2], 'Config'));
  if (config.paused || config.protocolVersion !== 2) throw new Error('The local protocol is paused or uses an unsupported version.');
  if (!config.collection.equals(pda('collection')) || value[5]?.owner !== CORE.toBase58()) throw new Error('The local official collection is missing.');
  const clock = decodeAccount(value[3]); if (!clock) throw new Error('Local chain clock is missing.');
  const now = viewOf(clock).getBigInt64(32, true);
  const rush = value[4]?.owner === PROGRAM.toBase58() ? await checkedData(value[4], 'RushConfig') : null;
  const rushView = rush && viewOf(rush), rushActive = rush && rush[8] === 1 && now >= rushView.getBigInt64(9, true) && now < rushView.getBigInt64(17, true);
  const items = await Promise.all(handles.map(async (handle, index) => {
    const [record, restriction, override, premium, asset] = value.slice(6 + index * 5, 11 + index * 5);
    const restrictionData = restriction?.owner === PROGRAM.toBase58() ? await checkedData(restriction, 'NameRestriction') : null;
    const overrideData = override?.owner === PROGRAM.toBase58() ? await checkedData(override, 'PriceOverride') : null;
    const premiumData = premium?.owner === PROGRAM.toBase58() ? await checkedData(premium, 'PremiumHandle') : null;
    let base = overrideData?.[16] === 1 ? viewOf(overrideData).getBigUint64(8, true) : config.pricesLamports[Math.min(handle.length - 1, 4)];
    if (rushActive) base = handle.length >= 3 ? rushView.getBigUint64(25, true) : base * rushView.getBigUint64(33, true) / 10000n;
    const price = base + (premiumData?.[8] === 1 ? rushActive ? rushView.getBigUint64(41, true) : 100000000n : 0n);
    if (price > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Local price exceeds the supported numeric range.');
    return { handle, uri: `${METADATA_URL}/${handle}.json`, priceLamports: Number(price), available: !record && !asset && restrictionData?.[9] !== 1, status: record || asset ? 'Already minted locally' : restrictionData?.[9] === 1 ? 'Restricted locally' : 'Available locally' };
  }));
  return { genesis, config, items };
}