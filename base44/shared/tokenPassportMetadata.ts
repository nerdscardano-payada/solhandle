import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { passportFailure } from './tokenPassportTestStore.ts';
const classic = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', token2022 = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
const metadataProgram = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
export function passportAddress(value) {
  try { if (typeof value !== 'string' || value.length > 44) throw new Error(); return new PublicKey(value).toBase58(); }
  catch { throw passportFailure('Enter a valid Solana address.'); }
}
export async function assertPassportMainnet(url) {
  if (await rpc(url, 'getGenesisHash') !== '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') throw passportFailure('The configured connection is not Solana Mainnet. Test registration is blocked.', 503);
}
const clean = (value, max) => typeof value === 'string' ? value.replace(/[\x00-\x1f\x7f]/g, '').trim().slice(0, max) : '';
function readMetadata(encoded, mint) {
  const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  if (bytes.length < 69 || bytes[0] !== 4 || new PublicKey(bytes.slice(33,65)).toBase58() !== mint) throw new Error('Invalid metadata');
  const view = new DataView(bytes.buffer); let offset = 65;
  const string = max => { if (offset + 4 > bytes.length) throw new Error('Invalid metadata'); const size = view.getUint32(offset,true); offset += 4; if (size > max || offset + size > bytes.length) throw new Error('Invalid metadata'); const text = new TextDecoder('utf-8',{fatal:true}).decode(bytes.slice(offset,offset+size)); offset += size; return clean(text,max); };
  return { name: string(128), symbol: string(32), uri: string(512), metadata_authority: new PublicKey(bytes.slice(1,33)).toBase58(), metadata_source: 'Metaplex Token Metadata' };
}
export async function passportToken(url, input) {
  const mint = passportAddress(input), result = await rpc(url, 'getAccountInfo', [mint, {encoding:'jsonParsed',commitment:'confirmed'}]);
  const account = result?.value, info = account?.data?.parsed?.info;
  if (![classic,token2022].includes(account?.owner) || account?.data?.parsed?.type !== 'mint' || info?.isInitialized !== true || !Number.isInteger(info.decimals) || !/^\d{1,20}$/.test(String(info.supply))) throw passportFailure('This address is not an initialized supported token mint.');
  const snapshot = { mint, network:'mainnet-beta', token_program:account.owner, decimals:info.decimals, supply_raw:String(info.supply), mint_authority:info.mintAuthority || null, freeze_authority:info.freezeAuthority || null, name:'', symbol:'', uri:'', metadata_authority:null, metadata_source:'unavailable', slot:result.context.slot, checked_at:new Date().toISOString() };
  if (account.owner === token2022) {
    const extensions = info.extensions || [];
    const pointer = extensions.find(value=>value.extension==='metadataPointer')?.state;
    const metadata = extensions.find(value=>value.extension==='tokenMetadata')?.state;
    if (metadata && metadata.mint === mint && pointer?.metadataAddress === mint) Object.assign(snapshot,{name:clean(metadata.name,128),symbol:clean(metadata.symbol,32),uri:clean(metadata.uri,512),metadata_authority:metadata.updateAuthority || null,metadata_source:'Token-2022 on-mint metadata'});
    snapshot.extensions = extensions.map(value=>clean(value.extension,60)).slice(0,20);
  }
  if (snapshot.metadata_source === 'unavailable') {
    const program = new PublicKey(metadataProgram), [pda] = PublicKey.findProgramAddressSync([new TextEncoder().encode('metadata'),program.toBytes(),new PublicKey(mint).toBytes()],program);
    const metadata = await rpc(url,'getAccountInfo',[pda.toBase58(),{encoding:'base64',commitment:'confirmed'}]);
    if (metadata?.value?.owner === metadataProgram && metadata.value.data?.[0]) {
      try { Object.assign(snapshot,readMetadata(metadata.value.data[0],mint)); } catch { snapshot.metadata_source = 'unsupported or invalid metadata'; }
    }
  }
  return snapshot;
}