const encoder = new TextEncoder();
async function discriminator(name) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(name))).slice(0, 8);
}
const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
export async function primaryMintEarnPolicy(input, chain) {
  if (input.source && input.source !== 'MINT') return { eligible: true, reason: 'unrelated_revenue' };
  if (!/^[a-z0-9]{1,20}$/.test(input.handle || '')) throw new Error('Invalid mint handle for Earn verification.');
  const addresses = chain.addresses(input.handle);
  if (input.assetAddress !== addresses.asset) throw new Error('Earn mint asset does not match the handle PDA.');
  const tx = await chain.transaction(input.signature);
  if (!tx || !tx.meta || tx.meta.err || !Number.isSafeInteger(tx.slot)) throw new Error('Successful mint transaction is required for Earn verification.');
  const account = await chain.receipt(addresses.receipt, tx.slot);
  if (!account || !Number.isSafeInteger(account.context?.slot) || account.context.slot < tx.slot) throw new Error('Receipt verification is behind the mint transaction.');
  if (!account.value) return { eligible: true, reason: 'ordinary_mint' };
  const receipt = account.value;
  if (receipt.owner !== chain.program || receipt.executable || !Array.isArray(receipt.data) || receipt.data[1] !== 'base64') throw new Error('Untrusted Partner Mint receipt.');
  const bytes = Uint8Array.from(atob(receipt.data[0]), c => c.charCodeAt(0));
  if (bytes.length !== 249 || !same(bytes.slice(0, 8), await discriminator('account:PartnerMintReceipt'))) throw new Error('Invalid Partner Mint receipt layout.');
  if (!same(bytes.slice(40, 72), chain.keyBytes(addresses.asset))) throw new Error('Partner Mint receipt asset mismatch.');
  const owner = input.buyerWallet || input.referredWallet;
  if (!owner || !same(bytes.slice(72, 104), chain.keyBytes(owner))) throw new Error('Partner Mint receipt original owner mismatch.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const price = view.getBigUint64(168, true), partner = view.getBigUint64(176, true), treasury = view.getBigUint64(184, true);
  if (partner !== price / 2n || treasury !== price - partner) throw new Error('Partner Mint receipt split mismatch.');
  return { eligible: false, reason: 'partner_mint_primary_excluded', receipt: addresses.receipt };
}