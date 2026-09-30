import { rpc, deriveHandleAccountAddresses, parseHandleRecord, parseNameRestrictionAccount, PROGRAM_ID } from './solanaRpc.ts';
export async function namesChain(base44, rpcUrl, handles) {
  if (!handles.length) return [];
  const addresses = handles.map(deriveHandleAccountAddresses);
  const [chain, protections, listings] = await Promise.all([
    rpc(rpcUrl, 'getMultipleAccounts', [addresses.flatMap(a => [a.record, a.restriction]), { encoding: 'base64', commitment: 'confirmed' }]),
    base44.asServiceRole.entities.ProtectedName.filter({ handle: { $in: handles }, status: 'active' }, { limit: 100, fields: ['handle', 'restriction_type'] }),
    base44.asServiceRole.entities.NativeListing.filter({ handle: { $in: handles }, status: 'ACTIVE' }, { limit: 100, sort: '-created_at', fields: ['handle', 'asset_address', 'price_lamports'] })
  ]);
  if (!chain?.value || chain.value.length !== handles.length * 2) throw new Error('Live availability could not be verified. Please try again.');
  return handles.map((handle, i) => {
    const account = chain.value[i * 2];
    if (account && account.owner !== PROGRAM_ID) throw new Error('Invalid handle record owner.');
    const record = account?.data?.[0] ? parseHandleRecord(account.data[0]) : null;
    if (record && record.handle !== handle) throw new Error('Invalid handle record.');
    const restriction = parseNameRestrictionAccount(chain.value[i * 2 + 1], addresses[i].restriction);
    const protectedName = protections.items.find(p => p.handle === handle);
    const listing = record ? listings.items.find(l => l.handle === handle && l.asset_address === record.assetAddress) : null;
    const status = record ? listing ? 'FOR_SALE' : 'OWNED' : restriction?.active ? restriction.restrictionType : protectedName ? protectedName.restriction_type || 'PROTECTED' : 'AVAILABLE';
    return { handle, status, asset: record?.assetAddress || null, askLamports: listing?.price_lamports || null, verifiedAt: new Date().toISOString() };
  });
}